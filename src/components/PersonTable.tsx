import { useState } from "react"
import type { Person } from "../pages/PeoplePage"
import SettingsButton from "./SettingButton"

interface Props {
  person: Person
  people: Person[]
  setPeople: (people: Person[]) => void
  onDelete: () => void
  group: string
}

const PersonTable = ({ person, people, setPeople, onDelete, group }: Props) => {
  const [selectedOption, setSelectedOption] = useState<"itr" | "password">(
    person.itrLast3Years ? "itr" : person.password ? "password" : "itr"
  )
  const [showPassword, setShowPassword] = useState(false)

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

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

            {group === "IncomeTax" && <th className="p-3">ITR / Password</th>}
            {group === "GST" && (
              <>
                <th className="p-3">GST Number</th>
                <th className="p-3">Business Name</th>
              </>
            )}
            {group === "MCA" && (
              <>
                <th className="p-3">CIN Number</th>
                <th className="p-3">Company Name</th>
              </>
            )}

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

            {group === "IncomeTax" && (
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

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type={
                      selectedOption === "password" && !showPassword
                        ? "password"
                        : "text"
                    }
                    value={getValue()}
                    onChange={(e) =>
                      selectedOption === "itr"
                        ? handleChange("itrLast3Years", e.target.value)
                        : handleChange("password", e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                  {selectedOption === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCopy(getValue())}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </td>
            )}

            {group === "GST" && (
              <>
                <td className="p-3">
                  <input
                    type="text"
                    value={person.gstNumber || ""}
                    onChange={(e) => handleChange("gstNumber", e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 mt-9 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(person.gstNumber || "")}
                    className="mt-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Copy
                  </button>
                </td>
                <td className="p-3">
                  <input
                    type="text"
                    value={person.businessName || ""}
                    onChange={(e) => handleChange("businessName", e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                </td>
              </>
            )}

            {group === "MCA" && (
              <>
                <td className="p-3">
                  <input
                    type="text"
                    value={person.cinNumber || ""}
                    onChange={(e) => handleChange("cinNumber", e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(person.cinNumber || "")}
                    className="mt-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Copy
                  </button>
                </td>
                <td className="p-3">
                  <input
                    type="text"
                    value={person.companyName || ""}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                </td>
              </>
            )}

            <td className="flex flex-col items-center gap-2">
              {(group === "IncomeTax" || group === "GST" || group === "MCA") && (
                <SettingsButton group={group} />
              )}

              <button
                onClick={onDelete}
                className="px-2 py-1 my-3 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
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
