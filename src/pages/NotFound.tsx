
import { useNavigate } from 'react-router-dom'  

const NotFound = () => {
  const navigate = useNavigate()
  return (<><p>Not Found</p>    
   <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Back to Home
        </button></>)
}

export default NotFound