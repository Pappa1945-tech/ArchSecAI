import os
import re
import json
import requests
from flask import Flask, render_template, request, jsonify, session
from duckduckgo_search import DDGS
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'archsec_secure_key_1008')
# For local dev without a formal DB, we'll store chat history in session 
# Ensure it can hold enough data
app.config['SESSION_TYPE'] = 'filesystem'
csrf = CSRFProtect(app)

# Ollama Endpoint
OLLAMA_API_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "qwen2.5:1.5b"

SYSTEM_PROMPT = """You are ArchSec AI, an elite cybersecurity System Architecture Co-Pilot and Threat Modeler.
You operate on Zero-Trust principles, Post-Quantum cryptography, and rigorous formal verification.

Your goal is to help software architects analyze their infrastructure designs and generate precise Threat Models.
Follow this rigid workflow:
1. GATHER CONTEXT: Ask clarifying questions until you fully understand their architecture (frontend, backend, database, cloud provider, authentication method).
2. DIFFERENTIAL ANALYSIS: Once you have enough context, provide the Top 5 most critical threat vectors specific to their exact stack.
3. ZERO-TRUST MITIGATION: Provide concrete architectural solutions for each threat vector.

Be professional, extremely technical, and format your output cleanly in Markdown. Do not give generic advice; tailor it directly to their specific tech stack.
"""

def duckduckgo_search(query, max_results=3):
    """
    Perform a real-time web search for recent vulnerabilities or CVEs.
    """
    try:
        results = []
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=max_results):
                results.append(f"Title: {r['title']}\nSnippet: {r['body']}\n")
        return "\n".join(results)
    except Exception as e:
        print(f"DuckDuckGo search failed: {e}")
        return ""

def query_ollama(prompt, context=None):
    """
    Send a prompt to the local Ollama instance.
    """
    try:
        payload = {
            "model": MODEL_NAME,
            "prompt": prompt,
            "system": SYSTEM_PROMPT,
            "stream": False
        }
        if context:
            payload["context"] = context
            
        print(f"Sending request to Ollama ({MODEL_NAME})...")
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=60)
        response.raise_for_status()
        
        data = response.json()
        return data.get("response", ""), data.get("context", [])
        
    except requests.exceptions.RequestException as e:
        print(f"Ollama connection error: {e}")
        return "Error: Could not connect to the local AI model. Ensure Ollama is running and qwen2.5:1.5b is installed.", []

@app.route('/')
def home():
    # Reset session history on reload
    session['chat_context'] = []
    session['architecture_context'] = ""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    if not user_message:
        return jsonify({'error': 'Message cannot be empty'}), 400
        
    # Retrieve previous LLM context array for conversation continuity
    llm_context = session.get('chat_context', [])
    arch_context = session.get('architecture_context', "")
    
    # Store user input to build the architecture profile
    arch_context += f"\nUser: {user_message}"
    
    # Keyword trigger for web search (simple heuristic)
    search_context = ""
    search_keywords = ["AWS", "Node", "React", "JWT", "Mongo", "SQL", "Docker", "Kubernetes"]
    for keyword in search_keywords:
        if keyword.lower() in user_message.lower():
            print(f"Triggering search for {keyword} vulnerabilities...")
            raw_results = duckduckgo_search(f"latest critical CVE vulnerability {keyword} architecture")
            if raw_results:
                search_context += f"\\n[Real-time Web Search Results for {keyword}]:\\n{raw_results}\\n"

    # Construct the final prompt
    augmented_prompt = user_message
    if search_context:
        augmented_prompt = f"Additional Web Security Context:\\n{search_context}\\n\\nUser message: {user_message}"

    # Query the local AI
    ai_response, new_context = query_ollama(augmented_prompt, context=llm_context)
    
    # Update session
    session['chat_context'] = new_context
    session['architecture_context'] = arch_context + f"\nAI: {ai_response}"
    session.modified = True

    return jsonify({
        'response': ai_response
    })

if __name__ == '__main__':
    app.run(debug=True, port=5005)
