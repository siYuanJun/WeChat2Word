
import { GoogleGenAI, Type } from "@google/genai";
import { ScriptConfig, GeneratedScript } from "../types";

export const generatePythonScript = async (config: ScriptConfig): Promise<GeneratedScript> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Generate a highly robust and professional Python script to batch download WeChat Official Account (微信公众号) articles from a list of URLs and convert them into .docx files.
    
    Configuration Requirements:
    - Include images: ${config.includeImages ? 'Yes (handle data-src attributes used by WeChat)' : 'No'}
    - Target directory: ${config.savePath}
    - Concurrency (Threads): ${config.concurrency}
    - Filename template: ${config.filenameTemplate}
    - Proxy support: ${config.useProxy ? 'Yes' : 'No'}

    Technical Specifications:
    - Use 'requests' for networking.
    - Use 'BeautifulSoup4' for HTML parsing (focus on #js_content).
    - Use 'python-docx' for Word generation.
    - Handle WeChat's specific lazy-loading image logic (data-src).
    - Include a progress bar using 'tqdm'.
    - Implement error handling for invalid URLs or network failures.
    - Add clear comments in Chinese (Simplified).
    
    Response Format: Return a JSON object with:
    1. 'code': The complete Python script.
    2. 'requirements': List of pip packages needed.
    3. 'usageInstructions': Short guide on how to run it.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          code: { type: Type.STRING },
          requirements: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          usageInstructions: { type: Type.STRING }
        },
        required: ["code", "requirements", "usageInstructions"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to generate a valid script. Please try again.");
  }
};
