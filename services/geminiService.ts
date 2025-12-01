import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// NOTE: In a real production app, this key should come from a secure backend proxy.
// For this MVP demo, we assume it's in the environment or user input.
const apiKey = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export interface MarketingContext {
  businessName: string;
  businessType: string;
  topProducts: string;
  tone: string;
  targetAudience: string;
}

export const generateMarketingContent = async (
  businessName: string,
  businessType: string,
  goal: 'promo' | 'recovery' | 'event'
): Promise<string> => {
  if (!ai) {
    return "Error: API Key no configurada. Por favor contacte al administrador.";
  }

  const model = "gemini-2.5-flash";
  
  let prompt = `Actúa como un experto en marketing digital para pequeños negocios. 
  El negocio se llama "${businessName}" y es un/a ${businessType}.
  
  Objetivo: `;

  switch(goal) {
    case 'promo':
      prompt += "Crear un mensaje corto, atractivo y con emojis para WhatsApp anunciando una promoción flash para hoy.";
      break;
    case 'recovery':
      prompt += "Crear un mensaje amable y personalizado para un cliente que no ha visitado en 30 días, ofreciendo un pequeño incentivo.";
      break;
    case 'event':
      prompt += "Crear una invitación para un evento especial este fin de semana.";
      break;
  }

  prompt += "\n\nEl mensaje debe ser listo para enviar, sin hashtags innecesarios, directo y amigable. Máximo 50 palabras.";

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text || "No se pudo generar el contenido.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hubo un error conectando con la IA. Intenta más tarde.";
  }
};

export const generateDailyStrategy = async (
  context: MarketingContext,
  day: string,
  strategyType: string
): Promise<string> => {
  if (!ai) return "IA no configurada. (Simulado: Configure su API Key)";

  const prompt = `Actúa como el Community Manager Senior de "${context.businessName}", un negocio del tipo: ${context.businessType}.
  
  CONTEXTO DEL NEGOCIO:
  - Productos Estrella: ${context.topProducts}
  - Público Objetivo: ${context.targetAudience}
  - Tono de Voz: ${context.tone}
  
  MISION DE HOY (${day}):
  La estrategia general es: "${strategyType}".
  
  TAREA:
  Escribe un mensaje perfecto para enviar por WhatsApp o publicar en Instagram Stories HOY.
  
  REGLAS:
  1. Usa el tono de voz definido (${context.tone}).
  2. Menciona sutil o directamente alguno de los productos estrella si aplica.
  3. Usa emojis adecuados.
  4. Extensión: Corta y directa (máximo 60 palabras).
  5. Incluye un llamado a la acción claro al final.
  
  Solo dame el texto del mensaje, sin introducciones ni comillas.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "No se pudo generar el plan.";
  } catch (e) {
    return "Error generando estrategia. Verifica tu conexión.";
  }
};

export const analyzeTrends = async (dataContext: string): Promise<string> => {
  if (!ai) return "IA no disponible.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analiza estos datos de ventas de un pequeño negocio y dame 3 recomendaciones accionables en formato de lista corta: ${dataContext}`,
    });
    return response.text || "Sin análisis.";
  } catch (e) {
    return "Error analizando datos.";
  }
}