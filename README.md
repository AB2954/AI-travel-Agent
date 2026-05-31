# Voyage AI - Next-Gen Travel Concierge

Voyage AI is a state-of-the-art, AI-powered travel assistant that reimagines how users plan their trips. Instead of a basic text-wrapper chat interface, Voyage leverages **Generative UI** concepts and a **Spatial Split-Pane Layout** to provide a rich, interactive, and visually stunning planning experience.

## 🌟 Core Concept

The application operates on a "Copilot Mode" layout:
1. **Left Pane (Chat Interface):** A clean, conversational UI where users interact with the Voyage AI (powered by Google's Gemini API).
2. **Right Pane (Spatial Canvas):** A dynamic, reactive map/canvas area. When the AI finds flights or builds itineraries, it doesn't just describe them in text—it renders beautiful, interactive widgets directly onto this canvas.

## ✨ Key Features

- **Generative UI Widgets**: The AI dynamically renders polished React components (like the `FlightBookingCard` and `DailyItineraryTimeline`) based on context.
- **Premium Minimalist Aesthetics**: Styled with Tailwind CSS, utilizing a "Professional Polish" dark theme (deep zincs, indigo accents, subtle glassy blurs, and sub-pixel perfect spacing).
- **Intelligent Tool Calling**: Integrated with the Gemini API using function calling (`show_flight_deal`, `show_daily_itinerary`) to extract structured data from user queries and map them directly to UI props.
- **Silky Smooth Animations**: Powered by Framer Motion for seamless entry and exit animations of chat bubbles and UI widgets.

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, React Server Components)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **AI / LLM**: Google Gemini API (`@google/genai`) via Server Actions

## 📂 Project Structure

- **`app/page.tsx`**: The main entry point mounting the App Shell.
- **`app/actions.ts`**: The secure server-side environment where the Gemini client is instantiated, tools (function declarations) are defined, and prompt history is managed.
- **`components/chat-shell.tsx`**: The primary client-side state manager handling the split-pane layout, capturing user input, interacting with the Server Actions, and rendering the selected Generative UI widget on the canvas.
- **`components/flight-booking-card.tsx`**: A premium widget displaying flight details, airlines, durations, and pricing.
- **`components/daily-itinerary-timeline.tsx`**: A vertically connected timeline displaying location-based activities, durations, and tags.

## 💡 How it Works

1. The user asks a question (e.g., "Find me a flight to Tokyo and plan my first day").
2. The client sends the chat history to the `submitChatMessage` Server Action.
3. The Gemini model parses the intent and uses its configured tools (`show_flight_deal`, `show_daily_itinerary`).
4. The server returns both a conversational response and a `widget` payload.
5. The client updates the chat feed with the text response and dynamically injects the resulting React component into the spatial canvas on the right.
