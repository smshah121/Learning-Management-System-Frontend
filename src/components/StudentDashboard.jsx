import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaBookOpen, FaGraduationCap, FaChalkboardTeacher, FaBullhorn } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { TbLogout } from "react-icons/tb";

import WelcomeBanner from './WelcomeBanner';
import EnrolledCourses from './EnrolledCourses';
import AvailableCourses from './AvailableCourses';
import AllLectures from './Lecture';
import StudentAnnouncements from './Announcement';
import { clearToken } from '../features/auth/authSlice';
import { useGetMyEnrollmentsQuery } from '../features/enrollment/enrollmentApi';

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: enrollments = [], isLoading } = useGetMyEnrollmentsQuery();

  const handleLogout = () => {
    dispatch(clearToken());
    navigate('/');
  };

  // Get all enrolled course IDs safely
  const enrolledCourseIds = useMemo(
    () => enrollments?.map(e => e.course?.id).filter(Boolean) || [],
    [enrollments]
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <WelcomeBanner />

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-blue-800 to-blue-600 text-white py-3 px-6 rounded shadow">
          <div className="text-xl font-semibold">🎓 Student Information Center</div>
          <div className="space-x-4 text-sm font-medium">
            <button className="hover:underline" onClick={() => navigate('/my-profile')}>
              <CgProfile size={24} />
            </button>
            <button className="hover:underline" onClick={handleLogout}>
              <TbLogout size={24} />
            </button>
          </div>
        </div>

        {/* Icon Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
          <div
            onClick={() => setActiveSection('enrolled')}
            className="cursor-pointer flex flex-col items-center bg-white border shadow hover:shadow-md p-4 rounded-lg transition"
          >
            <FaGraduationCap size={40} className="text-blue-600 mb-2" />
            <span className="font-medium text-gray-700 text-center">Enrolled Courses</span>
          </div>

          <div
            onClick={() => setActiveSection('available')}
            className="cursor-pointer flex flex-col items-center bg-white border shadow hover:shadow-md p-4 rounded-lg transition"
          >
            <FaBookOpen size={40} className="text-green-600 mb-2" />
            <span className="font-medium text-gray-700 text-center">Available Courses</span>
          </div>

          <div
            onClick={() => setActiveSection('lectures')}
            className="cursor-pointer flex flex-col items-center bg-white border shadow hover:shadow-md p-4 rounded-lg transition"
          >
            <FaChalkboardTeacher size={40} className="text-purple-600 mb-2" />
            <span className="font-medium text-gray-700 text-center">All Lectures</span>
          </div>

          <div
            onClick={() => setActiveSection('announcements')}
            className="cursor-pointer flex flex-col items-center bg-white border shadow hover:shadow-md p-4 rounded-lg transition"
          >
            <FaBullhorn size={40} className="text-yellow-600 mb-2" />
            <span className="font-medium text-gray-700 text-center">Announcements</span>
          </div>
        </div>

        {/* Render Based on Section */}
        {activeSection === 'enrolled' && <EnrolledCourses />}
        {activeSection === 'available' && <AvailableCourses />}
        {activeSection === 'lectures' && <AllLectures />}

        {activeSection === 'announcements' && (
          isLoading ? (
            <p className="text-center text-gray-500">Loading announcements...</p>
          ) : enrolledCourseIds.length > 0 ? (
            enrolledCourseIds.map((id) => (
              <StudentAnnouncements key={id} courseId={id} />
            ))
          ) : (
            <p className="text-center text-gray-600 italic">
              You're not enrolled in any course yet. 📭
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
