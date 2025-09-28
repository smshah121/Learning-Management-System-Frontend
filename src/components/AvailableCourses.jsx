import React from 'react';
import { useGetAvailableCoursesQuery } from '../features/course/courseApi';
import { useEnrollInCourseMutation } from '../features/enrollment/enrollmentApi';
import { MdOutlineLibraryAddCheck } from "react-icons/md";

const AvailableCourses = () => {
  const { data: courses = [] } = useGetAvailableCoursesQuery();
  const [enroll] = useEnrollInCourseMutation();

  const handleEnroll = async (courseId) => {
    try {
      await enroll({ courseId }).unwrap();
      alert('✅ Enrolled successfully!');
    } catch (err) {
      alert(err?.data?.message || '❌ Enrollment failed.');
    }
  };

  return (
   <div className="flex justify-center bg-gray-50 px-4 pt-10">
  <section className="max-w-3xl w-full">
    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">📖 Available Courses</h2>

    <ul className="space-y-4">
      {courses.map((course) => (
        <li
          key={course.id}
          className="bg-white border-none rounded-lg px-6 py-4 shadow-lg hover:shadow-md flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
            <p className="text-sm text-gray-600">{course.description}</p>
            {course.instructor?.name && (
               <p className="text-xs text-gray-500 mt-1">Instructor: {course.instructor.name}</p>
            )}
          </div>

          <button
            onClick={() => handleEnroll(course.id)}
            className="text-green-500 px-2 py-1 rounded hover:bg-green-700 transition"
          >
            <MdOutlineLibraryAddCheck size={24}/>
          </button>
        </li>
      ))}
    </ul>
  </section>
</div>

  );
};

export default AvailableCourses;
