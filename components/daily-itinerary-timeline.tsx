'use client';

import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import Image from 'next/image';

const defaultItems = [
  {
    id: 1,
    time: '09:00 AM',
    title: 'Gyoen Garden',
    description: "Peaceful morning stroll in Tokyo's most beautiful national garden.",
    duration: '2h',
    tags: ['Nature', 'Eco-Friendly']
  },
  {
    id: 2,
    time: '11:30 AM',
    title: 'Robot Restaurant',
    description: "Incredible tech and culture showcase in the heart of the city.",
    duration: '2.5h',
    tags: ['Entertainment', 'Tech']
  }
];

export function DailyItineraryTimeline({
  dayTitle = "Day 01 — Shinjuku",
  date = "Oct 12",
  items = defaultItems
}: any) {
  const safeItems = items?.length > 0 ? items : defaultItems;

  return (
    <div className="w-[420px] bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/40">
        <h3 className="font-bold text-lg">{dayTitle}</h3>
        <span className="text-xs text-zinc-500 font-medium">{date}</span>
      </div>
      <div className="p-6 space-y-8">
        {safeItems.map((item: any, index: number) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="relative flex gap-6"
          >
            {index !== safeItems.length - 1 && (
              <div className="absolute left-[13px] top-6 bottom-[-32px] w-[1px] bg-zinc-800"></div>
            )}
            
            <div className="relative shrink-0">
              <div className="w-[28px] h-[28px] bg-indigo-500/20 border-2 border-indigo-500 rounded-full flex items-center justify-center z-10 relative">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400">{item.time}</h4>
                {item.tags && item.tags.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
                    {item.tags[0]}
                  </span>
                )}
              </div>
              
              <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex flex-col">
                <div className="relative h-24 w-full bg-zinc-800 flex items-end p-2 overflow-hidden">
                   <Image
                      src={`https://picsum.photos/seed/${encodeURIComponent(item.title)}/400/300`}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <span className="relative z-10 text-sm font-medium text-white px-2 py-1">{item.title}</span>
                </div>
                
                <div className="p-3">
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                  
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono">{item.duration}</span>
                    </div>
                    {item.tags?.slice(1).map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 rounded bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-400 border border-zinc-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
