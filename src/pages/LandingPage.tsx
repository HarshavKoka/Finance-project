import { useNavigate } from "react-router-dom"

function LandingPage() {
  const navigate = useNavigate()

  const roles = [
    { title: "Admin", desc: "Manage users, settings, and system-wide controls.", path: "/login/admin" },
    { title: "Manager", desc: "Oversee teams, track progress, and approve tasks.", path: "/login/manager" },
    { title: "Employee", desc: "Access your tasks, submit reports, and collaborate.", path: "/login/employee" },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full p-8">
        {roles.map((role) => (
          <div
            key={role.title}
            className=" bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center text-center hover:shadow-2xl hover:scale-105 transition transform"
          >
            <h2 className="text-2xl font-bold text-blue-700">{role.title}</h2>
            <p className="mt-4 text-gray-600">{role.desc}</p>
            <button
              onClick={() => navigate(role.path)}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition cursor-pointer"
            >
              Go ahead as {role.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LandingPage
