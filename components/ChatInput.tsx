import { useState, FormEvent } from 'react';
import { Send, User } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (message: string, characterMode: boolean, character?: string) => void;
  isLoading: boolean;
  onToggleCharacterSelector: (show: boolean) => void;
  activeCharacter?: string;
}

export function ChatInput({ onSubmit, isLoading, onToggleCharacterSelector, activeCharacter }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [characterMode, setCharacterMode] = useState(false);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (characterMode && !activeCharacter) return; // Guard: Should be disabled, but just in case
    onSubmit(message, characterMode, activeCharacter);
    setMessage('');
  };
  
  const toggleCharacterMode = () => {
    const newMode = !characterMode;
    setCharacterMode(newMode);
    onToggleCharacterSelector(newMode);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white/80 p-4 rounded-xl border border-[#C8B6A6]/50 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 mr-2">
          <User className={characterMode ? "text-[#A75D5D]" : "text-[#7D6E83]/50"} size={18} />
          {/* Toggle button */}
          <button
            type="button"
            onClick={toggleCharacterMode}
            aria-label="Toggle character mode"
            className={`relative w-11 h-6 rounded-full transition-colors ${
              characterMode ? 'bg-[#A75D5D]' : 'bg-gray-200'
            }`}
          >
            <span 
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transform transition-transform ${
                characterMode ? 'translate-x-6' : 'translate-x-1'
              }`} 
            />
          </button>
        </div>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            characterMode 
              ? activeCharacter 
                ? `Ask ${activeCharacter} from Mahabharata...` 
                : "Select a character first..."
              : "Ask about Mahabharata..."
          }
          className="flex-1 bg-[#F8EDE3]/50 border border-[#C8B6A6]/30 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A75D5D]/50 text-[#7D6E83] placeholder:text-[#7D6E83]/50"
          disabled={isLoading || (characterMode && !activeCharacter)}
        />
        
        <button 
          type="submit" 
          disabled={!message.trim() || isLoading || (characterMode && !activeCharacter)}
          className="bg-[#A75D5D] hover:bg-[#884A4A] text-white p-2 rounded-lg disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
      
      {activeCharacter && characterMode && (
        <div className="absolute -top-8 right-4 bg-[#A75D5D] text-white px-3 py-1 rounded-t-lg text-sm font-medium">
          Speaking as: {activeCharacter}
        </div>
      )}
    </div>
  );
}
