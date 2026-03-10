<div align="center">
  
# 🛡️ ArchSec AI: Advanced Privacy-First Threat Modeler

*A 100% local, Zero-Trust Architecture Co-Pilot powered by Qwen2.5 LLM, real-time Intelligence, and rigorous formal modeling. Developed by <b>[SB Tech](https://www.sbtech.co.in/)</b>.*

[![Cybersecurity](https://img.shields.io/badge/Domain-Cybersecurity-red)](#)
[![Zero-Trust](https://img.shields.io/badge/Architecture-Zero--Trust-orange)](#)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_Local-green)](#)
[![Ollama](https://img.shields.io/badge/LLM-qwen2.5%3A1.5b-blue)](#)

</div>

---

## 🎯 The Enterprise Security Dilemma

When designing modern systems (microservices, cloud-native deployments, Kubernetes clusters), **Threat Modeling** is the most critical phase. However, senior engineers and system architects face a severe bottleneck: **they cannot paste proprietary infrastructure designs into public AI web interfaces** without violating strict corporate data governance and intellectual property policies.

**ArchSec AI** solves this. It brings expert-level, differential threat analysis directly to your local machine. Your architecture blueprints never leave your hardware.

## ✨ Core Capabilities

*   **🔒 Absolute Data Privacy (100% Local Inference):** Runs entirely via local Ollama wrappers (`qwen2.5:1.5b`), ensuring zero telemetry or IP leakage.
*   **🌐 Real-Time Attack Surface Augmentation:** Automatically triggers DuckDuckGo searches to parse the latest CVEs, OWASP telemetry, and 0-day discussions specifically matching your technology stack.
*   **🧠 Differential Threat Analysis:** Systematically grades architectural vulnerabilities, presenting the top 5 most critical attack vectors (e.g., SSRF on AWS IMDS, Prototype Pollution in Node.js, JWT exfiltration via XSS).
*   **🛡️ Zero-Trust Mitigation Blueprints:** Provides actionable, mathematically rigorous implementation guides for enforcing Zero-Trust architectures (Micro-segmentation, Post-Quantum Cryptography implementations, Identity-Aware Proxies).
*   **💎 Premium Glassmorphic UI:** A beautifully engineered, responsive, and secure chat interface built with Tailwind CSS, offering real-time markdown rendering of architectural solutions.

---

## 🚀 Installation & Usage

ArchSec AI is designed for immediate deployment by InfoSec professionals and developers.

### Prerequisites
1. **Python 3.8+**
2. **Ollama:** Installed and running on your local machine.
3. **The LLM Model:** Pull the required model via terminal before starting:
   ```bash
   ollama pull qwen2.5:1.5b
   ```

### Quickstart Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Pappa1945-tech/ArchSecAI.git
   cd ArchSecAI
   ```

2. **Initialize Environment & Install Dependencies**
   ```bash
   python -m venv venv
   
   # Windows
   .\venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Start the Threat Modeling Server**
   *(Ensure `ollama serve` is running in the background)*
   ```bash
   python app.py
   ```
   
4. **Access the Interface**
   Open your browser and navigate to: `http://127.0.0.1:5005`

### 💡 Example Workflow

Enter a prompt like:
> *"I am building a React frontend that talks to a Node.js microservice handling payments. We deploy on AWS and use MongoDB. Auth is done via JWTs."*

ArchSec AI will instantly:
1. Search real-time data for "React Node.js AWS Mongo JWT vulnerabilities".
2. Synthesize a Top 5 Threat Model.
3. Generate a step-by-step Zero-Trust enforcement plan (e.g., enforcing IMDSv2, restricting egress, HttpOnly cookies for tokens).

---

## 🔬 About the Architecture

ArchSec AI does not rely on simple generative text. It utilizes a highly structured `<SYSTEM_PROMPT>` paradigm requiring the AI to act as a **System Architecture Co-Pilot**. It is explicitly instructed to avoid generic advice and enforce formal methods, cryptographic robustness (including TLS 1.3/PQC considerations), and strict CIA triad principles. 

## 👨‍💻 Developed by SB Tech R&D

This project is an open-source initiative developed by **Subhamoy Bhattacharjee** and the engineering division at **[SB Tech](https://www.sbtech.co.in/)**. 

At SB Tech, we specialize in high-stakes software engineering, advanced AI integrations, and uncompromising cybersecurity architectures. We build software that guarantees mathematical certainty in an era of advanced persistent threats.

*   **Read our comprehensive research on Web Security:** [SB Tech R&D Innovation Lab](https://www.sbtech.co.in/rnd)
*   **Hire us for Enterprise Architecture:** [Contact SB Tech](https://www.sbtech.co.in/contact)

---

### ⚠️ Disclaimer
*ArchSec AI is an advanced automated tool designed to assist security professionals in threat modeling. It does not replace formal penetration testing, SAST/DAST pipelines, or manual security audits by certified professionals. The developers assume no liability for the implementation of its localized outputs.*
