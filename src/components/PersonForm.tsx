import { useState } from "react"
import type{ Person } from "../pages/PeoplePage"

interface Props {
  onAdd: (person: Person) => void
}

const PersonForm = ({ onAdd }: Props) => {
  const [form, setForm] = useState<Person>({
    name: "",
    age: 0,
    city: "",
    email: "",
    panName: "",
    panNumber: "",
    phoneNumber: "",
    idType: "",
    itrLast3Years: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.name === "age" ? +e.target.value : e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.name && form.age && form.city) {
      onAdd(form)
      setForm({
        name: "",
        age: 0,
        city: "",
        email: "",
        panName: "",
        panNumber: "",
        phoneNumber: "",
        idType: "",
        itrLast3Years: ""
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-semibold">Add New Person</h2>

      <input name="name" placeholder="Name" className="w-full p-2 border rounded" value={form.name} onChange={handleChange} required />
      <input name="age" type="number" placeholder="Age" className="w-full p-2 border rounded" value={form.age || ""} onChange={handleChange} required />
      <input name="city" placeholder="City" className="w-full p-2 border rounded" value={form.city} onChange={handleChange} required />
      <input name="email" placeholder="Email" type="email" className="w-full p-2 border rounded" value={form.email} onChange={handleChange} required />

      <input name="panName" placeholder="Full Name as per PAN" className="w-full p-2 border rounded" value={form.panName} onChange={handleChange} required />
      <input name="panNumber" placeholder="PAN Number (ABCDE1234F)" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" className="w-full p-2 border rounded uppercase" value={form.panNumber} onChange={handleChange} required />
      <input name="phoneNumber" placeholder="Phone Number" type="tel" pattern="[0-9]{10}" className="w-full p-2 border rounded" value={form.phoneNumber} onChange={handleChange} required />

      <input name="idType" placeholder="ID Type (e.g., Aadhaar, Passport)" className="w-full p-2 border rounded" value={form.idType} onChange={handleChange} required />
      <input name="itrLast3Years" placeholder="Last 3 Years ITR Details" className="w-full p-2 border rounded" value={form.itrLast3Years} onChange={handleChange} required />

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Add
      </button>
    </form>
  )
}

export default PersonForm
