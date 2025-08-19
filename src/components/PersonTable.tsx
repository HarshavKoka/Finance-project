import { useState } from "react"
import type { Person } from "../pages/PeoplePage"

interface Props {
  person: Person
  people: Person[]
  setPeople: (people: Person[]) => void
  onDelete: () => void
}

const PersonTable = ({ person, people, setPeople, onDelete }: Props) => {
  const [selectedOption, setSelectedOption] = useState<"itr" | "password">(
    person.itrLast3Years ? "itr" : person.password ? "password" : "itr"
  )

  const handleChange = (field: keyof Person, value: string) => {
    const personIndex = people.findIndex(
      (p) => p.name === person.name && p.panNumber === person.panNumber
    )
    if (personIndex === -1) return
    const updated = [...people]
    updated[personIndex] = { ...updated[personIndex], [field]: value }
    setPeople(updated)
  }

  const getValue = () =>
    selectedOption === "itr" ? person.itrLast3Years || "" : person.password || ""

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">DOB</th>
            <th className="p-3">City</th>
            <th className="p-3">Email</th>
            <th className="p-3">PAN Name</th>
            <th className="p-3">PAN Number</th>
            <th className="p-3">Phone</th>
            <th className="p-3">ID Type</th>
            <th className="p-3">ITR / Password</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3">{person.name}</td>
            <td className="p-3">{person.dob}</td>
            <td className="p-3">{person.city}</td>
            <td className="p-3">{person.email}</td>
            <td className="p-3">{person.panName}</td>
            <td className="p-3">{person.panNumber}</td>
            <td className="p-3">{person.phoneNumber}</td>
            <td className="p-3">{person.idType}</td>
            <td className="p-3 space-y-1">
              <select
                value={selectedOption}
                onChange={(e) =>
                  setSelectedOption(e.target.value as "itr" | "password")
                }
                className="border border-gray-300 rounded px-2 py-1 w-full"
              >
                <option value="itr">ITR Details</option>
                <option value="password">Password</option>
              </select>
              <input
                type={selectedOption === "password" ? "password" : "text"}
                value={getValue()}
                onChange={(e) =>
                  selectedOption === "itr"
                    ? handleChange("itrLast3Years", e.target.value)
                    : handleChange("password", e.target.value)
                }
                className="border border-gray-300 rounded px-2 py-1 w-full mt-1"
              />
            </td>
            <td className="p-3">
              <button
                onClick={onDelete}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PersonTable
