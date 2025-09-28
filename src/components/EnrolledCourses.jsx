import React, { useState } from 'react';
import {
  useGetMyEnrollmentsQuery,
  useRemoveEnrollmentMutation,
} from '../features/enrollment/enrollmentApi';
import { MdDelete  } from 'react-icons/md';
const EnrolledCourses = () => {
  const { data: enrolledCourses = [], isLoading, refetch } = useGetMyEnrollmentsQuery();
  const [removeEnrollment] = useRemoveEnrollmentMutation();
  const [removingId, setRemovingId] = useState(null)
  const handleRemove = async (enrollmentId)=> {
    const confirm = window.confirm("are you sure you want to remove this course?")
    if(!confirm) return

    try {
      setRemovingId(enrollmentId)
      await removeEnrollment(enrollmentId).unwrap()
      refetch()
    } catch (err){
      alert("failed to remove enrollment")
    } finally {
      setRemovingId(null)
    }
  }
  if (isLoading) return <p>Loading enrolled courses...</p>;

  return (
    <div className="flex justify-center bg-gray-50 px-4 pt-10">
  <section className="max-w-3xl w-full">
    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">📘 My Enrolled Courses</h2>

    <div className="min-h-[200px] transition-all duration-300">
      {enrolledCourses.length === 0 ? (
        <p className="text-center text-gray-500">You are not enrolled in any courses yet.</p>
      ) : (
        <ul className="space-y-4">
          {enrolledCourses.map((enrollment) => (
            <li
              key={enrollment.id}
              className="bg-white border-none rounded-lg px-6 py-4 shadow-lg hover:shadow-md flex justify-between items-center"
            >
              <div>
                <div className="text-lg font-semibold text-gray-800">
                  {enrollment.course.title}
                </div>
                <p className="text-sm text-gray-600">{enrollment.course.description}</p>
                <p className="text-xs text-gray-500 mt-1"> Instructor: {enrollment.course.instructor?.name}</p>

              </div>
              <button
                onClick={() => handleRemove(enrollment.id)}
                className="text-red-600 px-2 py-1 hover:bg-red-600 rounded transition"
              >
                <MdDelete size={24} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  </section>
</div>


  );
};

export default EnrolledCourses;
