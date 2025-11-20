import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    let requestData;
    try {
      requestData = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body. Expected JSON.' },
        { status: 400 }
      );
    }
    
    const { prompt } = requestData;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const trimmedPrompt = prompt.trim();
    console.log('Received prompt:', trimmedPrompt);

    // Get API key from environment variable (server-side only)
    const API_KEY = process.env.IBM_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Step 1: Get authentication token from IBM Cloud
    const tokenResponse = await fetch('https://iam.cloud.ibm.com/identity/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${API_KEY}`,
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('IBM Auth Error:', errorText);
      return NextResponse.json(
        { 
          error: 'Failed to authenticate with IBM Cloud',
          details: process.env.NODE_ENV === 'development' ? errorText : undefined
        },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Failed to get access token from IBM Cloud' },
        { status: 500 }
      );
    }

    console.log('Got access token, length:', accessToken.length);

    // Step 2: Call IBM ML service with the token
    const deploymentId = 'e52118c7-28a3-4b19-9af3-6ed9419f9b4d';
    
    // Build the messages array - role should be "user" and content should be just the prompt
    const requestBody = {
      messages: [{
        role: 'user',
        content: trimmedPrompt
      }]
    };
    const requestBodyString = JSON.stringify(requestBody);
    console.log('=== IBM ML Request ===');
    console.log('Prompt:', trimmedPrompt);
    console.log('Request body:', requestBodyString);
    console.log('====================');
    
    // Use streaming endpoint (ai_service_stream) - this is what the documentation shows
    const scoringUrl = `https://us-south.ml.cloud.ibm.com/ml/v4/deployments/${deploymentId}/ai_service_stream?version=2021-05-01`;
    
    console.log('Using streaming endpoint:', scoringUrl);
    const mlResponse = await fetch(scoringUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: requestBodyString,
    });

    console.log('Response status:', mlResponse.status);
    console.log('Response headers:', Object.fromEntries(mlResponse.headers.entries()));

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
        console.error('IBM ML Error (parsed):', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.error('IBM ML Error (raw):', errorText);
        errorData = { raw: errorText };
      }
      
      // Provide helpful error message
      let errorMessage = 'Failed to get simplification from IBM ML service';
      if (mlResponse.status === 500) {
        errorMessage += '. This is an internal server error from IBM. Please check:\n' +
          '1. The deployment is active in IBM Cloud Console\n' +
          '2. The deployment ID is correct: ' + deploymentId + '\n' +
          '3. The model is properly configured and running\n' +
          '4. Your API key has access to this deployment';
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? errorText : undefined,
          errorData: errorData,
          deploymentId: deploymentId
        },
        { status: mlResponse.status }
      );
    }

    // Handle streaming response - get as text first
    const contentType = mlResponse.headers.get('content-type') || '';
    const responseText = await mlResponse.text();
    
    console.log('IBM ML Response Content-Type:', contentType);
    
    let result;
    
    // Check if it's Server-Sent Events (SSE) format
    if (contentType.includes('text/event-stream') || contentType.includes('event-stream')) {
      // Parse SSE format
      const events = responseText.split('\n\n').filter(event => event.trim());
      let fullContent = '';
      const deltas = [];
      
      for (const event of events) {
        const lines = event.split('\n');
        let dataLine = null;
        
        // Find the data line
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            dataLine = line.substring(6); // Remove 'data: ' prefix
            break;
          }
        }
        
        if (dataLine) {
          try {
            const data = JSON.parse(dataLine);
            // Extract content from delta
            if (data.choices && data.choices[0] && data.choices[0].delta) {
              const delta = data.choices[0].delta;
              if (delta.content) {
                fullContent += delta.content;
                deltas.push(delta);
              }
            }
          } catch (parseError) {
            console.warn('Failed to parse SSE data line:', dataLine);
          }
        }
      }
      
      result = {
        text: fullContent,
        content: fullContent,
        deltas: deltas,
        format: 'sse',
        raw: responseText.substring(0, 1000) // Store first 1000 chars for debugging
      };
    } else if (contentType.includes('application/json')) {
      // Try to parse as JSON
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        result = {
          text: responseText,
          raw: responseText,
          error: 'Response was marked as JSON but could not be parsed'
        };
      }
    } else {
      // Plain text or unknown format
      result = {
        text: responseText,
        raw: responseText,
        contentType: contentType,
        note: 'Response was not JSON or SSE format'
      };
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in simplify API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

