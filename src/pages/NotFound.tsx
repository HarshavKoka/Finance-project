import { useNavigate } from "react-router-dom"

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Page Not Found
      </h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for doesn’t exist or has been moved. Click the button below to go back to the homepage.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 cursor-pointer"
      >
        Back to Home
      </button>
    </div>
  )
}

export default NotFound
