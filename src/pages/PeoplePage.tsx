import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PersonForm from "../components/PersonForm";
import PersonTable from "../components/PersonTable";

export interface Person {
  name: string;
  age: number;
  city: string;
  email: string;
  panName: string;
  panNumber: string;
  phoneNumber: string;
  idType: string;
  itrLast3Years: string;
}

const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [searchResults, setSearchResults] = useState<Person[]>([]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const group = searchParams.get("group") || "General";
  const LOCAL_KEY = `people_data_${group}`;

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        const parsed: Person[] = JSON.parse(stored);
        setPeople(parsed);
      } catch {
        console.error("Invalid JSON in localStorage");
      }
    }
  }, [LOCAL_KEY]);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(people));
  }, [people, LOCAL_KEY]);

  const addPerson = (person: Person) => {
    setPeople([...people, person]);
    setShowForm(false);
  };

  const deletePerson = (index: number) => {
    const updated = people.filter((_, i) => i !== index);
    setPeople(updated);
    setSearchTerm("");
    setSuggestions([]);
    setSearchResults([]);
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    const lower = value.toLowerCase();
    const filtered = people.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.panNumber.toLowerCase().includes(lower) ||
        p.phoneNumber.includes(lower)
    );
    setSuggestions(filtered.slice(0, 6));
  };

  const handleSelectSuggestion = (person: Person) => {
    setSearchTerm(person.name);
    setSuggestions([]);
    setSearchResults([person]);
  };

  const handleSearchClick = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const results = people.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.panNumber.toLowerCase().includes(lower) ||
        p.phoneNumber.includes(lower)
    );
    setSuggestions([]);
    setSearchResults(results);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-700">
          {group} People Manager
        </h1>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Back to Home
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center text-blue-600 font-semibold"
        >
          <span className="text-xl mr-2">+</span> Add new Person details
        </button>
      </div>

      {showForm && <PersonForm onAdd={addPerson} />}

      <div className="relative w-full max-w-md ml-auto">
        <div className="flex">
          <input
            type="text"
            placeholder="Search by name, PAN, or phone..."
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            className="border border-gray-300 rounded-l px-4 py-2 w-full"
          />
          <button
            onClick={handleSearchClick}
            className="px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          >
            🔍
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded shadow max-h-60 overflow-y-auto">
            {suggestions.map((person, idx) => (
              <li
                key={idx}
                onClick={() => handleSelectSuggestion(person)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {person.name} — {person.panNumber} — {person.phoneNumber}
              </li>
            ))}
          </ul>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          {searchResults.map((person, id) => (
            <PersonTable
              key={id}
              person={person}
              onDelete={() => {
                const index = people.findIndex((p) => p.name === person.name);
                if (index !== -1) deletePerson(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PeoplePage;
