import json
import logging
import sys

import requests

# ✅ Send logs to stderr, so Node.js doesn't read them as stdout
logging.basicConfig(level=logging.DEBUG, stream=sys.stderr)

def generate_answer(question, pages):
    context = "\n\n".join([f"Page {p['page']}: {p['text']}" for p in pages])
    prompt = f"""You are a helpful assistant. Answer the user's question based on the given context.

Context:
{context}

Question:
{question}

Answer:"""

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            headers={"Content-Type": "application/json"},
            json={
                "model": "mistral",
                "prompt": prompt,
                "stream": False
            }
        )

        logging.debug("[LLM Status Code] %s", response.status_code)
        logging.debug("[LLM Headers] %s", response.headers)
        logging.debug("[LLM Raw Response Text] %r", response.text)

        if response.status_code != 200:
            return f"Error: LLM returned status code {response.status_code}"

        data = response.json()
        return data.get("response", "").strip()

    except requests.exceptions.RequestException as e:
        logging.error("Network error while contacting LLM: %s", e)
        return "Error: Failed to contact LLM"

    except ValueError as e:
        logging.error(" Failed to parse LLM response: %s", e)
        return f"LLM response parse error: {e}"

if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        parsed = json.loads(input_data)
        question = parsed["question"]
        pages = parsed["pages"]
        answer = generate_answer(question, pages)

        # ✅ Print only JSON (stdout)
        print(json.dumps({"answer": answer}))

    except Exception as e:
        logging.error(" Top-level error: %s", e)
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
