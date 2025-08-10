import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import PersonForm from "../components/PersonForm"
import PersonTable from "../components/PersonTable"

export interface Person {
  name: string
  age: number
  city: string
  email: string 
}

const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([])
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [matchedPerson, setMatchedPerson] = useState<Person | null>(null)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const group = searchParams.get("group") || "General"
  const LOCAL_KEY = `people_data_${group}`

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY)
    if (stored) {
      try {
        const parsed: Person[] = JSON.parse(stored)
        setPeople(parsed)
      } catch {
        console.error("Invalid JSON in localStorage")
      }
    }
  }, [LOCAL_KEY])

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(people))
  }, [people, LOCAL_KEY])

  useEffect(() => {
    const found = people.find(
      p => p.name.toLowerCase() === searchTerm.trim().toLowerCase()
    )
    setMatchedPerson(found || null)
  }, [searchTerm, people])

  const addPerson = (person: Person) => {
    setPeople([...people, person])
    setShowForm(false)
  }

  const deletePerson = (index: number) => {
    setPeople(people.filter((_, i) => i !== index))
    setMatchedPerson(null)
    setSearchTerm("")
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-700">{group} People Manager</h1>
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

      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
        />
      </div>

      {matchedPerson && (
        <PersonTable
          person={matchedPerson}
          onDelete={() => {
            const index = people.findIndex(p => p.name === matchedPerson.name)
            if (index !== -1) deletePerson(index)
          }}
        />
      )}
    </div>
  )
}

export default PeoplePage
