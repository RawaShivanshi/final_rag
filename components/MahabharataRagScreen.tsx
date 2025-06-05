"use client";
import React, { useState, useEffect, useRef } from "react";
import { CharacterSelector } from "./CharacterSelector";
import { ChatInput } from "./ChatInput";
import { LoadingIndicator } from "./LoadingIndicator";
import { ArrowLeft, Book, MessageSquare, X, Info } from "lucide-react";

interface MahabharataRagScreenProps {
  onBack?: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  character?: string;
  timestamp: Date;
  confidenceScore?: number;
  sources?: {
    title: string;
    source: string;
    isWebSource: boolean;
    url?: string;
  }[];
}

export default function MahabharataRagScreen({ onBack }: MahabharataRagScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState<string | undefined>(undefined);
  const [showSourceInfo, setShowSourceInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate or get session ID
  const [sessionId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("session_id") || crypto.randomUUID();
    }
    return "";
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: "initial",
      role: "assistant",
      content:
        "Namaste! I am your guide to the wisdom of the Mahabharata. You can ask me about any character, event, or teaching from this great epic. Toggle the character mode to speak directly with legendary figures like Krishna, Arjuna, or Draupadi.",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  const handleSendMessage = async (message: string, isCharacterMode: boolean, character?: string) => {
    const selectedCharacter = isCharacterMode ? character || activeCharacter : undefined;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
      character: selectedCharacter,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const API_BASE_URL = "https://final-rag-cl23.onrender.com" ;
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          mode: isCharacterMode ? "character" : "ai",
          character: selectedCharacter,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from API");
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: data.id || Date.now().toString() + "-response",
        role: "assistant",
        content: data.response,
        character: data.character,
        timestamp: new Date(),
        confidenceScore: data.confidenceScore,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: ChatMessage = {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content:
          "Forgive me, seeker. The ancient texts seem clouded at this moment. Please try your question again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const toggleCharacterSelector = (show: boolean) => {
    setShowCharacterSelector(show);
    if (!show) setActiveCharacter(undefined);
  };

  const handleCharacterSelect = (character: string) => {
    setActiveCharacter(character);
    setShowCharacterSelector(false);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "initial",
        role: "assistant",
        content:
          "Namaste! I am your guide to the wisdom of the Mahabharata. You can ask me about any character, event, or teaching from this great epic. Toggle the character mode to speak directly with legendary figures like Krishna, Arjuna, or Draupadi.",
        timestamp: new Date(),
      },
    ]);
    setActiveCharacter(undefined);
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <header className="flex justify-between items-center px-6 py-4 border-b border-[#C8B6A6]/30 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full text-[#7D6E83] hover:text-[#A75D5D] hover:bg-[#F8EDE3]/50 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#A75D5D]/20 flex items-center justify-center">
              <Book size={16} className="text-[#A75D5D]" />
            </div>
            <h1 className="text-2xl font-bold text-[#A75D5D]">Dharma Verse Oracle</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSourceInfo(!showSourceInfo)}
            className="p-2 rounded-full text-[#7D6E83] hover:text-[#A75D5D] hover:bg-[#F8EDE3]/50 transition-colors"
            aria-label="Information about sources"
          >
            <Info size={20} />
          </button>
          <button
            onClick={handleClearChat}
            className="px-4 py-2 border border-[#C8B6A6]/50 rounded-lg text-sm font-medium hover:bg-[#F8EDE3]/50 text-[#7D6E83] hover:text-[#A75D5D] transition-colors flex items-center gap-2"
          >
            <X size={16} />
            Clear Chat
          </button>
        </div>
      </header>

      {showSourceInfo && (
        <div className="m-4 p-4 bg-[#F8EDE3] border border-[#C8B6A6]/50 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[#7D6E83] font-medium">About the Knowledge Source</h3>
            <button
              onClick={() => setShowSourceInfo(false)}
              className="text-[#7D6E83] hover:text-[#A75D5D]"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-[#7D6E83]/80">
            This oracle draws wisdom from the original Mahabharata text. Using advanced AI, it retrieves the most relevant passages to answer your questions.
            Character perspectives are based on their portrayal in the epic and associated literature.
            Confidence scores reflect the oracle&apos;s assessment of response accuracy based on textual evidence.
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {messages.length === 1 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F8EDE3] to-[#A75D5D] flex items-center justify-center mb-8 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-[#7D6E83]">Welcome, Seeker of Wisdom</h2>
            <p className="text-[#7D6E83] max-w-lg backdrop-blur-sm bg-white/50 p-5 rounded-lg shadow-md border border-[#C8B6A6]/30 text-lg">
              The Mahabharata contains the essence of all sacred knowledge. Ask about its characters, stories, or teachings to begin your journey.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-6`}
              >
                <div
                  className={`
                    max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-md
                    ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-[#A75D5D] to-[#884A4A] text-white"
                        : "bg-gradient-to-br from-[#F8EDE3] to-[#DFD3C3] text-[#7D6E83]"
                    }
                  `}
                >
                  {msg.role === "user" && msg.character && (
                    <div className="text-xs font-medium text-white/80 mb-1">
                      Speaking to {msg.character}
                    </div>
                  )}

                  {msg.role === "assistant" && msg.character && (
                    <div className="flex items-center gap-2 text-sm font-medium text-[#A75D5D] mb-2 pb-2 border-b border-[#C8B6A6]/30">
                      <div className="w-5 h-5 rounded-full bg-[#A75D5D]/20 flex items-center justify-center">
                        <MessageSquare size={10} className="text-[#A75D5D]" />
                      </div>
                      Speaking as {msg.character}
                    </div>
                  )}

                  <div className="whitespace-pre-wrap text-base">{msg.content}</div>

                  <div className="mt-3 pt-1 flex justify-between items-end text-xs opacity-70">
                    <span>
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {msg.confidenceScore !== undefined &&
                      msg.role === "assistant" && (
                        <div
                          className={`flex items-center gap-1 ${
                            msg.confidenceScore > 0.7
                              ? "text-green-600"
                              : "text-amber-600"
                          }`}
                        >
                          Confidence: {Math.round(msg.confidenceScore * 100)}%
                        </div>
                      )}
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-[#C8B6A6]/30">
                      <p className="text-xs font-medium mb-1">Sources:</p>
                      <ul className="text-xs space-y-1">
                        {msg.sources.map((source, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span>•</span>
                            <div>
                              <span className="font-medium">{source.title}</span>
                              <span className="opacity-75"> ({source.source})</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && <LoadingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white/90 backdrop-blur-md border-t border-[#C8B6A6]/30 shadow-lg">
        {showCharacterSelector && (
          <CharacterSelector onCharacterSelect={handleCharacterSelect} />
        )}

        <ChatInput
          onSubmit={handleSendMessage}
          isLoading={loading}
          onToggleCharacterSelector={toggleCharacterSelector}
          activeCharacter={activeCharacter}
        />
      </div>
    </div>
  );
}
