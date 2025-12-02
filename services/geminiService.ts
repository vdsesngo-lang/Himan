import { GoogleGenAI, Modality } from "@google/genai";

// Helper to check API Key for Veo (Paid feature)
export const checkApiKeySelection = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return true; // Fallback for environments where window.aistudio isn't injected (dev)
};

export const promptApiKeySelection = async () => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  }
};

const getGeminiClient = () => {
  // Always create new instance to pick up potentially newly selected key
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // Return null or throw a specific error we catch later
    throw new Error("API Key not available. Please select a project.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateImage = async (prompt: string): Promise<string | undefined> => {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Create a high quality digital art illustration representing this scene: ${prompt}` }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (e) {
    console.warn("Image Generation failed as fallback:", e);
    return undefined;
  }
};

export const generateVideo = async (prompt: string): Promise<string | undefined> => {
  try {
    const ai = getGeminiClient();
    const visualPrompt = `Cinematic 4k movie shot: ${prompt}`;

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: visualPrompt,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    // Polling loop
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (videoUri) {
        // Must append API key for playback
        return `${videoUri}&key=${process.env.API_KEY}`;
    }
    return undefined;
  } catch (e) {
    // Use warn instead of error to avoid cluttering the console with "scary" messages for expected billing failures
    console.warn("Veo Generation Warning (likely billing/key issue):", e);
    throw e;
  }
};

export const generateSpeech = async (text: string, language: string, gender: 'Male' | 'Female'): Promise<string | undefined> => {
  try {
    const ai = getGeminiClient();
    
    // Voice Mapping: Kore (Female), Puck (Male) - typically work well for generic/teen
    const voiceName = gender === 'Female' ? 'Kore' : 'Puck';
    
    // Prompt engineering for language
    const ttsPrompt = `Say the following text in ${language} language naturally and clearly: "${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: ttsPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (e) {
    console.error("TTS Generation Error:", e);
    throw e;
  }
};
