import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import google from './images/google.png';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const navigate = useNavigate();

  const loginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });

  const handleLogin = () => {
    const result = loginSchema.safeParse({ username, password });

    if (!result.success) {
      const newErrors: { username?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === 'username') newErrors.username = issue.message;
        if (issue.path[0] === 'password') newErrors.password = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const storedUserJson = localStorage.getItem('userData');
    const storedUser = storedUserJson ? JSON.parse(storedUserJson) : null;

    if (storedUser && storedUser.username === username && storedUser.password === password) {
      navigate('/home');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center text-blue-700 ">Login</h2>

        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-gray-500 cursor-pointer"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Login
        </button>

        <div className="flex items-center justify-center py-2">
          <span className="mx-2">or</span>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-gray-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center py-2 cursor-pointer"
        >
          <img src={google} alt="Google" className="w-5 h-5 mr-2 " />
          <span>Continue with Google</span>
        </button>

        Don’t have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a>
      </div>
    </div>
  );
}

export default LoginPage;
