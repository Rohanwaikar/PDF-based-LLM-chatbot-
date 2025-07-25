import React, { useState } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';

  
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;



function App() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');
  const [rawPath, setRawPath] = useState('');
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleFileChange = (e) => {
    const formData = new FormData();
    formData.append('pdf', e.target.files[0]);
    axios.post(`${BASE_URL}/upload`, formData)
      .then(res => {
        setFile(`${BASE_URL}/uploads/${res.data.filePath}`);
        setRawPath(res.data.filePath);
      });
  };

  const handleChat = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/chat`, {
      question: input,
      filePath: rawPath,
    });

    const { answer, citations } = res.data;

    setChat(prevChat => [
      ...prevChat,
      { question: input, answer, citations }
    ]);

    setInput('');
  } catch (err) {
    console.error('Chat request failed:', err);
    alert('Error: ' + (err.response?.data?.error || err.message));
  }
};



  return (
    <div style={{ display: 'flex', padding: 20 }}>
      <div style={{ flex: 1 }}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        {file && (
          <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
            <Page pageNumber={pageNumber} />
          </Document>
        )}
        <div>
          <button onClick={() => setPageNumber(p => Math.max(1, p - 1))}>Prev</button>
          <span> Page {pageNumber} </span>
          <button onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}>Next</button>
        </div>
      </div>
      <div style={{ flex: 1, marginLeft: 20 }}>
        <div style={{ height: '70vh', overflowY: 'scroll' }}>
          {chat.map((c, i) => (
            <div key={i}>
              <strong>You:</strong> {c.question}
              <div>
                <strong>AI:</strong> {c.answer}
                {c.citations?.map((pg, idx) => (
                  <button key={idx} onClick={() => setPageNumber(pg)}>Page {pg}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button onClick={handleChat}>Send</button>
      </div>
    </div>
  );
}

export default App;