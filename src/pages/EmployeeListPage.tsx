import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

export interface Employee {
  name: string
  dob: string
  city: string
  email: string
  phoneNumber: string
  idNumber: string
  companyName?: string
  username?: string
}

const EmployeeListPage = () => {
  const navigate = useNavigate()
  const LOCAL_KEY = "people_data_Employees"

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const stored = localStorage.getItem(LOCAL_KEY)
      return stored ? JSON.parse(stored) : []
    },
  })

  return (
    <div className="min-h-screen bg-gray-100 p-7">
      <button
        onClick={() => navigate("/manager-home")}
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
      >
        Back to Manager Home
      </button>

      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        Employees List
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp, idx) => (
          <div
            key={idx}
            className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {emp.name}
            </h2>
            <p className="text-gray-600">
              <span className="font-medium">DOB:</span> {emp.dob}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">City:</span> {emp.city}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {emp.email}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Phone:</span> {emp.phoneNumber}
            </p>
            {emp.companyName && (
              <p className="text-gray-600">
                <span className="font-medium">Company:</span> {emp.companyName}
              </p>
            )}
            {emp.username && (
              <p className="text-gray-600">
                <span className="font-medium">Username:</span> {emp.username}
              </p>
            )}
          </div>
        ))}
        {employees.length === 0 && (
          <p className="col-span-full text-center text-gray-500 mt-6">
            No employees found.
          </p>
        )}
      </div>
    </div>
  )
}

export default EmployeeListPage
