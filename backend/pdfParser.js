// backend/pdfParser.js
import fs from 'fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

export async function extractTextFromPDF(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const pdf = await getDocument({ data }).promise;
  const pages = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map(item => item.str).join(' ');
    pages.push({ page: i, text });
  }

  return pages;
}
