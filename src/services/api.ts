import { ChartData, CodeSnippet } from '../types';

export const API_BASE = '';

export interface HealthResponse {
  status: string;
  app: string;
  version: string;
  developer: string;
  year?: number;
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
      year: 2026,
      timestamp: new Date().toISOString(),
      providers: {
        groq: { configured: false, chatModel: 'openai/gpt-oss-120b', codeModel: 'openai/gpt-oss-120b', status: 'offline' },
        huggingFace: { configured: false, imageModel: 'black-forest-labs/FLUX.1-dev', status: 'offline' },
        search: { configured: true, status: 'ready' }
      }
    };
  }
}

export async function sendChatMessage(
  messages: { role: string; content: string }[],
  model: string = 'openai/gpt-oss-120b',
  systemPrompt?: string,
  onToken?: (token: string) => void,
  abortSignal?: AbortSignal
): Promise<{ content: string; model: string; provider?: string }> {
  try {
    // If onToken callback is provided, request streaming
    const shouldStream = Boolean(onToken);

    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': shouldStream ? 'text/event-stream' : 'application/json'
      },
      body: JSON.stringify({ messages, model, systemPrompt, stream: shouldStream }),
      signal: abortSignal
    });

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
      } else if (res.status >= 500) {
        throw new Error('Inference server error. Please try again shortly.');
      } else if (res.status === 400) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Invalid chat request.');
      }
      throw new Error('Something went wrong. Please try again.');
    }

    if (shouldStream && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const dataStr = trimmed.slice(5).trim();
          if (dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta?.content || '';
            if (delta) {
              fullContent += delta;
              onToken?.(delta);
            }
          } catch (e) {
            // Ignore parse errors on partial chunks
          }
        }
      }

      return {
        content: fullContent,
        model,
        provider: 'groq'
      };
    }

    const data = await res.json();
    return {
      content: data.content || '',
      model: data.model || model,
      provider: data.provider
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Generation stopped.');
    }
    console.error('Chat error:', err);
    throw err;
  }
}

export async function generateImage(
  prompt: string,
  style: string = 'cyberpunk',
  aspectRatio: string = '1:1',
  model?: string,
  abortSignal?: AbortSignal
): Promise<{ imageUrl: string; prompt: string; model: string; notice?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, style, aspectRatio, model }),
      signal: abortSignal
    });

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error('Rate limit reached on image provider. Please wait a minute.');
      } else if (res.status === 400) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Please enter a valid prompt.');
      }
      throw new Error('Something went wrong generating the image. Please try again.');
    }

    return await res.json();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Generation stopped.');
    }
    throw err;
  }
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
    throw new Error('Something went wrong generating the chart. Please try again.');
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
    throw new Error('Something went wrong generating code. Please try again.');
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
    throw new Error('Something went wrong analyzing the document. Please try again.');
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
    throw new Error('Something went wrong executing the search. Please try again.');
  }

  return await res.json();
}
