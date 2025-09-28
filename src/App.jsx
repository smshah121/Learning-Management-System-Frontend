import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./components/Dashboard"
import StudentDashboard from "./components/StudentDashboard"
import InstructorDashboard from "./components/InstructorDashboard"
import MyProfile from "./components/MyProfile"


function App() {
  

  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/student-dashboard" element={<StudentDashboard/>}/>
      <Route path="/instructor-dashboard" element={<InstructorDashboard/>}/>
      <Route path="my-profile" element={<MyProfile/>}/>
      
    </Routes>

  )
}

export default App
