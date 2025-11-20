import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const API_KEY = process.env.IBM_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const tokenResponse = await fetch("https://iam.cloud.ibm.com/identity/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${API_KEY}`,
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("IBM Auth Error:", errorText);
      return NextResponse.json(
        {
          error: "Failed to authenticate with IBM Cloud",
          details: process.env.NODE_ENV === "development" ? errorText : undefined,
        },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const trimmedPrompt = prompt.trim();

    const requestBody = {
      messages: [
        {
          role: "user",
          content: trimmedPrompt,
        },
      ],
    };

    const deploymentId = "5aa6ccdd-c87e-4e8c-ad65-47fea74723fa";
    const scoringUrl = `https://us-south.ml.cloud.ibm.com/ml/v4/deployments/${deploymentId}/ai_service_stream?version=2021-05-01`;

    const mlResponse = await fetch(scoringUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
        console.error("IBM ML Error (parsed):", JSON.stringify(errorData, null, 2));
      } catch {
        console.error("IBM ML Error (raw):", errorText);
        errorData = { raw: errorText };
      }

      return NextResponse.json(
        {
          error: "Failed to get mind map from IBM ML service",
          details: process.env.NODE_ENV === "development" ? errorText : undefined,
          errorData,
        },
        { status: mlResponse.status }
      );
    }

    const contentType = mlResponse.headers.get("content-type") || "";
    const responseText = await mlResponse.text();
    let result;

    if (contentType.includes("text/event-stream")) {
      const events = responseText.split("\n\n").filter(Boolean);
      let finalText = "";
      const deltas = [];

      for (const event of events) {
        const dataLine = event
          .split("\n")
          .find((line) => line.startsWith("data: "));

        if (!dataLine) continue;

        const payload = dataLine.slice(6);
        try {
          const data = JSON.parse(payload);
          const choice = data.choices?.[0];
          const delta = choice?.delta;

          // Skip tool responses (these contain raw PDF chunks)
          if (!delta || delta.role === "tool" || delta.tool_calls) {
            continue;
          }

          if (delta.content) {
            finalText += delta.content;
            deltas.push(delta.content);
          }
        } catch (err) {
          console.warn("Failed to parse SSE payload:", payload);
        }
      }

      result = {
        text: finalText.trim(),
        deltas,
        raw: responseText,
        format: "sse",
      };
    } else if (contentType.includes("application/json")) {
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        result = { text: responseText, raw: responseText };
      }
    } else {
      result = { text: responseText, raw: responseText };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in mindmap API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

