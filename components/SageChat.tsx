import { useState } from "react";
import MahabharataRagScreen from "./MahabharataRagScreen";
import { motion } from "framer-motion";
export default function SageChat() {
  const [journeyStarted, setJourneyStarted] = useState(false);

  // If journey has started, show the full RAG screen
  if (journeyStarted) {
    return <MahabharataRagScreen onBack={() => setJourneyStarted(false)} />;
  }

  return (

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex flex-row md:flex-row items-center justify-center gap-10 w-full px-6 h-screen"
    >
    <div className="flex flex-row md:flex-row items-center justify-center gap-10 w-full px-6 h-screen">
 
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
      <div className="py-[100px] px-[100px]">
      <div className="flex flex-col items-center md:items-start w-[600px] h-full max-w-lg">
       <h1 style={{ fontSize: "54px", fontWeight: "900" ,marginBottom: "4px" }} className="text-center text-[#A75D5D]">
       Dharma Verse Oracle
      </h1>
        <h2 className="text-2xl py-[0px] font-semibold text-[#7D6E83] text-center md:text-left">
          Seek wisdom from the Mahabharata
        </h2>
  
        
        <div className="p-[10px] space-y-4 mt-4 w-full max-w-lg bg-[#F8EDE3]/50 rounded-lg border border-[#C8B6A6]/30">
          <div className="flex items-start gap-3 ">
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
        </div>
        
        <div className="flex justify-center mt-6">
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
  <button
    onClick={() => setJourneyStarted(true)}
    style={{
      backgroundColor: '#A75D5D',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '12px',
      fontSize: '18px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      margin: '0 auto',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = '#884A4A';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = '#A75D5D';
      e.currentTarget.style.transform = 'translateY(0px)';
    }}
  >
    Begin Your Journey
  </button>
</div>

</div>

      </div>
    </div>
    </motion.div>
  );
  
  
}
