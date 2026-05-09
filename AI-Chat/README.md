# AI Chat Intelligence 🚀

A high-performance, production-grade AI chat application built with **Next.js 15+**, **FastAPI**, and **Google Gemini**. Designed with premium aesthetics, micro-animations, and advanced NLP capabilities.

**Live Demo:** [ai-chat-intelligence-zl1k.vercel.app](https://ai-chat-intelligence-zl1k.vercel.app/)

## ✨ Features

- ⚡ **Smooth Streaming**: Real-time typewriter-effect responses using Gemini 1.5/2.5.
- 🧠 **Smart Intelligence**: Built-in intent classification and sentiment analysis for every message.
- 📱 **Mobile Optimized**: Responsive header with quick navigation and sidebar controls.
- 🎨 **Premium UI**: Sleek glassmorphism effects, smooth Framer Motion animations, and curated typography.
- 🛠️ **Dual-Mode Backend**: 
  - **Gemini Mode**: Powered by Google Generative AI.
  - **Fallback Mode**: Intelligent local keyword matching for offline use.

## 🚀 Getting Started

### 1. Clone & Setup
```bash
git clone https://github.com/adityaanand0001/ai-chat-intelligence.git
cd ai-chat-intelligence
```

### 2. Backend Setup (FastAPI)
1. Navigate to the API directory:
   ```bash
   cd AI-Chat/api
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Create a `.env` file and add your Gemini API key:
   ```bash
   GEMINI_API_KEY=your_key_here
   ```
4. Run the server:
   ```bash
   python index.py
   ```
   *The backend will be available at `http://localhost:8765`*

### 3. Frontend Setup (Next.js)
1. Navigate to the AI-Chat directory:
   ```bash
   cd AI-Chat
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *Open `http://localhost:3000` to start chatting!*

## 🛠️ Tech Stack
- **Frontend**: Next.js 16 (App Router), Framer Motion, Lucide React, CSS Modules.
- **Backend**: FastAPI, Google Generative AI SDK, SQLite/Supabase.
- **Deployment**: Vercel.

---
Built with ❤️ by [Aditya Anand](https://github.com/adityaanand0001)
