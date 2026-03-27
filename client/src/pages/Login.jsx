import React, { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token to local storage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // We could save a token here in local storage if we had one
      // localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-2xl sm:p-8">
        
        <h1 className="mt-2 text-center text-2xl font-serif text-black sm:text-3xl">
          Welcome Back
        </h1>

        <p className="mt-2 text-center text-sm text-gray-600 sm:text-base">
          Enter your credentials to access your account
        </p>
        
        {error && <div className="mt-4 rounded bg-red-100 p-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mt-6">
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              className="mt-2 h-10 w-full rounded bg-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label className="font-semibold">Password</label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              minLength={6}
              maxLength={15}
              required
              className="mt-2 h-10 w-full rounded bg-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button type="submit" className="mt-6 h-10 w-full rounded-xl bg-black text-lg text-white transition hover:bg-gray-900">
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">Or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button type="button" className="flex w-full items-center justify-center gap-3 rounded-xl border py-2 hover:bg-gray-300">
            <FcGoogle size={20} />
            Google
          </button>

          <button type="button" className="flex w-full items-center justify-center gap-3 rounded-xl border py-2 hover:bg-gray-300">
            <FaGithub size={20} />
            GitHub
          </button>
        </div>

        {/* Sign Up */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?
           <Link to="/register" className="ml-2 text-blue-600 hover:underline"> Sign Up </Link>
        </div>

      </div>
    </div>
  )
}

export default Login
