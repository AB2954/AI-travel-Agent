'use client';

import { useState, useRef, useEffect } from 'react';
import { FlightBookingCard } from '@/components/flight-booking-card';
import { DailyItineraryTimeline } from '@/components/daily-itinerary-timeline';
import { Sparkles, Map, Send, PlaneTakeoff, Loader2, Compass, CalendarDays, Settings } from 'lucide-react';
import { submitChatMessage } from '@/app/actions';

export default function ChatShell() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const msg = text;
    setInput("");

    const newMessages = [...messages, { id: Date.now().toString(), role: 'user', text: msg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await submitChatMessage(newMessages.slice(0, -1), msg);
      setMessages(prev => [...prev, { ...res, id: Date.now().toString() }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Sorry, a network error occurred." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine active widget
  const lastWidgetMsg = [...messages].reverse().find(m => m.widget);
  const activeWidget = lastWidgetMsg?.widget;
  const hasUserMessage = messages.length > 0;

  return (
    <div className="flex h-screen w-full bg-[#09090b] font-sans text-zinc-100 overflow-hidden">
      
      {/* Sidebar Rail */}
      <aside className="w-16 border-r border-zinc-800 flex flex-col items-center py-6 space-y-8 bg-[#0c0c0e] shrink-0 z-30">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
          <PlaneTakeoff className="w-6 h-6" />
        </div>
        <nav className="flex-1 space-y-4">
          <div className="p-2 text-zinc-500 hover:text-white cursor-pointer transition-colors"><Compass className="w-6 h-6" /></div>
          <div className="p-2 text-zinc-500 hover:text-white cursor-pointer transition-colors"><CalendarDays className="w-6 h-6" /></div>
          <div className="p-2 text-zinc-500 hover:text-white cursor-pointer transition-colors"><Settings className="w-6 h-6" /></div>
        </nav>
        <div className="mt-auto mb-6">
          <div className="w-8 h-8 rounded-full bg-zinc-700 overflow-hidden ring-1 ring-zinc-600"></div>
        </div>
      </aside>

      {/* Left Pane: Chat Interface */}
      <section className="w-full md:w-[350px] flex flex-col border-r border-zinc-800 bg-[#09090b] shrink-0 z-20 shadow-[20px_0_40px_rgba(0,0,0,0.5)]">
        <header className="p-6 border-b border-zinc-800">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Travel Assistant
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
          
          {!hasUserMessage ? (
             <div className="mt-4 flex flex-col items-start gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 shadow-inner">
                    <Sparkles className="h-3 w-3 text-indigo-400" />
                    <span className="text-[11px] font-bold tracking-widest text-indigo-300 uppercase">AI Copilot</span>
                </div>
                
                <h1 className="text-3xl font-semibold tracking-tight text-white leading-[1.1] mt-2">
                    Hello! <br/>
                    <span className="text-zinc-500 text-2xl">Where are we flying today?</span>
                </h1>
            </div>
          ) : (
            <div className="mt-2 flex flex-col gap-6">
                {messages.map((m) => (
                    m.role === 'user' ? (
                        <div key={m.id} className="flex justify-end">
                            <div className="max-w-[85%] bg-zinc-800/50 border border-zinc-700/50 rounded-2xl px-4 py-3 text-sm leading-relaxed text-zinc-100">
                                {m.text}
                            </div>
                        </div>
                    ) : (
                        <div key={m.id} className="flex w-full items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 ring-1 ring-indigo-500/20 mt-1">
                                <Sparkles className="h-4 w-4 text-indigo-400" />
                            </div>
                            <div className="max-w-[100%] space-y-3 rounded-none bg-transparent px-0 py-2 text-sm text-zinc-400 leading-relaxed">
                                <p>{m.text}</p>
                                {m.widget && (
                                    <div className="mt-2 text-[10px] uppercase font-bold text-indigo-400/80 tracking-widest flex items-center gap-1.5 bg-indigo-500/10 px-2 py-1 rounded w-fit">
                                        <Map className="w-3 h-3" />
                                        Canvas Updated: {m.widget.type}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                ))}
                
                {isLoading && (
                    <div className="flex w-full items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 ring-1 ring-indigo-500/20 mt-1">
                            <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
                        </div>
                    </div>
                )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Area */}
        <div className="p-6 shrink-0 relative z-20">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-3 shadow-inner">
            <div className="flex gap-2">
              <button onClick={() => setInput('Find me a flight to Tokyo')} className="px-2 py-1 bg-zinc-800 rounded-md text-[10px] text-zinc-400 cursor-pointer hover:bg-zinc-700 hover:text-white transition-colors">+ Add Destination</button>
              <button onClick={() => setInput('Find vegan food in Rome')} className="px-2 py-1 bg-zinc-800 rounded-md text-[10px] text-zinc-400 cursor-pointer hover:bg-zinc-700 hover:text-white transition-colors">+ Vegan Options</button>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Ask about local spots..." 
                className="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none text-zinc-100" 
              />
              <button 
                onClick={() => handleSend(input)}
                disabled={isLoading || !input.trim()}
                className="w-8 h-8 bg-zinc-100 text-black rounded-lg flex items-center justify-center cursor-pointer hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Right Pane: Spatial Canvas / Map Overlay */}
      <section className="hidden md:flex flex-1 relative bg-[#0d0d0f] z-10 flex-col">
        {/* Map Simulator Grid */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        {/* Navigation Overlays */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none z-30">
          <div className="flex items-center gap-4 bg-zinc-950/80 backdrop-blur-md p-2 rounded-2xl border border-zinc-800 pointer-events-auto">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">Itinerary</button>
            <button className="px-4 py-2 hover:bg-zinc-800 rounded-xl text-xs font-medium text-zinc-400 transition-colors">Hotels</button>
            <button className="px-4 py-2 hover:bg-zinc-800 rounded-xl text-xs font-medium text-zinc-400 transition-colors">Activities</button>
          </div>
          <div className="bg-zinc-950/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-zinc-800 flex items-center gap-3 pointer-events-auto">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Weather Alert</span>
              <span className="text-xs font-medium">Thunderstorms expected on Oct 14</span>
            </div>
          </div>
        </div>

        {/* Generative UI Components rendered beautifully on the canvas */}
        <div className="relative z-20 flex flex-1 w-full items-center justify-center overflow-y-auto p-12 custom-scrollbar">
           {!activeWidget ? (
              <div className="m-auto flex flex-col items-center gap-4 opacity-50">
                 <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center animate-pulse">
                     <Map className="w-10 h-10 text-indigo-500" />
                 </div>
                 <p className="text-zinc-400 text-sm font-medium tracking-wide">Interactive Canvas Awaits</p>
              </div>
           ) : activeWidget.type === 'flight' ? (
              <div className="w-full flex justify-center py-20 h-max">
                 <FlightBookingCard {...activeWidget.data} />
              </div>
           ) : activeWidget.type === 'itinerary' ? (
              <div className="w-full flex justify-center py-20 h-max">
                 <DailyItineraryTimeline {...activeWidget.data} />
              </div>
           ) : null}
        </div>
      </section>
      
    </div>
  );
}
