import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import PersonForm from "../components/PersonForm"
import PersonTable from "../components/PersonTable"

export interface Person {
  name: string
  dob: string
  city: string
  email: string
  panName: string
  panNumber: string
  phoneNumber: string
  idNumber: string
  itrLast3Years: string
  gstNumber?: string
  businessName?: string
  cinNumber?: string
  companyName?: string
  password?: string
  username?: string
}

const PeoplePage = () => {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<Person[]>([])
  const [searchResults, setSearchResults] = useState<Person[]>([])
  const [highlightIndex, setHighlightIndex] = useState(-1)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const group = searchParams.get("group") || "General"
  const LOCAL_KEY = `people_data_${group}`

  const queryClient = useQueryClient()

 
  const { data: people = [] } = useQuery<Person[]>({
    queryKey: ["people", group],
    queryFn: async () => {
      const stored = localStorage.getItem(LOCAL_KEY)
      return stored ? JSON.parse(stored) : []
    },
  })

  const addPersonMutation = useMutation({
    mutationFn: async (person: Person) => person,
    onSuccess: (newPerson) => {
      queryClient.setQueryData<Person[]>(["people", group], (old = []) => {
        const updated = [...old, newPerson]
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated))
        return updated
      })
    },
  })


  const deletePersonMutation = useMutation({
    mutationFn: async (index: number) => index,
    onSuccess: (index) => {
      queryClient.setQueryData<Person[]>(["people", group], (old = []) => {
        const updated = old.filter((_, i) => i !== index)
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated))
        return updated
      })
    },
  })

  const addPerson = (person: Person) => {
    addPersonMutation.mutate(person)
    setShowForm(false)
  }

  const deletePerson = (index: number) => {
    deletePersonMutation.mutate(index)
    setSearchTerm("")
    setSuggestions([])
    setSearchResults([])
  }

  const handleInputChange = (value: string) => {
    setSearchTerm(value)
    setHighlightIndex(-1)
    if (!value.trim()) {
      setSuggestions([])
      return
    }
    const lower = value.toLowerCase()
    const filtered = people.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.panNumber && p.panNumber.toLowerCase().includes(lower)) ||
        (p.phoneNumber && p.phoneNumber.includes(lower))
    )
    setSuggestions(filtered.slice(0, 6))
  }

  const handleSelectSuggestion = (person: Person) => {
    setSearchTerm(person.name)
    setSuggestions([])
    setSearchResults([person])
    setHighlightIndex(-1)
  }

  const handleSearchClick = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }
    const lower = searchTerm.toLowerCase()
    const results = people.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.panNumber && p.panNumber.toLowerCase().includes(lower)) ||
        (p.phoneNumber && p.phoneNumber.includes(lower))
    )
    setSuggestions([])
    setSearchResults(results)
    setHighlightIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[highlightIndex])
      } else {
        handleSearchClick()
      }
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-700">
          {group} People Manager
        </h1>
        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer"
        >
          Back to Home
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center text-blue-600 font-semibold cursor-pointer"
        >
          <span className="text-xl mr-2 ">+</span> Add new Person details
        </button>
      </div>

      {showForm && <PersonForm onAdd={addPerson} group={group} />}

      <div className="relative w-full max-w-md ml-auto">
        <div className="flex">
          <input
            type="text"
            placeholder="Search by name, PAN, or phone..."
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border border-gray-300 rounded-l px-4 py-2 w-full"
          />
          <button
            onClick={handleSearchClick}
            className="px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600 cursor-pointer"
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
                className={`px-4 py-2 cursor-pointer ${
                  idx === highlightIndex ? "bg-blue-100" : "hover:bg-blue-50"
                }`}
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
              people={people}
              setPeople={() => {}} 
              onDelete={() => deletePerson(id)}
              group={group}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PeoplePage
