# vectorizer.py
import json
import subprocess
import sys

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')
INDEX_PATH = "faiss.index"
CHUNKS_PATH = "chunks.json"

def load_chunks():
    with open(CHUNKS_PATH, "r") as f:
        return json.load(f)

def build_index(pages):
    embeddings = model.encode([p["text"] for p in pages])
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings, dtype=np.float32))
    faiss.write_index(index, INDEX_PATH)
    with open(CHUNKS_PATH, "w") as f:
        json.dump(pages, f)
    print("✅ Index built")

def query_index(question):
    index = faiss.read_index(INDEX_PATH)
    chunks = load_chunks()
    q_embed = model.encode([question])
    D, I = index.search(np.array(q_embed, dtype=np.float32), 5)

    results = [chunks[i] for i in I[0] if i != -1]

    try:
        proc = subprocess.Popen(
            ['python3', 'vectorizer/llm_answer.py'],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        input_data = json.dumps({
            "question": question,
            "pages": results
        }).encode("utf-8")

        output, error = proc.communicate(input=input_data)

        # Log stderr only
        if error:
            print('[llm stderr]', error.decode(), file=sys.stderr)

        output_str = output.decode().strip()

        # ✅ Extract only the JSON part, in case of stray prints
        try:
            json_start = output_str.find('{')
            json_end = output_str.rfind('}') + 1
            json_text = output_str[json_start:json_end]

            response = json.loads(json_text)

            # ✅ Print clean JSON only
            print(json.dumps({
                "answer": response.get("answer"),
                "pages": [r["page"] for r in results]
            }))
        except Exception as e:
            print(f"❌ Failed to parse LLM output: {e}\nRaw:\n{output_str}", file=sys.stderr)
            sys.exit(1)

    except Exception as e:
        print("❌ Failed to run LLM subprocess:", str(e), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    if sys.argv[1] == "build":
        pages = json.loads(sys.stdin.read())
        build_index(pages)
    elif sys.argv[1] == "query":
        question = sys.stdin.read().strip()
        query_index(question)
