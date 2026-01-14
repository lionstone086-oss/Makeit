
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

export class GeminiService {
  private static getAI() {
    // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async analyzeProject(imageUrl: string, description: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: `Analyze this student project. Description: ${description}` },
          { inlineData: { data: imageUrl.split(',')[1], mimeType: 'image/jpeg' } }
        ]
      },
      config: {
        systemInstruction: "You are an expert educator. Provide constructive feedback on the student's project, highlighting strengths and areas for improvement."
      }
    });
    return response.text;
  }

  static async chat(message: string, history: any[] = []) {
    const ai = this.getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: "You are the MORE Program Mentor. You help students with technical, trade, and creative skills. Be encouraging and practical."
      }
    });
    const response = await chat.sendMessage({ message });
    return response.text;
  }

  static async searchSkills(query: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find up-to-date industry requirements for the skill: ${query}`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return {
      text: response.text,
      // URLs from groundingChunks are extracted and returned for listing in the UI.
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }

  static async generateSkillSpeech(text: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  }

  static async generateVideoFromProject(imageB64: string, prompt: string) {
    // Create a new GoogleGenAI instance right before making an API call for Veo models.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: {
        imageBytes: imageB64.split(',')[1],
        mimeType: 'image/png',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      // Polling interval recommended as 10 seconds for video operations.
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    // Append API key when fetching from the download link.
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  static async editImage(imageB64: string, instruction: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: imageB64.split(',')[1], mimeType: 'image/png' } },
          { text: instruction }
        ]
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  }
}
