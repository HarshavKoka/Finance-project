import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import google from './images/google.png';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
const storedUserJson = localStorage.getItem('userData');
const storedUser = storedUserJson ? JSON.parse(storedUserJson) : null;


    if (
      storedUser &&
      storedUser.username === username &&
      storedUser.password === password
    ) {
      navigate('/home');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center  text-blue-700">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2  rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
       <div className="flex items-center justify-center py-2">
         <span className="mx-2">or</span>
       </div>
      <button
  onClick={handleLogin}
  className="w-full bg-gray-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center py-2"
>
  <img src={google} alt="Google" className="w-5 h-5 mr-2" />
  <span>Continue with Google</span>
</button>

        Don’t have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a>
      </div>
    </div>
  );
}

export default LoginPage;
