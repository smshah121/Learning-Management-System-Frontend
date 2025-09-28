// components/ManageEnrollments.jsx
import React, { useState } from 'react';
import { useGetMyCoursesQuery } from '../features/course/courseApi';
import { useGetStudentsByCourseQuery } from '../features/enrollment/enrollmentApi';



const ManageEnrollments = () => {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const { data: courses = [] } = useGetMyCoursesQuery();
  const {
    data: students = [],
    isLoading,
    error,
  } = useGetStudentsByCourseQuery(selectedCourseId, {
    skip: !selectedCourseId,
  });

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">🎓 Enrollments in your Course</h2>

      {/* Course Dropdown */}
      <select
        value={selectedCourseId}
        onChange={(e) => setSelectedCourseId(e.target.value)}
        className="mb-4 border p-2 rounded w-full"
      >
        <option value="">Select a course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
        ))}
      </select>

      {/* Display Students */}
      {isLoading && <p className="text-blue-600">Loading students...</p>}
      {error && <p className="text-red-600">Failed to load students.</p>}

      {students?.length > 0 ? (
        <ul className="space-y-4">
          {students.map(({ student }) => (
            <li
              key={student.id}
              className="border-none py-4 bg-gray-50 shadow-lg hover:bg-gray-100 transition"
            >
              <p className="font-semibold text-gray-800">{student.name}</p>
              <p className="text-sm text-gray-600">{student.email}</p>
              {/* You can add a "Remove" or "View Progress" button here */}
            </li>
          ))}
        </ul>
      ) : (
        selectedCourseId && <p>No students enrolled in this course.</p>
      )}
    </div>
  );
};

export default ManageEnrollments;
