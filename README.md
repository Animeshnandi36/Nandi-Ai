# ⚡ NandiAi — Full-Stack Neural Workspace & Android APK

> **NandiAi** is a production-ready AI workspace engineered by **Animesh Nandi**.  
> Dual-platform architecture: **Production Web Application (Render-ready)** + **Native Android APK (Kotlin & Jetpack Compose)**.

---

## 🌟 Core Features

- 🤖 **Neural AI Chat**: Powered by Groq LPU with ultra-fast token streaming (`openai/gpt-oss-120b`, `llama-3.3-70b-versatile`, `deepseek-r1-distill-llama-70b`, `llama-3.1-8b-instant`, `mixtral-8x7b-32768`, `gemma2-9b-it`).
- 🖼️ **FLUX.1 Image Studio**: Powered by Hugging Face FLUX.1 neural diffusion with customizable styles (Cyberpunk, 8K Photorealistic, 3D Octane, Anime, Vector Art) and aspect ratios.
- 📊 **Interactive Chart Studio**: Natural language to interactive structured charts (Bar, Line, Area, Pie, Scatter) with live data table view and CSV export.
- 💻 **Multi-Language Code Studio**: High-speed code synthesis and debugging across Kotlin, Python, TypeScript, Java, C++, SQL, HTML/CSS, Rust, and Bash.
- 📎 **Document & File Intelligence**: Deep semantic parsing and Q&A on PDF, CSV, JSON, TXT, Markdown, and source code files up to 25MB.
- 🎙️ **Voice Synthesizer & Speech Recognition**: Live microphone speech-to-text and text-to-speech audio playback with graceful fallback when permissions are denied.
- 📁 **Workspaces & Projects**: Organize chats, generated images, code snippets, and dataset files into structured workspaces.
- 🔒 **Zero-Trust Credential Security**: `GROQ_API_KEY` and `HF_API_TOKEN` are isolated exclusively within backend server environment variables—never exposed to client browser devtools or APK binaries.

---

## 🛠️ Project Structure

```
├── client / src /         # React + Vite + TypeScript Frontend
│   ├── components/        # Logo, Header, Sidebar, Footer, MarkdownRenderer
│   ├── screens/           # Chat, Image, Chart, Code, Files, Projects, History, Settings, About
│   ├── services/          # Backend API client bridge
│   └── types/             # Full TypeScript interfaces
├── server/                # Node.js + Express Backend Proxy
│   └── index.js           # Groq LPU & Hugging Face inference endpoints, static server
├── app/                   # Native Android Jetpack Compose Project
│   └── src/main/java/     # Kotlin Architecture (Room DB, ViewModel, Retrofit, Navigation)
├── render.yaml            # Render Web Service One-Click Deployment Configuration
├── package.json           # Web & Backend Scripts & Dependencies
├── vite.config.ts         # Vite build configuration
└── .env.example           # Environment variables template
```

---

## 🚀 Web Application (Local Development & Production)

### 1. Installation
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your API keys:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_CHAT_MODEL=openai/gpt-oss-120b
GROQ_CODE_MODEL=openai/gpt-oss-120b
HF_API_TOKEN=your_huggingface_token_here
HF_IMAGE_MODEL=black-forest-labs/FLUX.1-schnell
PORT=3000
NODE_ENV=production
```

### 3. Local Development
```bash
# Terminal 1: Start Express API server
npm run dev:server

# Terminal 2: Start Vite Dev Server
npm run dev
```

### 4. Production Web Build & Run
```bash
npm run build
npm start
```
The server will bind to `process.env.PORT` (or port `3000`) and serve the application at `http://localhost:3000`.

---

## ☁️ Render Deployment Guide

NandiAi is fully pre-configured for instant deployment on [Render](https://render.com).

### Step 1: Create a New Web Service
1. Connect your GitHub repository to Render.
2. Select **Web Service**.
3. Choose the **Node** runtime.

### Step 2: Build & Start Commands
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Step 3: Environment Variables
Add the following in Render's **Environment** tab:
| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production mode |
| `GROQ_API_KEY` | `gsk_...` | Your Groq API key |
| `GROQ_CHAT_MODEL` | `llama-3.3-70b-versatile` | Default Groq chat model |
| `GROQ_CODE_MODEL` | `llama-3.3-70b-versatile` | Default Groq code model |
| `HF_API_TOKEN` | `hf_...` | Hugging Face token |
| `HF_IMAGE_MODEL` | `black-forest-labs/FLUX.1-schnell` | Hugging Face image model |

*Note: Render automatically sets and manages `PORT`.*

---

## 📱 Android APK Build & Execution

The Android project is built with Kotlin, Jetpack Compose, Room local database, and Retrofit.

### 1. Automated APK Build via GitHub Actions (Recommended)
This repository includes an automated GitHub Actions workflow (`.github/workflows/build-apk.yml`).
Whenever you push code or trigger the workflow:
1. Go to your GitHub repository and click the **Actions** tab.
2. Select **Build Android APK** ➔ click **Run workflow**.
3. Once finished, download the compiled `.apk` file directly under the **Artifacts** section!

### 2. Build Debug APK Locally
```bash
./gradlew assembleDebug
```
The generated APK will be located at:
`app/build/outputs/apk/debug/app-debug.apk`

### 3. Build Release APK Locally
```bash
./gradlew assembleRelease
```
The generated APK will be located at:
`app/build/outputs/apk/release/app-release.apk`

### 4. Run Unit & Screenshot Tests
```bash
./gradlew :app:testDebugUnitTest
```

---

## 🛡️ Security Architecture

```
Client (Browser / Android APK)
        ↓  (HTTPS REST & SSE / No API Keys)
NandiAi Express Backend Proxy (Render)
        ↓  (Injected Secret Environment Variables)
Groq LPU API  |  Hugging Face Inference API
```

---

## 👤 Credits & Attribution

- **Application Name**: NandiAi
- **Creator & Developer**: **Animesh Nandi**
- **Copyright**: © 2026 NandiAi · Developed by Animesh Nandi
