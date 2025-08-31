import { useState } from "react"
import type { Person } from "../pages/PeoplePage"

interface Props {
  person: Person
  people: Person[]
  setPeople: (people: Person[]) => void
  onDelete: () => void
  group: string
}

const PersonTable = ({ person, people, setPeople, onDelete, group }: Props) => {
  const [selectedOption, setSelectedOption] = useState<"itr" | "password" | "username">(
    person.itrLast3Years ? "itr" : person.password ? "password" : person.username ? "username" : "itr"
  )

  const [showPassword, setShowPassword] = useState(false)

  
  const [tempValue, setTempValue] = useState(
    selectedOption === "itr"
      ? person.itrLast3Years || ""
      : selectedOption === "password"
      ? person.password || ""
      : person.username || ""
  )
  const [isEditing, setIsEditing] = useState(false)



  const [isEditingMcaPassword, setIsEditingMcaPassword] = useState(false)
  const [tempMcaPassword, setTempMcaPassword] = useState(person.password || "")


  const [tempGstUsername, setTempGstUsername] = useState(person.username || "")
  const [tempGstPassword, setTempGstPassword] = useState(person.password || "")
  const [isEditingGstUsername, setIsEditingGstUsername] = useState(false)
  const [isEditingGstPassword, setIsEditingGstPassword] = useState(false)

  const handleSave = () => {
    const personIndex = people.findIndex((p) => p.name === person.name)
    if (personIndex === -1) return
    const updated = [...people]

    if (selectedOption === "itr") {
      updated[personIndex] = { ...updated[personIndex], itrLast3Years: tempValue }
    } else if (selectedOption === "password") {
      updated[personIndex] = { ...updated[personIndex], password: tempValue }
    } else {
      updated[personIndex] = { ...updated[personIndex], username: tempValue }
    }

    setPeople(updated)
    setIsEditing(false)
  }


  const handleSaveMcaPassword = () => {
    const idx = people.findIndex((p) => p.name === person.name)
    if (idx === -1) return
    const updated = [...people]
    updated[idx] = { ...updated[idx], password: tempMcaPassword }
    setPeople(updated)
    setIsEditingMcaPassword(false)
  }

  const handleSaveGstUsername = () => {
    const idx = people.findIndex((p) => p.name === person.name)
    if (idx === -1) return
    const updated = [...people]
    updated[idx] = { ...updated[idx], username: tempGstUsername }
    setPeople(updated)
    setIsEditingGstUsername(false)
  }

  const handleSaveGstPassword = () => {
    const idx = people.findIndex((p) => p.name === person.name)
    if (idx === -1) return
    const updated = [...people]
    updated[idx] = { ...updated[idx], password: tempGstPassword }
    setPeople(updated)
    setIsEditingGstPassword(false)
  }

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
            {group !== "MCA" && group !== "GST" && <th className="p-3">PAN Name</th>}
            {group !== "MCA" && group !== "GST" && <th className="p-3">PAN Number</th>}
            <th className="p-3">Phone</th>
            <th className="p-3">ID Number</th>
            {group === "IncomeTax" && <th className="p-3">ITR / Password / Username</th>}
            {group === "GST" && (
              <>
                <th className="p-3">GST Number</th>
                <th className="p-3">Business Name</th>
                <th className="p-3">Username</th>
                <th className="p-3">Password</th>
              </>
            )}
            {group === "MCA" && (
              <>
                <th className="p-3">Username</th>
                <th className="p-3">Password</th>
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

            {group !== "MCA" && group !== "GST" && <td className="p-3">{person.panName}</td>}
            {group !== "MCA" && group !== "GST" && <td className="p-3">{person.panNumber}</td>}

            <td className="p-3">{person.phoneNumber}</td>
            <td className="p-3">{person.idNumber}</td>

           
            {group === "IncomeTax" && (
              <td className="p-3 space-y-2 pt-10">
                <select
                  value={selectedOption}
                  onChange={(e) => {
                    const val = e.target.value as "itr" | "password" | "username"
                    setSelectedOption(val)
                    setTempValue(
                      val === "itr"
                        ? person.itrLast3Years || ""
                        : val === "password"
                        ? person.password || ""
                        : person.username || ""
                    )
                  }}
                  className="border border-gray-300 rounded px-2 py-1 w-full cursor-pointer"
                >
                  <option value="itr">ITR Details</option>
                  <option value="password">Password</option>
                  <option value="username">Username</option>
                </select>

                {isEditing ? (
                  <div className="flex flex-col gap-2 mt-1">
                    {selectedOption === "itr" ? (
                      <textarea
                        className="border border-gray-300 rounded px-2 py-1 w-full resize"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type={selectedOption === "password" && !showPassword ? "password" : "text"}
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                        {selectedOption === "password" && (
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleSave}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 w-fit cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 border border-gray-300 rounded w-full whitespace-pre-line">
                      {tempValue ? (selectedOption === "password" ? "********" : tempValue) : "No details found"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(tempValue || "")}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-copy"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </td>
            )}

            {group === "GST" && (
              <>
                <td className="p-3">{person.gstNumber || "No details found"}</td>
                <td className="p-3">{person.businessName || "No details found"}</td>

                <td className="p-3 pt-10">
                  {isEditingGstUsername ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={tempGstUsername}
                        onChange={(e) => setTempGstUsername(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                      <button
                        type="button"
                        onClick={handleSaveGstUsername}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 w-fit cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="px-2 py-1 border border-gray-300 rounded w-full">{tempGstUsername || "No details found"}</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(tempGstUsername || "")}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-copy"
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingGstUsername(true)}
                          className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </td>

                <td className="p-3 pt-10">
                  {isEditingGstPassword ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={tempGstPassword}
                          onChange={(e) => setTempGstPassword(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveGstPassword}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 w-fit cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="px-2 py-1  border border-gray-300 rounded w-full">
                        {tempGstPassword ? (showPassword ? tempGstPassword : "********") : "No details found"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(tempGstPassword || "")}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-copy"
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingGstPassword(true)}
                          className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </>
            )}

            
            {group === "MCA" && (
              <>
               
                <td className="p-3">{person.username || "No details found"}</td>

               
                <td className="p-3 pt-14 ">
                  {isEditingMcaPassword ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 ">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={tempMcaPassword}
                          onChange={(e) => setTempMcaPassword(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-full "
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveMcaPassword}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 w-fit cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="px-2 py-1 border border-gray-300 rounded w-full">
                        {tempMcaPassword ? (showPassword ? tempMcaPassword : "********") : "No details found"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(tempMcaPassword || "")}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-copy"
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingMcaPassword(true)}
                          className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </td>

                <td className="p-3">{person.companyName || "No details found"}</td>
              </>
            )}

         
            <td className="flex flex-col items-center gap-2 ">
              {group === "IncomeTax" && (
                <a
                  href="https://eportal.incometax.gov.in/iec/foservices/#/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 mt-3 text-gray-600 hover:text-gray-800 cursor-pointer pt-5"
                >
                  ⚙️
                </a>
              )}
              {group === "GST" && (
                <a
                  href="https://services.gst.gov.in/services/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 mt-3 text-gray-600 hover:text-gray-800 cursor-pointer pt-4"
                >
                  ⚙️
                </a>
              )}
              {group === "MCA" && (
                <a
                  href="https://www.mca.gov.in/mcafoportal/login.do"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 mt-3 text-gray-600 hover:text-gray-800 cursor-pointer pt-7"
                >
                  ⚙️
                </a>
              )}

              <button
                onClick={onDelete}
                className="px-2 py-1 my-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
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
