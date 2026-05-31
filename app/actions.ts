'use server';

import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
} catch (e) {
  // Graceful initialization failure handle
}

const flightTool = {
  name: 'show_flight_deal',
  description: 'Display a specific flight option to the user, including price, times, airline, and layovers/durations.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      airline: { type: Type.STRING },
      flightNumber: { type: Type.STRING },
      price: { type: Type.NUMBER },
      origin: { type: Type.STRING },
      originTime: { type: Type.STRING },
      duration: { type: Type.STRING },
      dest: { type: Type.STRING },
      destTime: { type: Type.STRING },
      date: { type: Type.STRING },
      luggage: { type: Type.STRING }
    },
    required: ["airline", "flightNumber", "price", "origin", "originTime", "duration", "dest", "destTime", "date"]
  }
};

const itineraryTool = {
  name: 'show_daily_itinerary',
  description: 'Display a curated daily itinerary of activities to the user.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      dayTitle: { type: Type.STRING, description: "e.g. Day 01 — Shinjuku" },
      date: { type: Type.STRING, description: "e.g. Oct 12" },
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING, description: "Short 1 sentence outline of the activity." },
            duration: { type: Type.STRING, description: "e.g. 2h" },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "e.g. ['Nature', 'Eco-Friendly']" }
          },
          required: ["time", "title", "description", "duration", "tags"]
        }
      }
    },
    required: ["dayTitle", "date", "items"]
  }
};

export async function submitChatMessage(history: any[], message: string) {
  if (!process.env.GEMINI_API_KEY) {
    return {
      role: 'model',
      text: "ERROR: GEMINI_API_KEY is not configured in your environment variables.",
    };
  }

  // Pre-process history to preserve widget context for the agent
  const contents = history.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [
      {
        text: msg.text + (msg.widget
            ? `\n\n[System: You previously displayed a ${msg.widget.type} widget with this data: ${JSON.stringify(msg.widget.data)}]` 
            : ''),
      },
    ],
  }));

  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: "You are Voyage AI, a premium travel concierge. When the user asks for flights, always call the show_flight_deal tool with realistic flight values. When the user asks for an itinerary, always call the show_daily_itinerary tool with interesting, realistic recommendations. Always respond with short, friendly, and sophisticated text messages to accompany your tools.",
        tools: [{ functionDeclarations: [flightTool, itineraryTool] }],
        temperature: 0.2
      },
    });

    let textOut = response.text || "";
    let widgetOut = undefined;

    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === 'show_flight_deal') {
        widgetOut = { type: 'flight', data: call.args };
      } else if (call.name === 'show_daily_itinerary') {
        widgetOut = { type: 'itinerary', data: call.args };
      }

      // If the model produced a function call but no conversational text, we force a second turn
      // to make it say something conversational acknowledging the completion.
      if (!textOut && widgetOut) {
         try {
            const resp2 = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    ...contents,
                    { role: 'model', parts: [{ functionCall: call }] },
                    { role: 'user', parts: [{ functionResponse: { name: call.name, response: { status: 'OK, widget displayed.' } } }] }
                ]
            });
            textOut = resp2.text || "I've loaded the details for you on the interactive canvas.";
         } catch(e) {
            textOut = "I've placed the details for you on the interactive canvas.";
         }
      }
    }

    return { role: 'model', text: textOut, widget: widgetOut };
  } catch (err: any) {
    console.error(err);
    return { role: 'model', text: `Network Error: ${err.message}` };
  }
}
