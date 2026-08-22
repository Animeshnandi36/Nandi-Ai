import { ChartData, CodeSnippet } from '../types';

export const API_BASE = '';

export interface HealthResponse {
  status: string;
  app: string;
  version: string;
  developer: string;
  timestamp: string;
  providers: {
    groq: {
      configured: boolean;
      chatModel: string;
      codeModel: string;
      status: string;
    };
    huggingFace: {
      configured: boolean;
      imageModel: string;
      status: string;
    };
    search: {
      configured: boolean;
      status: string;
    };
  };
}

export async function checkHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      app: 'NandiAi',
      version: '2.4.0',
      developer: 'Animesh Nandi',
      timestamp: new Date().toISOString(),
      providers: {
        groq: { configured: false, chatModel: 'llama-3.3-70b-versatile', codeModel: 'llama-3.3-70b-versatile', status: 'offline' },
        huggingFace: { configured: false, imageModel: 'black-forest-labs/FLUX.1-schnell', status: 'offline' },
        search: { configured: true, status: 'ready' }
      }
    };
  }
}

export async function sendChatMessage(
  messages: { role: string; content: string }[],
  model: string = 'llama-3.3-70b-versatile',
  systemPrompt?: string
): Promise<{ content: string; model: string; provider?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model, systemPrompt })
    });

    if (!res.ok) {
      throw new Error(`Chat API error: ${res.status}`);
    }

    const data = await res.json();
    return {
      content: data.content || '',
      model: data.model || model,
      provider: data.provider
    };
  } catch (err) {
    console.error('Chat error:', err);
    throw err;
  }
}

export async function generateImage(
  prompt: string,
  style: string = 'cyberpunk',
  aspectRatio: string = '1:1',
  model?: string
): Promise<{ imageUrl: string; prompt: string; model: string; notice?: string }> {
  const res = await fetch(`${API_BASE}/api/generate-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, style, aspectRatio, model })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Image API error: ${res.status} - ${errText}`);
  }

  return await res.json();
}

export async function generateChart(
  prompt: string,
  chartType?: string,
  contextData?: string
): Promise<{ chart: ChartData }> {
  const res = await fetch(`${API_BASE}/api/generate-chart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, chartType, contextData })
  });

  if (!res.ok) {
    throw new Error(`Chart API error: ${res.status}`);
  }

  return await res.json();
}

export async function generateCode(
  language: string,
  prompt: string,
  context?: string
): Promise<{ code: string; explanation: string; language: string }> {
  const res = await fetch(`${API_BASE}/api/generate-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, prompt, context })
  });

  if (!res.ok) {
    throw new Error(`Code API error: ${res.status}`);
  }

  return await res.json();
}

export async function analyzeFile(
  fileOrContent: File | string,
  query: string,
  fileName: string = 'document.txt',
  fileType: string = 'text/plain'
): Promise<{ analysis: string; fileName: string; fileType: string }> {
  let res: Response;

  if (typeof fileOrContent === 'string') {
    res = await fetch(`${API_BASE}/api/analyze-file`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: fileOrContent, name: fileName, type: fileType, query })
    });
  } else {
    const formData = new FormData();
    formData.append('file', fileOrContent);
    formData.append('query', query);
    res = await fetch(`${API_BASE}/api/analyze-file`, {
      method: 'POST',
      body: formData
    });
  }

  if (!res.ok) {
    throw new Error(`File analysis API error: ${res.status}`);
  }

  return await res.json();
}

export async function searchGrounded(query: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  if (!res.ok) {
    throw new Error(`Search API error: ${res.status}`);
  }

  return await res.json();
}
