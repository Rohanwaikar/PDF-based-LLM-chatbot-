// backend/index.js
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { handlePDFVectorization, handleQuery } from './chat.js';

const app = express();
const PORT = 5002;
const uploadDir = path.resolve('./uploads');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync('./store')) fs.mkdirSync('./store');

const upload = multer({ dest: uploadDir });

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(uploadDir));


app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Uploaded file:', req.file);

    const filePath = req.file.path;
    await handlePDFVectorization(filePath);
    res.json({ filePath: path.basename(filePath) });
  } catch (err) {
    console.error('[Upload error]', err);  // ✅ See this in your terminal
    res.status(500).json({ error: 'File processing failed' });
  }
});


app.post('/chat', async (req, res) => {
  try {
    const { question } = req.body;
    const { answer, citations } = await handleQuery(question);
    res.json({ answer, citations });

  } catch (err) {
    res.status(500).json({ error: 'Query failed: ' + err });
  }
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
