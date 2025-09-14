import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import toast, { Toaster } from "react-hot-toast"
import { v4 as uuidv4 } from "uuid"
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

interface User {
  id: string
  username: string
  email: string
  password: string
  role: "manager" | "employee"
}

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z
       .string()
       .min(8, "Password must be at least 8 characters")
       .regex(/[A-Z]/, "Must contain at least one uppercase letter")
       .regex(/[a-z]/, "Must contain at least one lowercase letter")
       .regex(/[0-9]/, "Must contain at least one number")
       .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
   })

type UserForm = z.infer<typeof userSchema>

const getManagers = (): User[] => {
  const data = localStorage.getItem("managers")
  return data ? JSON.parse(data) : []
}

const getEmployees = (): User[] => {
  const data = localStorage.getItem("employees")
  return data ? JSON.parse(data) : []
}

const AdminHome = () => {
  const queryClient = useQueryClient()
  const [editingManager, setEditingManager] = useState<User | null>(null)
  const [showManagers, setShowManagers] = useState(false)
  const [showEmployees, setShowEmployees] = useState(false)
  const [showAdminFeatures, setShowAdminFeatures] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const adminFeaturesRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
  })

  const { data: managers = [] } = useQuery({
    queryKey: ["managers"],
    queryFn: () => getManagers(),
  })

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => getEmployees(),
  })

  const saveManagersMutation = useMutation({
    mutationFn: async (newData: User[]) => {
      localStorage.setItem("managers", JSON.stringify(newData))
      return Promise.resolve(newData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] })
    },
  })

  const saveEmployeesMutation = useMutation({
    mutationFn: async (newData: User[]) => {
      localStorage.setItem("employees", JSON.stringify(newData))
      return Promise.resolve(newData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
    },
  })

  window.addEventListener("storage", e => {
    if (e.key === "managers") queryClient.invalidateQueries({ queryKey: ["managers"] })
    if (e.key === "employees") queryClient.invalidateQueries({ queryKey: ["employees"] })
  })

  const addOrUpdateManager = (data: UserForm) => {
    let updatedList: User[]
    if (editingManager) {
      updatedList = managers.map(m =>
        m.id === editingManager.id ? { ...m, ...data } : m
      )
      toast.success("Manager updated successfully")
      setEditingManager(null)
      reset({ username: "", email: "", password: "" })
    } else {
      const newManager: User = { id: uuidv4(), role: "manager", ...data }
      updatedList = [...managers, newManager]
      toast.success("Manager added successfully")
      reset()
    }
    saveManagersMutation.mutate(updatedList)
  }

  const editManager = (manager: User) => {
    setEditingManager(manager)
    reset({
      username: manager.username,
      email: manager.email,
      password: manager.password,
    })
  }

  const deleteManager = (manager: User) => {
    const updatedList = managers.filter(m => m.id !== manager.id)
    saveManagersMutation.mutate(updatedList)
    toast.success("Manager deleted")
  }

  const deleteEmployee = (employee: User) => {
    const updatedList = employees.filter(e => e.id !== employee.id)
    saveEmployeesMutation.mutate(updatedList)
    toast.success("Employee deleted")
  }

  const promoteEmployee = (id: string) => {
    const employee = employees.find(e => e.id === id)
    if (!employee) return
    const updatedEmployees = employees.filter(e => e.id !== id)
    const updatedManagers: User[] = [
      ...managers,
      { ...employee, role: "manager" as const },
    ]
    saveEmployeesMutation.mutate(updatedEmployees)
    saveManagersMutation.mutate(updatedManagers)
    toast.success("Employee promoted to manager")
  }

  return (
    <div className="p-8 space-y-6 relative">
      <Toaster position="top-right" />

      <button
        className="absolute top-30 right-7 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        onClick={() => setShowAdminFeatures(!showAdminFeatures)}
      >
        Admin Features
      </button>

      {showAdminFeatures && (
        <div
          ref={adminFeaturesRef}
          className="absolute top-40 right-30 bg-white p-4 rounded shadow-md w-96 "
        >
          <p>
            This section contains admin-related features such as managing
            managers and viewing employees. You can add, edit, or delete managers
            and view/delete employees in real-time. Employees list updates
            automatically across multiple tabs.
          </p>
        </div>
      )}
  <div className="mt-3 flex items-center justify-center">
          
         <span className="text-3xl font-extrabold text-blue-700 tracking-wide drop-shadow-lg">
            Admin Dashboard
          </span>
        </div>
      <form
        onSubmit={handleSubmit(addOrUpdateManager)}
        className="bg-white p-6 rounded shadow-md space-y-4 max-w-md"
      >
        <h1 className="text-2xl font-bold text-blue-700">
          {editingManager ? "Edit Manager" : "Add Manager"}
        </h1>
        <div>
          <label className="block font-semibold">Username</label>
          <input
            type="text"
            {...register("username")}
            className="border p-2 rounded w-full"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            {...register("email")}
            className="border p-2 rounded w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold">Password</label>
          <div className="flex">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="border p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 bg-gray-300 px-2 rounded cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingManager ? "Update Manager" : "Add Manager"}
        </button>
      </form>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow-md">
          <h2
            className="text-xl font-semibold mb-4 cursor-pointer"
            onClick={() => {
              setShowManagers(!showManagers)
              if (!showManagers) setShowEmployees(false)
            }}
          >
            Managers ({managers.length})
          </h2>
          {showManagers && (
            <ul className="space-y-2">
              {managers.map(m => (
                <li key={m.id} className="flex justify-between items-center">
                  <span>
                    {m.username} - {m.email}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => editManager(m)}
                      className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteManager(m)}
                      className="bg-red-600 px-2 py-1 rounded text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded shadow-md">
          <h2
            className="text-xl font-semibold mb-4 cursor-pointer"
            onClick={() => {
              setShowEmployees(!showEmployees)
              if (!showEmployees) setShowManagers(false)
            }}
          >
            Employees ({employees.length})
          </h2>
          {showEmployees && (
            <ul className="space-y-2">
              {employees.map(e => (
                <li key={e.id} className="flex justify-between items-center">
                  <span>
                    {e.username} - {e.email}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => promoteEmployee(e.id)}
                      className="bg-green-500 px-2 py-1 rounded text-white hover:bg-green-600"
                    >
                      Promote
                    </button>
                    <button
                      onClick={() => deleteEmployee(e)}
                      className="bg-red-600 px-2 py-1 rounded text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminHome />
    </QueryClientProvider>
  )
}
