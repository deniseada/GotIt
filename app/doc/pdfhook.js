// "use client";
// import {useEffect} from "react";
// import * as PDFJS from "pdfjs-dist/types/src/pdf";

// export const usePDFJS = (onLoad=()=>{}, deps=[]) => {
  
//   const [pdfjs, setPDFJS] = useState<typeof PDFJS>(null);
  
//   // load the library once on mount (the webpack import automatically sets-up the worker)
//   useEffect(() => {
//     import("pdfjs-dist/webpack.mjs").then(setPDFJS)
//   }, []);

//   // execute the callback function whenever PDFJS loads (or a custom dependency-array updates)
//   useEffect(() => {
//     if(!pdfjs) return;
//     (async () => await onLoad(pdfjs))();
//   }, [ pdfjs, ...deps ]);
// }