import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define types for API response
type Definition = {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
};

type Meaning = {
  partOfSpeech: string;
  definitions: Definition[];
};

const DictionaryApp = () => {
  const [word, setWord] = useState<string>("");
  const [definition, setDefinition] = useState<Meaning[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDefinition = async () => {
    if (!word) return;
    setError(null);
    setDefinition(null);

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();

      if (data && Array.isArray(data) && data[0]?.meanings) {
        setDefinition(data[0].meanings);
      } else if (data?.title === "No Definitions Found") {
        setError("Definition not found.");
      } else {
        setError("Unexpected response from API.");
      }
    } catch (err) {
      setError("Error fetching definition.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-4 flex flex-col items-center">
      <header className="text-center mb-6">
        <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" alt="Dictionary Icon" className="w-16 h-16 mx-auto" />
        <h1 className="text-3xl font-bold mt-2">Dictionary App</h1>
        <p className="text-sm text-gray-600">Powered by <a href="https://dictionaryapi.dev/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Free Dictionary API</a></p>
      </header>

      <div className="w-full max-w-xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            placeholder="Enter a word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="flex-1"
          />
          <Button onClick={fetchDefinition} className="w-full sm:w-auto">Search</Button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {definition && (
          <div className="space-y-4">
            {definition.map((meaning, index) => (
              <Card key={index} className="bg-white shadow rounded-xl">
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{meaning.partOfSpeech}</h2>
                  <ul className="list-disc ml-5 space-y-1">
                    {meaning.definitions.map((def, idx) => (
                      <li key={idx}>{def.definition}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-10 text-sm text-gray-500 text-center">
        &copy; {new Date().getFullYear()} Dictionary App. Built with ❤️ using React.
      </footer>
    </div>
  );
};

export default DictionaryApp;

