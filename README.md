# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

==========>>>>>>>>>>>>> Lets Begin <<<<<<<<<<<==============

📘 Google NotebookLM Clone – Local PDF Chat App
1. A locally running web app that allows you to upload a PDF, ask questions about its content, and 
get contextual, citation-linked answers from a local Ollama LLM — completely offline and 
free of API keys.

🖥️ 2. Setup Backend (Express + Python) 
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
npm install
Start backend server: node index.js
Note: Make sure you have faiss, sentence-transformers, and ollama installed inside 
your venv (virtual environment).


🌐 3. Setup Frontend
cd frontend
npm install
npm run dev

🤖 4. Run Ollama LLM
Install Ollama from https://ollama.com, then:
ollama run llama3
Make sure it's running at http://localhost:11434

🧑‍💻 5. Author
Made with ❤️ by Rohan Waikar



