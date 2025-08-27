import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()
  const blocks = ["IncomeTax", "GST", "MCA"]

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        {blocks.map((label) => (
          <div
            key={label}
            onClick={() => navigate(`/people?group=${label}`)}
            className="cursor-pointer bg-white shadow-lg rounded-xl p-10 text-center text-xl font-semibold hover:bg-blue-100 transition"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
