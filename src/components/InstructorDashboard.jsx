import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdDelete, MdCreateNewFolder  } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import { IoCreateSharp } from "react-icons/io5";
import { GrLogout } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { TbLogout } from "react-icons/tb";
import {FaFileAlt} from "react-icons/fa"

import {
  useGetMyCoursesQuery,
  useCreateCourseMutation,
  useDeleteCourseMutation,
  courseApi,
} from '../features/course/courseApi';
import {
  useAddLectureMutation,
  useGetLecturesByCourseQuery,
  useDeleteLectureMutation,
} from '../features/lectures/lecturesApi';

import { clearToken } from '../features/auth/authSlice';
import { skipToken } from '@reduxjs/toolkit/query';
import WelcomeBanner from './WelcomeBanner';
import ManageEnrollments from './ManageEnrollment';
import MyProfile from './MyProfile';
import InstructorAnnouncement from './AnnouncementInstructor';

const InstructorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  
  const token = localStorage.getItem("token");

useEffect(() => {
  if (!token) {
    navigate('/');
  }
}, [token, navigate]);

if (!token) return null; 


  const { data: courses = [], refetch: refetchCourses } = useGetMyCoursesQuery(undefined,{skip: !token});
  const [createCourse] = useCreateCourseMutation();
  const [addLecture] = useAddLectureMutation();
  const [deleteLecture] = useDeleteLectureMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const [docs, setDocs] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lectureTitle, setLectureTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const {
    data: lectures = [],
    isLoading,
    refetch: refetchLectures,
    error,
  } = useGetLecturesByCourseQuery(
    selectedCourseId ? Number(selectedCourseId) : skipToken
  );

  const handleLogout = () => {
    dispatch(clearToken());
    dispatch(courseApi.util.resetApiState())
    navigate('/');
  };

  const handleCourseCreate = async () => {
    if (!title || !description) return alert('All fields are required');
    try {
      await createCourse({ title, description }).unwrap();
      alert('✅ Course created');
      setTitle('');
      setDescription('');
      refetchCourses()
    } catch {
      alert('❌ Failed to create course');
    }
  };

  const handleAddLecture = async () => {
    if (!lectureTitle || !selectedCourseId)
      return alert('All fields are required');

    const formData = new FormData();
    formData.append('title', lectureTitle);
    formData.append('courseId', Number(selectedCourseId));

    docs.forEach((file) => {
      formData.append('docs', file);
    });

    try {
      await axios.post('http://localhost:3000/lectures', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('✅ Lecture added with docs');
      setLectureTitle('');
      setDocs([]);
      refetchLectures();
    } catch (error) {
      console.error(error);
      alert('❌ Failed to add lecture');
    }
  };

  const handleRemoveLecture = async ({ id, courseId }) => {
    const confirm = window.confirm('Are you sure you want to delete this lecture?');
    if (!confirm) return;
    try {
      await deleteLecture({ id, courseId }).unwrap();
      alert('Lecture deleted');
      refetchLectures();
    } catch (err) {
      console.log(err);
      alert('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <WelcomeBanner />
        <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-blue-800 to-blue-600 text-white py-3 px-6 rounded shadow">
          <div className="text-xl font-semibold">🎓 Instructor Control Panel</div>
          <div className="space-x-4 text-sm font-medium">
            <button className="hover:underline" onClick={() => navigate('/my-profile')}>
              <CgProfile size={24}/>
            </button>
            <button className="hover:underline" onClick={handleLogout}>
              <TbLogout size={24}/>
            </button>
          </div>
        </div>

        {/* Create Course */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📚 Create a New Course</h2>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 px-2 py-2 bg-transparent border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-all duration-200"
            placeholder="Course Title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-3 px-2 py-2 bg-transparent border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-all duration-200"
            placeholder="Course Description"
          />
          <button
            onClick={handleCourseCreate}
            className="text-green-500 hover:bg-green-600 px-2 py-1 rounded"
          >
            <IoCreateSharp size={30} />
          </button>
        </div>

        {/* My Courses */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">🗂 My Courses</h2>
          {courses.length === 0 ? (
            <p className="text-gray-600 italic">You haven't created any courses yet.</p>
          ) : (
            <ul className="space-y-4">
              {courses.map((course) => (
                <li
                  key={course.id}
                  className="flex justify-between items-center border-none shadow-lg py-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div>
                    <h3 className="text-lg ml-2 font-medium text-gray-800">{course.title}</h3>
                    <p className="text-sm ml-2 text-gray-500 mt-1">{course.description}</p>
                  </div>
                  <button
                    onClick={async () => {
                      const confirm = window.confirm(`Are you sure you want to delete "${course.title}"?`);
                      if (!confirm) return;
                      try {
                        await deleteCourse(course.id).unwrap();
                        alert("✅ Course deleted");
                      } catch (err) {
                        alert("❌ Failed to delete course");
                      }
                    }}
                    className="text-red-500 px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    <MdDelete size={24} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Lecture */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <MdCreateNewFolder /> Add New Lecture – Select a Course
          </h2>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full mb-3 px-2 py-2 bg-transparent border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-all duration-200"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                  {course.title}                
              </option>
            ))}
          </select>
          <input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            className="w-full mb-3 px-2 py-2 bg-transparent border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-all duration-200"
            placeholder="Lecture Title"
          />
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📎 Upload Lecture Docs (PDF/DOC)
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={(e) => setDocs([...e.target.files])}
              className="block w-full text-sm text-gray-700 shadow-lg hover:bg-gray-300 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 rounded-lg bg-white px-2 py-1"
            />
            {docs.length > 0 && (
              <ul className="text-sm text-gray-600 mt-2">
                {docs.map((file, idx) => (
                  <li key={idx}>📄 {file.name}</li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={handleAddLecture}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
          >
            <IoMdAdd />
          </button>
        </div>

        {/* Lectures in Selected Course */}
        {selectedCourseId && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">🎓 Lectures in Selected Course</h2>
            {isLoading ? (
              <p className="text-blue-600">⏳ Loading lectures...</p>
            ) : error ? (
              <p className="text-red-600">❌ Error loading lectures</p>
            ) : lectures.length === 0 ? (
              <p className="text-gray-600">No lectures found.</p>
            ) : (
              <ul className="space-y-4">
                {lectures.map((lec) => (
                  <li
                    key={lec.id}
                    className="border-none py-4 w-full  shadow-lg bg-gray-50 hover:bg-gray-100 transition flex justify-between"
                  >
                    <div>
                      <div className="font-semibold ml-2 text-lg text-gray-800">{lec.title}</div>
                      {lec.docs && lec.docs.length > 0 ? (
                        <ul className="mt-2 ml-6 list-disc text-sm text-blue-600 ">
                          {lec.docs.map((docUrl, index) => {
                            const fileName = docUrl.split('/').pop();
                            return (
                              <li key={index}>
                                <a
                                  href={`http://localhost:3000${docUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline flex items-center gap-1"
                                  title={fileName}
                                >
                                  <FaFileAlt/> Lecture Link
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1">📁 No documents attached</p>
                      )}
                    </div>
                    <div>
                      <button
                        className="text-red-500 px-2 py-1 rounded hover:bg-red-600 transition mt-3"
                        onClick={() => handleRemoveLecture({ id: lec.id, courseId: selectedCourseId })}
                      >
                        <MdDelete size={24} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <InstructorAnnouncement/>

        {/* Manage Enrollments */}
        <ManageEnrollments />

        
      </div>
    </div>
  );
};

export default InstructorDashboard;
