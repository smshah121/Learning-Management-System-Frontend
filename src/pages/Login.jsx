import React, { useState } from 'react';
import { useLoginMutation } from '../features/auth/authApi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../features/auth/authSlice';
import { userApi } from '../features/user/userApi';
import { FaBookReader } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setToken(res.access_token, res.role));
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('role', res.role);
      dispatch(userApi.util.invalidateTags(['CurrentUser']));
      if (res.role === 'student') navigate('/student-dashboard');
      else if (res.role === 'instructor') navigate('/instructor-dashboard');
      else navigate('/dashboard');
    } catch (error) {
      console.log('login failed', error);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LMS Banner Section */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-10">
        <div className="text-center max-w-md">
          <FaBookReader size={60} className="mb-6 mx-auto" />
          <h1 className="text-4xl font-extrabold mb-4 leading-snug">Welcome to LMS</h1>
          <p className="text-lg text-blue-100">
            Manage your courses, track lectures, and empower learning — all in one place.
          </p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex items-center justify-center bg-gray-100 p-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Sign In</h2>
            <p className="mt-2 text-sm text-gray-600">Access your account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 text-sm rounded-md border border-red-300">
                Login failed. Please check your credentials and try again.
              </div>
            )}
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
