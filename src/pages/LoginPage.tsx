import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { z } from "zod"
import google from "./images/google.png"

type User = {
  id: string
  username: string
  email: string
  password: string
  role: "manager" | "employee"
}

function LoginPage() {
  const { role } = useParams<{ role?: string }>()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})
  const navigate = useNavigate()

  const loginSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  })

  const handleLogin = () => {
    if (!role) {
      alert("Role not specified")
      return
    }

    const result = loginSchema.safeParse({ username, password })
    if (!result.success) {
      const newErrors: { username?: string; password?: string } = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === "username") newErrors.username = issue.message
        if (issue.path[0] === "password") newErrors.password = issue.message
      })
      setErrors(newErrors)
      return
    }

    setErrors({})

    const loginRoles = ["admin", "manager", "employee"]
    if (!loginRoles.includes(role)) {
      alert("Invalid role")
      return
    }

    // --- Admin login from ENV only ---
    if (role === "admin") {
      const adminUsername = import.meta.env.VITE_ADMIN_USERNAME
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

      if (username === adminUsername && password === adminPassword) {
        navigate("/admin-home")
      } else {
        alert("Invalid admin credentials")
      }
      return
    }

    // --- Manager / Employee login from localStorage ---
    const storageKey = role === "manager" ? "managers" : "employees"
    const storedUsers: User[] = JSON.parse(localStorage.getItem(storageKey) || "[]")

    const user = storedUsers.find(
      (u) =>
        u.username.trim().toLowerCase() === username.trim().toLowerCase() &&
        u.password === password
    )

    if (user) {
      navigate(role === "manager" ? "/manager-home" : "/employee-home")
    } else {
      alert(`Invalid ${role} credentials`)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center text-blue-700">
          {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Login` : "Login"}
        </h2>

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

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-gray-500 cursor-pointer text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Login
        </button>

        <div className="flex items-center justify-center py-2 text-gray-500">or</div>

        <button
          onClick={handleLogin}
          className="w-full bg-gray-100 border rounded-lg hover:bg-gray-200 transition flex items-center justify-center py-2 cursor-pointer"
        >
          <img src={google} alt="Google" className="w-5 h-5 mr-2" />
          <span className="text-gray-700">Continue with Google</span>
        </button>

        {role === "employee" && (
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
        )}
      </div>
    </div>
  )
}

export default LoginPage
