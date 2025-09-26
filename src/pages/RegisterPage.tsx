import { useState } from "react"
import { z } from "zod"

type User = {
  username: string
  email: string
  password: string
  role: "employee"
}

function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({})

  const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  })

  const handleRegister = () => {
    const result = registerSchema.safeParse({ username, email, password })

    if (!result.success) {
      const newErrors: { username?: string; email?: string; password?: string } = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === "username") newErrors.username = issue.message
        if (issue.path[0] === "email") newErrors.email = issue.message
        if (issue.path[0] === "password") newErrors.password = issue.message
      })
      setErrors(newErrors)
      return
    }

    setErrors({})

    const user: User = { username, email, password, role: "employee" }
    const storedEmployees: User[] = JSON.parse(localStorage.getItem("employees") || "[]")

    storedEmployees.push(user)
    localStorage.setItem("employees", JSON.stringify(storedEmployees))

    alert("Employee registration successful!")
    setUsername("")
    setEmail("")
    setPassword("")
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center text-blue-700">Employee Registration</h2>

        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login/employee" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
