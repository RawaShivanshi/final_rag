import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface Character {
  name: string;
  description: string;
}

interface CharacterSelectorProps {
  onCharacterSelect: (character: string) => void;
}

export function CharacterSelector({ onCharacterSelect }: CharacterSelectorProps) {
  const [customCharacter, setCustomCharacter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch character data from API or use fallback
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/characters'); // Or your FastAPI endpoint
        if (response.ok) {
          const data = await response.json();
          setCharacters(data);
        } else {
          console.error('Failed to fetch characters');
          setError(true);
          // Fallback to default characters if API fails
          setCharacters([
            { name: "Krishna", description: "Divine guide" },
            { name: "Arjuna", description: "Skilled archer" },
            { name: "Yudhishthira", description: "King of dharma" },
            { name: "Draupadi", description: "Powerful queen" },
            { name: "Bhishma", description: "Grand patriarch" },
            { name: "Karna", description: "Generous warrior" },
            { name: "Duryodhana", description: "Rival king" }
          ]);
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
        setError(true);
        // Same fallback
        setCharacters([
          { name: "Krishna", description: "Divine guide" },
          { name: "Arjuna", description: "Skilled archer" },
          { name: "Yudhishthira", description: "King of dharma" },
          { name: "Draupadi", description: "Powerful queen" },
          { name: "Bhishma", description: "Grand patriarch" },
          { name: "Karna", description: "Generous warrior" },
          { name: "Duryodhana", description: "Rival king" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  // Filter characters based on search term
  const filteredCharacters = searchTerm.trim() === ""
    ? characters
    : characters.filter(char =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="animate-slide-up bg-[#F8EDE3] p-5 rounded-t-xl shadow-lg border-t border-x border-[#C8B6A6]/50 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-[#7D6E83]">
          Choose Character Perspective
          {error && <span className="text-xs text-amber-600 ml-2">(Using default characters)</span>}
        </h3>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-[#7D6E83]/50" />
          </div>
          <input
            type="text"
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-2 pr-3 bg-white/80 border border-[#C8B6A6]/30 rounded-md text-sm text-[#7D6E83] placeholder:text-[#7D6E83]/50 focus:outline-none focus:ring-2 focus:ring-[#A75D5D]/50 w-40 md:w-48"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7D6E83]/50 hover:text-[#7D6E83]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A75D5D]"></div>
        </div>
      ) : filteredCharacters.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {filteredCharacters.map((character) => (
            <button
              key={character.name}
              onClick={() => onCharacterSelect(character.name)}
              className="flex flex-col items-center bg-[#DFD3C3] border border-[#C8B6A6] hover:bg-[#A75D5D] hover:text-white transition-colors text-[#7D6E83] p-3 rounded-md text-sm"
            >
              <span className="font-medium">{character.name}</span>
              <span className="text-xs opacity-75 mt-1">{character.description}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-[#7D6E83]/70">
          No characters match your search.
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Custom character name..."
          value={customCharacter}
          onChange={(e) => setCustomCharacter(e.target.value)}
          className="flex-1 px-3 py-2 bg-white border border-[#C8B6A6] rounded-md text-sm text-[#7D6E83] placeholder:text-[#7D6E83]/50 focus:outline-none focus:ring-2 focus:ring-[#A75D5D]/50"
        />
        <button
          onClick={() => {
            if (customCharacter.trim()) {
              onCharacterSelect(customCharacter);
              setCustomCharacter("");
            }
          }}
          disabled={!customCharacter.trim()}
          className="bg-[#A75D5D] hover:bg-[#884A4A] text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
