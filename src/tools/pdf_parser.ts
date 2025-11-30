// src/tools/pdf_parser.ts
import pdfParse from "npm:pdf-parse";
import { Buffer } from "node:buffer";

/**
 * Extract text from a PDF file buffer
 */
export async function extractTextFromPDF(pdfBuffer: Uint8Array): Promise<string> {
  try {
    // pdf-parse expects a Buffer, convert Uint8Array to Buffer
    const buffer = Buffer.from(pdfBuffer);
    
    // Parse PDF and extract text
    const data = await pdfParse(buffer);
    
    // Return the extracted text
    return data.text.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
}
