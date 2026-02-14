
import { GoogleGenAI } from "@google/genai";

export async function generateEmailReply(sender: string, subject: string, originalBody: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey:"AIzaSyAl47Ic9kIOjeLl2SzL0OmbsvkMrGIps0E" });
  
  const prompt = `
    Context: I am receiving an email from "${sender}" with the subject "${subject}".
    Original Email Content: "${originalBody}"
    
    Task: Write a professional, polite, and concise reply to this email. 
    Guidelines:
    - Keep it under 3 paragraphs.
    - Sound friendly yet business-appropriate.
    - If the email is a request, acknowledge it.
    - Only provide the body of the reply.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a reply at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI reply. Please check your connection or try again later.";
  }
}
