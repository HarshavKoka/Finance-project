import { useState } from "react"
import type { Person } from "../pages/PeoplePage"

interface Props {
  onAdd: (person: Person) => void
}

const PersonForm = ({ onAdd }: Props) => {
  const [form, setForm] = useState<Person>({
    name: "",
    dob: "",
    city: "",
    email: "",
    panName: "",
    panNumber: "",
    phoneNumber: "",
    idType: "",
    itrLast3Years: "",
    password: ""
  })

  const [selectedOption, setSelectedOption] = useState<"itr" | "password">("itr")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.name && form.dob && form.city) {
      onAdd(form)
      setForm({
        name: "",
        dob: "",
        city: "",
        email: "",
        panName: "",
        panNumber: "",
        phoneNumber: "",
        idType: "",
        itrLast3Years: "",
        password: ""
      })
      setSelectedOption("itr")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-semibold">Add New Person</h2>

      <input
        name="name"
        placeholder="Name"
        className="w-full p-2 border rounded"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="dob"
        type="date"
        placeholder="Date of Birth"
        className="w-full p-2 border rounded"
        value={form.dob}
        onChange={handleChange}
        required
      />
      <input
        name="city"
        placeholder="City"
        className="w-full p-2 border rounded"
        value={form.city}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        type="email"
        className="w-full p-2 border rounded"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        name="panName"
        placeholder="Full Name as per PAN"
        className="w-full p-2 border rounded"
        value={form.panName}
        onChange={handleChange}
        required
      />
      <input
        name="panNumber"
        placeholder="PAN Number (ABCDE1234F)"
        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
        className="w-full p-2 border rounded uppercase"
        value={form.panNumber}
        onChange={handleChange}
        required
      />
      <input
        name="phoneNumber"
        placeholder="Phone Number"
        type="tel"
        pattern="[0-9]{10}"
        className="w-full p-2 border rounded"
        value={form.phoneNumber}
        onChange={handleChange}
        required
      />

      <input
        name="idType"
        placeholder="ID Type (e.g., Aadhaar, Passport)"
        className="w-full p-2 border rounded"
        value={form.idType}
        onChange={handleChange}
        required
      />

      <div className="space-y-2">
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value as "itr" | "password")}
          className="w-full p-2 border rounded"
        >
          <option value="itr">ITR Details</option>
          <option value="password">Password</option>
        </select>
        <input
          type={selectedOption === "password" ? "password" : "text"}
          placeholder={selectedOption === "itr" ? "Last 3 Years ITR Details" : "Password"}
          className="w-full p-2 border rounded"
          value={selectedOption === "itr" ? form.itrLast3Years : form.password}
          onChange={(e) =>
            selectedOption === "itr"
              ? setForm({ ...form, itrLast3Years: e.target.value })
              : setForm({ ...form, password: e.target.value })
          }
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add
      </button>
    </form>
  )
}

export default PersonForm
