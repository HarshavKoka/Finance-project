import { useForm } from "react-hook-form"
import { useState } from "react"


interface BasePerson {
  name: string
  dob: string
  city: string
  email: string
  phoneNumber: string
  idNumber: string
}

interface IncomeTaxPerson extends BasePerson {
  panName: string
  panNumber: string
  itrLast3Years: string
  password?: string
  username?: string
}

interface GSTPerson extends BasePerson {
  username: string
  password: string
  gstNumber: string
  businessName: string
}

interface MCAPerson extends BasePerson {
  username: string
  password: string
  companyName: string
}

export type Person = IncomeTaxPerson | GSTPerson | MCAPerson


interface Props {
  onAdd: (person: Person) => void
  group: "IncomeTax" | "GST" | "MCA"
}


const PersonForm = ({ onAdd, group }: Props) => {
  const { register, handleSubmit, reset } = useForm<Person>({
    defaultValues: {
      name: "",
      dob: "",
      city: "",
      email: "",
      phoneNumber: "",
      idNumber: "",
      ...(group === "IncomeTax"
        ? { panName: "", panNumber: "", itrLast3Years: "", password: "", username: "" }
        : group === "GST"
        ? { username: "", password: "", gstNumber: "", businessName: "" }
        : { username: "", password: "", companyName: "" }),
    } as Person,
  })

  const [selectedOption, setSelectedOption] = useState<"itr" | "password" | "username">("itr")

  const onSubmit = (data: Person) => {
    if (data.name && data.dob && data.city) {
      onAdd(data)
      reset()
      setSelectedOption("itr")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <h2 className="text-xl font-semibold">Add New {group} Details of Person</h2>

      <input {...register("name", { required: true })} placeholder="Name" className="w-full p-2 border rounded" />
      <input {...register("dob", { required: true })} type="date" placeholder="Date of Birth" className="w-full p-2 border rounded" />
      <input {...register("city", { required: true })} placeholder="City" className="w-full p-2 border rounded" />
      <input {...register("email", { required: true })} type="email" placeholder="Email" className="w-full p-2 border rounded" />
      <input {...register("phoneNumber", { required: true, pattern: /^[0-9]{10}$/ })} placeholder="Phone Number" className="w-full p-2 border rounded" />
      <input {...register("idNumber", { required: true })} placeholder="ID Type (e.g., 1, 2, 3)" className="w-full p-2 border rounded" />

      {group === "IncomeTax" && (
        <>
          <input {...register("panName", { required: true })} placeholder="Full Name as per PAN" className="w-full p-2 border rounded" />
          <input
            {...register("panNumber", { required: true, pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ })}
            placeholder="PAN Number (ABCDE1234F)"
            className="w-full p-2 border rounded uppercase"
          />

          <div className="space-y-2">
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value as "itr" | "password" | "username")}
              className="w-full p-2 border rounded cursor-pointer"
            >
              <option value="itr">ITR Details</option>
              <option value="password">Password</option>
              <option value="username">Username</option>
            </select>

            {selectedOption === "itr" ? (
              <textarea
                {...register("itrLast3Years", { required: true })}
                placeholder="Last 3 Years ITR Details"
                className="w-full p-2 border rounded resize"
                rows={4}
              />
            ) : selectedOption === "password" ? (
              <input {...register("password", { required: true })} type="password" placeholder="Password" className="w-full p-2 border rounded" />
            ) : (
              <input {...register("username", { required: true })} type="text" placeholder="Username" className="w-full p-2 border rounded" />
            )}
          </div>
        </>
      )}

      {group === "GST" && (
        <>
          <input {...register("username", { required: true })} placeholder="Username" className="w-full p-2 border rounded" />
          <input {...register("password", { required: true })} type="password" placeholder="Password" className="w-full p-2 border rounded" />
          <input {...register("gstNumber", { required: true })} placeholder="GST Number" className="w-full p-2 border rounded" />
          <input {...register("businessName", { required: true })} placeholder="Business Name" className="w-full p-2 border rounded" />
        </>
      )}

      
      {group === "MCA" && (
        <>
          <input
            {...register("username", { required: true })}
            placeholder="Username (CIN/LLPIN/FCRN for Company/LLP and Email ID for other users)"
            className="w-full p-2 border rounded"
          />
          <input {...register("password", { required: true })} type="password" placeholder="Password" className="w-full p-2 border rounded" />
          <input {...register("companyName", { required: true })} placeholder="Company Name" className="w-full p-2 border rounded" />
        </>
      )}

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Add
      </button>
    </form>
  )
}

export default PersonForm
