// src/server.ts
import { analyzeJDResume, searchAndRankJobs } from "./agent.ts";
import { extractTextFromPDF } from "./tools/pdf_parser.ts";

const PORT = Number(Deno.env.get("PORT") || 8000);
console.log(`Server listening on http://localhost:${PORT}`);

async function start() {
  try {
    await Deno.serve({ port: PORT }, async (req) => {
      try {
        const url = new URL(req.url);
        if (req.method === "POST" && url.pathname === "/analyze") {
          const body = await req.json();
          const jd = body.jd || "";
          const resume = body.resume || "";
          if (!jd || !resume) {
            return new Response(JSON.stringify({ error: "Provide both jd and resume" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          const analysis = await analyzeJDResume(jd, resume);
          return new Response(JSON.stringify({ analysis }), { headers: { "Content-Type": "application/json" } });
        }
        
        if (req.method === "POST" && url.pathname === "/upload-pdf") {
          try {
            const formData = await req.formData();
            const pdfFile = formData.get("pdf");
            
            if (!pdfFile || !(pdfFile instanceof File)) {
              return new Response(JSON.stringify({ error: "No PDF file provided" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }
            
            // Check file type
            if (pdfFile.type !== "application/pdf") {
              return new Response(JSON.stringify({ error: "File must be a PDF" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }
            
            // Read PDF file as Uint8Array
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdfBuffer = new Uint8Array(arrayBuffer);
            
            // Extract text from PDF
            const extractedText = await extractTextFromPDF(pdfBuffer);
            
            return new Response(JSON.stringify({ text: extractedText }), {
              headers: { "Content-Type": "application/json" },
            });
          } catch (err) {
            console.error("Error processing PDF upload:", err);
            return new Response(JSON.stringify({ error: `Failed to parse PDF: ${err instanceof Error ? err.message : String(err)}` }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
        }
        
        if (req.method === "POST" && url.pathname === "/search-jobs") {
          const body = await req.json();
          const resume = body.resume || "";
          const preferences = {
            role: body.role,
            location: body.location,
            keywords: body.keywords,
          };
          
          if (!resume) {
            return new Response(JSON.stringify({ error: "Provide resume text" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          
          const result = await searchAndRankJobs(resume, preferences);
          return new Response(JSON.stringify({ result }), { headers: { "Content-Type": "application/json" } });
        }
        // serve index.html from project root
        const html = await Deno.readTextFile("index.html");
        return new Response(html, { headers: { "Content-Type": "text/html" } });
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
      }
    });
  } catch (err) {
    console.error("Failed to start server", err);
    Deno.exit(1);
  }
}

start();
