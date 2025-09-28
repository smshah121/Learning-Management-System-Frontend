import React, { useState } from 'react'
import { useSignupMutation } from '../features/auth/authApi'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [role, setRole] = useState("student")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [signup, {isLoading, error}]=useSignupMutation()
    const navigate = useNavigate()
    const handleSubmit = async (e)=> {
        e.preventDefault()
        try {
            const res = await signup({name,email, password,role}).unwrap()
            localStorage.setItem("token", res.access_token)
            localStorage.setItem("role",res.role)
            localStorage.setItem("id", res.id) 
            alert("signup successfull please login")
            navigate("/")
        } catch (error) {
            console.log("signup failed", error)
        }
    }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <form onSubmit={handleSubmit} className='bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4'>
            <h2 className='text-2xl font-bold text-center'>
                Sign Up
            </h2>
            <input 
            type="text"
            placeholder='Name'
            className='w-full p-2 border rounded'
            value={name}
            onChange={(e)=> setName(e.target.value)}
            required
            />
            <input
            type="email"
            placeholder='Email'
            className='w-full p-2 border rounded'
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            required
             />
             <input type="password"
             placeholder='Password'
             className='w-full p-2 border rounded'
             value={password}
             onChange={(e)=> setPassword(e.target.value)}
             required
             />

             <select
             className='w-full p-2 border rounded'
             value={role}
             onChange={(e)=> setRole(e.target.value)}
             required
             >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>

             </select>
             <button
             type='submit'
             disabled={isLoading}
             className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50'
             >
                {isLoading ? "Signing up...": "Sign Up"}
             </button>

             {error && <p className='text-red-600 text-sm'>Signup failed. Try again</p>}
        </form>
    </div>
  )
}

export default Signup