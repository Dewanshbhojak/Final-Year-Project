import React, { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-2xl sm:p-8">
        <h1 className="mt-2 text-center text-2xl font-serif text-black sm:text-3xl">
          Create an account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 sm:text-base">
          Enter your information to get started
        </p>

        {error && <div className="mt-4 rounded bg-red-100 p-3 text-sm text-red-600">{error}</div>}
        {success && <div className="mt-4 rounded bg-green-100 p-3 text-sm text-green-600">{success}</div>}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mt-4">
            <label className="block font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="mt-2 h-10 w-full rounded bg-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="mt-4">
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
            <label className="block font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength={6}
              className="mt-2 h-10 w-full rounded bg-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="mt-4">
            <label className="block font-semibold">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className="mt-2 h-10 w-full rounded bg-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button type="submit" className="mt-6 h-10 w-full rounded-xl bg-black text-white transition hover:bg-gray-900">
            Create account
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

        <div className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?
          <Link to="/" className="ml-2 text-blue-600 hover:underline"> Sign In </Link>
        </div>

      </div>
    </div>
  )
}

export default Register
