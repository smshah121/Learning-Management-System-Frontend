import React from 'react';
import { useGetMyEnrollmentsQuery } from '../features/enrollment/enrollmentApi';
import { useGetLecturesByCourseQuery } from '../features/lectures/lecturesApi';
import { FaBook, FaSyncAlt, FaFileAlt } from 'react-icons/fa';

const AllLectures = () => {
  const { data: enrollments = [] } = useGetMyEnrollmentsQuery();

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-2">
        <FaBook className="text-blue-600" /> All Lectures by Course
      </h2>

      {enrollments.length === 0 ? (
        <p className="text-gray-600 italic">You are not enrolled in any courses.</p>
      ) : (
        <div className="space-y-6">
          {enrollments.map((enr) => (
            <CourseLectures key={enr.course.id} course={enr.course} />
          ))}
        </div>
      )}
    </section>
  );
};

const CourseLectures = ({ course }) => {
  const {
    data: lectures = [],
    isLoading,
    error,
    refetch,
  } = useGetLecturesByCourseQuery(course.id, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
        <button
          onClick={refetch}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded shadow transition"
        >
          <FaSyncAlt />
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500 animate-pulse">Loading lectures...</p>
      ) : error ? (
        <p className="text-red-600 font-medium">❌ Failed to load lectures.</p>
      ) : lectures.length === 0 ? (
        <p className="text-gray-500 italic">No lectures available for this course.</p>
      ) : (
        <ul className="space-y-4">
          {lectures.map((lec, idx) => (
            <li
              key={lec.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-lg hover:shadow transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800 text-lg">
                  {idx + 1}. {lec.title}
                </h4>
                <span className="text-xs text-gray-500">ID: {lec.id}</span>
              </div>

              {/* Lecture Docs */}
              {lec.docs && lec.docs.length > 0 ? (
                <ul className="ml-4 list-disc text-blue-700 text-sm mt-2">
                  {lec.docs.map((docUrl, index) => {
                    const fileName = docUrl.split('/').pop();
                    return (
                      <li key={index}>
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1"
                          title={fileName}
                          
                        >
                          <FaFileAlt className="text-blue-500" />
                          Lecture Link
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm italic">No documents uploaded.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllLectures;
