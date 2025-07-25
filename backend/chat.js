import { spawn } from 'child_process';
import { extractTextFromPDF } from './pdfParser.js';
import axios from 'axios';

export async function handlePDFVectorization(filePath) {
  console.log('📄 Starting vectorization for:', filePath); // Add this

  const pages = await extractTextFromPDF(filePath);

  console.log('Extracted text pages count:', pages.length); // Add this

  return new Promise((resolve, reject) => {
    const py = spawn('python3', ['vectorizer.py', 'build']);

    py.stdin.write(JSON.stringify(pages));
    py.stdin.end();

    py.stderr.on('data', err => {
      console.error('[ Python STDERR]', err.toString());  // Add this
    });

    py.on('close', code => {
      console.log('Python exited with code:', code);     // Add this
      if (code === 0) {
        resolve(true);
      } else {
        reject('Python failed');
      }
    });
  });
}


export async function handleQuery(question) {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', ['vectorizer.py', 'query']);

    let output = '';
    let errorOutput = '';

    py.stdout.on('data', chunk => {
      output += chunk.toString();
    });

    py.stderr.on('data', err => {
      errorOutput += err.toString();
      console.error('[ Python STDERR]', err.toString());
    });

    py.on('close', code => {
      if (code !== 0) {
        return reject(`Python process exited with code ${code}. Stderr: ${errorOutput}`);
      }

      try {
        const parsed = JSON.parse(output);
        resolve(parsed);
      } catch (e) {
        reject(` JSON parse error: ${e.message}\nRaw Output:\n${output}`);
      }
    });

     
    py.stdin.write(JSON.stringify({ question }));
    py.stdin.end();
  });
}
 