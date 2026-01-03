
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRetentionMessage = async (clientName: string, lastSession: string | undefined) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `Escreva uma mensagem curta, carinhosa e profissional para o WhatsApp de uma cliente chamada ${clientName} que não faz tranças com a Vitória Trigueira desde ${lastSession || 'algum tempo'}. O objetivo é lembrar da manutenção das tranças, perguntar como está o cabelo e oferecer um novo horário para renovar o visual no Studio Trigueira Braids. Use emojis de coroa, brilhos e tons de empoderamento feminino.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Olá ${clientName}, como estão suas tranças? A Rainha aqui está com saudades! Notei que já faz um tempinho que não renovamos seu visual no Studio Trigueira Braids. Que tal agendarmos um horário? 👑✨`;
  }
};

export const generateConfirmationMessage = async (clientName: string, date: string, time: string, meetLink: string) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `Escreva uma mensagem de confirmação de agendamento de tranças para a cliente ${clientName}. 
  Data: ${date} às ${time}. 
  A profissional é Vitória Trigueira do Studio Trigueira Braids. 
  A mensagem deve ser entusiasmada, falar sobre 'coroar' a cliente e lembrar de vir com o cabelo lavado e seco.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return `Olá ${clientName}, seu momento de rainha está confirmado! Vitória Trigueira te espera no Studio Trigueira Braids dia ${date} às ${time}. 👑✨`;
  }
};
