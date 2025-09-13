import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const baseSchema = z.object({
  name: z.string().min(3, "Name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  city: z.string().min(3, "City is required"),
  email: z.string().email({ message: "Invalid email" }),
  phoneNumber:z.string()
  .transform((s) => s.replace(/\D/g, ""))
  .refine((s) => /^[6-9]\d{9}$/.test(s), { message: "Invalid mobile number" }),
  idNumber: z.string().min(1, "ID number is required"),
  username: z.string().optional(),
  password: z.string().optional(),
})

const incomeTaxSchema = baseSchema.extend({
  panName: z.string().min(4, "PAN Name is required"),
  panNumber: z.string()
  .transform((s) => s.toUpperCase())
  .refine((s) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(s), { message: "Invalid PAN" }),
  itrLast3Years: z.string().optional(),
})

const gstSchema = baseSchema.extend({
  gstNumber: z.string().min(1, "GST Number is required"),
  businessName: z.string().min(1, "Business Name is required"),
})

const mcaSchema = baseSchema.extend({
  cinNumber: z.string().optional(),
  companyName: z.string().optional(),
})

type IncomeTaxForm = z.infer<typeof incomeTaxSchema>
type GSTForm = z.infer<typeof gstSchema>
type MCAForm = z.infer<typeof mcaSchema>

interface PersonFormProps {
  onAdd: (data: IncomeTaxForm | GSTForm | MCAForm) => void
  group: "IncomeTax" | "GST" | "MCA"
}

const PersonForm = ({ onAdd, group }: PersonFormProps) => {
  const schema =
    group === "IncomeTax"
      ? incomeTaxSchema
      : group === "GST"
      ? gstSchema
      : mcaSchema

  type SchemaType = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: SchemaType) => {
    onAdd(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4rounded bg-gray-50">
      
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input {...register("name")} className="border rounded px-2 py-1 w-lg" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Date of Birth</label>
        <input type="date" {...register("dob")} className="border rounded px-2 py-1 w-lg" />
        {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">City</label>
        <input {...register("city")} className="border rounded px-2 py-1 w-lg" />
        {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" {...register("email")} className="border rounded px-2 py-1 w-lg" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Phone Number</label>
        <input {...register("phoneNumber")} className="border rounded px-2 py-1 w-lg" />
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">ID Number</label>
        <input {...register("idNumber")} className="border rounded px-2 py-1 w-lg" />
        {errors.idNumber && <p className="text-red-500 text-sm">{errors.idNumber.message}</p>}
      </div>

      
      {group === "IncomeTax" && (
        <>
          <div>
            <label className="block text-sm font-medium">PAN Name</label>
            <input {...register("panName")} className="border rounded px-2 py-1 w-lg" />
            {"panName" in errors && (
              <p className="text-red-500 text-sm">{errors.panName?.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">PAN Number</label>
            <input {...register("panNumber")} className="border rounded px-2 py-1 w-lg" />
            {"panNumber" in errors && (
              <p className="text-red-500 text-sm">{errors.panNumber?.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">ITR Last 3 Years</label>
            <input {...register("itrLast3Years")} className="border rounded px-2 py-1 w-lg" />
            {"itrLast3Years" in errors && (
              <p className="text-red-500 text-sm">{errors.itrLast3Years?.message}</p>
            )}
          </div>
        </>
      )}

      {group === "GST" && (
        <>
          <div>
            <label className="block text-sm font-medium">GST Number</label>
            <input {...register("gstNumber")} className="border rounded px-2 py-1 w-lg" />
            {"gstNumber" in errors && (
              <p className="text-red-500 text-sm">{errors.gstNumber?.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Business Name</label>
            <input {...register("businessName")} className="border rounded px-2 py-1 w-lg" />
            {"businessName" in errors && (
              <p className="text-red-500 text-sm">{errors.businessName?.message}</p>
            )}
          </div>
        </>
      )}

      {group === "MCA" && (
        <>
          <div>
            <label className="block text-sm font-medium">CIN Number</label>
            <input {...register("cinNumber")} className="border rounded px-2 py-1 w-lg" />
            {"cinNumber" in errors && (
              <p className="text-red-500 text-sm">{errors.cinNumber?.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Company Name</label>
            <input {...register("companyName")} className="border rounded px-2 py-1 w-lg" />
            {"companyName" in errors && (
              <p className="text-red-500 text-sm">{errors.companyName?.message}</p>
            )}
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium">Username</label>
        <input {...register("username")} className="border rounded px-2 py-1 w-lg" />
        {"username" in errors && (
          <p className="text-red-500 text-sm">{errors.username?.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input type="password" {...register("password")} className="border rounded px-2 py-1 w-lg" />
        {"password" in errors && (
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        )}
      </div>

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
        Add Person
      </button>
    </form>
  )
}

export default PersonForm
