import { useState } from "react";
import MahabharataRagScreen from "./MahabharataRagScreen";

export default function SageChat() {
  const [journeyStarted, setJourneyStarted] = useState(false);

  // If journey has started, show the full RAG screen
  if (journeyStarted) {
    return <MahabharataRagScreen onBack={() => setJourneyStarted(false)} />;
  }

  return (
    <div className="flex flex-row  md:flex-row items-center justify-center gap-10 w-full px-6 py-10">
      <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
        {/* Glow */}
        <div className="absolute inset-0 w-full h-full rounded-full bg-yellow-300 opacity-30 blur-2xl z-0" />

        {/* Sage Image - floating */}
        <div className="sage-floating relative w-full h-full z-10">
          <img src="/sage.png" alt="Sage" className="w-full h-full object-contain" />
        </div>

        <style jsx>{`
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-18px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          .sage-floating {
            animation: float 3.5s ease-in-out infinite;
          }
        `}</style>
      </div>

      {/* Right section */}
      <div className="flex flex-col gap-6 items-center md:items-start w-[600px] h-full max-w-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-[#A75D5D] text-center md:text-left">
          Dharma Verse Oracle
        </h1>
        
        <h2 className="text-2xl font-semibold text-[#7D6E83] text-center md:text-left">
          Seek wisdom from the Mahabharata
        </h2>
        
        <p className="text-center md:text-left text-[#7D6E83]/80 max-w-lg">
          Explore the ancient wisdom of one of the world greatest epics. 
          Discover timeless teachings on dharma, karma, and the human condition. 
          Engage with legendary figures like Krishna, Arjuna, and Draupadi.
        </p>
        
        <div className="space-y-4 mt-4 w-full max-w-lg bg-[#F8EDE3]/50 p-4 rounded-lg border border-[#C8B6A6]/30">
          <div className="flex items-start gap-3">
            <div className="bg-[#A75D5D]/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A75D5D]">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-[#7D6E83]">Ask Questions</h3>
              <p className="text-sm text-[#7D6E83]/70">Get answers drawn directly from the epic</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-[#A75D5D]/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A75D5D]">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-[#7D6E83]">Character Mode</h3>
              <p className="text-sm text-[#7D6E83]/70">Speak with legendary figures from the story</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-[#A75D5D]/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A75D5D]">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-[#7D6E83]">Source Citations</h3>
              <p className="text-sm text-[#7D6E83]/70">See which parts of the text inform each answer</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setJourneyStarted(true)}
          className="mt-6 bg-[#A75D5D] hover:bg-[#884A4A] text-white px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 text-lg font-medium"
        >
          Begin Your Journey
        </button>
      </div>
    </div>
  );
}