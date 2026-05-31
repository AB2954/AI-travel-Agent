'use client';

import { motion } from 'motion/react';
import { Plane, Calendar, BaggageClaim } from 'lucide-react';

export function FlightBookingCard({
  airline = "Japan Airlines",
  flightNumber = "JL 003",
  price = 1240,
  origin = "JFK",
  originTime = "13:30 PM",
  duration = "14h 15m (Nonstop)",
  dest = "NRT",
  destTime = "16:45 PM (+1)",
  date = "Oct 12 - Oct 22",
  luggage = "2x 23kg"
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden group w-[420px]"
    >
      <div className="absolute top-0 right-0 p-4">
        <div className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold bg-indigo-400/10 px-2 py-0.5 rounded-full">Recommended</div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 mt-2">
          <div className="w-8 h-8 bg-zinc-100 rounded-md flex items-center justify-center">
            <span className="text-black font-bold text-xs">{airline.substring(0,3).toUpperCase()}</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-zinc-100">{airline}</h3>
            <span className="text-xs text-zinc-500 font-medium">Flight {flightNumber}</span>
          </div>
        </div>
        <div className="text-xl font-bold mt-2">${price}</div>
      </div>

      <div className="flex justify-between items-center relative mb-8">
        <div className="text-center">
          <div className="text-2xl font-semibold tracking-tighter">{origin}</div>
          <div className="text-[10px] text-zinc-500">{originTime}</div>
        </div>
        <div className="flex-1 flex flex-col items-center px-4">
          <div className="text-[10px] text-zinc-500 mb-1">{duration}</div>
          <div className="w-full h-[1px] bg-zinc-800 relative">
            <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-zinc-800"></div>
            <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-indigo-500"></div>
            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold tracking-tighter">{dest}</div>
          <div className="text-[10px] text-zinc-500">{destTime}</div>
        </div>
      </div>

      <div className="relative z-10 mb-8 grid grid-cols-2 gap-4 rounded-xl bg-zinc-950 p-4 border border-zinc-800">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-zinc-500" />
          <div>
            <p className="text-[10px] uppercase font-bold text-zinc-500">Date</p>
            <p className="text-xs font-semibold text-zinc-300">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <BaggageClaim className="h-5 w-5 text-zinc-500" />
          <div>
            <p className="text-[10px] uppercase font-bold text-zinc-500">Luggage</p>
            <p className="text-xs font-semibold text-zinc-300">{luggage}</p>
          </div>
        </div>
      </div>

      <button className="w-full py-3 bg-white text-black rounded-xl font-semibold text-sm hover:bg-zinc-200 transition-colors">
        Book Now
      </button>
    </motion.div>
  );
}
