import { pdfjs } from 'react-pdf';

// Set up worker path manually
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`;