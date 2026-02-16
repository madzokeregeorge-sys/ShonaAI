
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SLANG_DATABASE } from "../data/slangDictionary";
import { checkGeminiRateLimit, formatRetryTime } from './rateLimiter';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Mufaro, the official AI tutor for ShonaAI. 
Your goal is to help the user learn the Shona language (ChiShona) and Zimbabwean culture.

STRICT RULES:
1. **Translation Mandatory**: Every single Shona sentence you write MUST be immediately followed by its English translation in parentheses. 
   - Example: "Mhoro! (Hello!) Wakadii hako? (How are you?)"
2. **Conciseness**: Your total response must be **under 100 words**. Be brief and to the point.
3. **Format**: Use **Markdown**. Use bolding for key Shona terms. Use bullet points for lists.
4. **Knowledge Source**: You have access to a specialized slang database. If the context contains a term, use that specific definition. If not, provide common knowledge but keep it simple.
5. **Tone**: Warm, friendly, and authentic.
`;

let chatSession: Chat | null = null;

export const initChat = (level: string, goal: string) => {
  const contextPrompt = `The user is at a ${level} level and their main goal is ${goal}.`;

  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + "\n" + contextPrompt,
      temperature: 0.7,
    },
  });
  return chatSession;
};

/**
 * RAG RETRIEVAL LOGIC
 * This function retrieves relevant slang terms from your database.
 * NOTE: To use your scraped JSON from Antigravity, replace SLANG_DATABASE 
 * with a fetch call or an import to your local JSON file.
 */
const retrieveContext = async (query: string): Promise<string[]> => {
  // If you are using a real backend or static file in Antigravity:
  // const response = await fetch('/path/to/your/scraped_data.json');
  // const database = await response.json();
  const database = SLANG_DATABASE;

  const queryWords = query.toLowerCase().replace(/[?.,!]/g, '').split(' ');

  const scoredHits = database.map(item => {
    let score = 0;
    const termLower = item.term.toLowerCase();
    const defLower = item.definition.toLowerCase();

    queryWords.forEach(word => {
      if (word.length < 3) return;
      if (termLower.includes(word)) score += 5;
      if (defLower.includes(word)) score += 2;
    });

    return { item, score };
  })
    .filter(hit => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return scoredHits.map(hit => `${hit.item.term}: ${hit.item.definition} (Ex: "${hit.item.example}")`);
};

export const streamMessageToGemini = async (
  message: string,
  onChunk: (chunkText: string) => void
): Promise<{ context: string[] }> => {
  if (!chatSession) {
    throw new Error("Session expired. Please refresh the page.");
  }

  try {
    // 0. CHECK RATE LIMIT
    const rateCheck = checkGeminiRateLimit();
    if (!rateCheck.allowed) {
      throw new Error(`Ndapota, mira. (Please wait.) Try again in ${formatRetryTime(rateCheck.retryAfterMs)}.`);
    }

    // 1. RETRIEVE relevant knowledge
    const retrievedDocs = await retrieveContext(message);

    // 2. AUGMENT the prompt with retrieved data
    let finalPrompt = message;
    if (retrievedDocs.length > 0) {
      finalPrompt = `[KNOWLEDGE BASE CONTEXT]\n${retrievedDocs.join('\n')}\n\n[USER MESSAGE]\n${message}`;
    }

    // 3. GENERATE response
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 15000)
    );

    const result = await Promise.race([
      chatSession.sendMessageStream({ message: finalPrompt }),
      timeoutPromise
    ]);

    for await (const chunk of result) {
      const text = (chunk as GenerateContentResponse).text;
      if (text) {
        onChunk(text);
      }
    }

    return { context: retrievedDocs };

  } catch (error) {
    console.error("ShonaAI API Error:", error);
    throw error;
  }
};
