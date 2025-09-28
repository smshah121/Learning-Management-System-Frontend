import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../features/auth/authSlice'

const Dashboard = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = ()=> {
        localStorage.removeItem("token")
        dispatch(setToken(null))
        navigate("/")
        


    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>
        <p className="text-gray-600">You have successfully logged in!</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Dashboard