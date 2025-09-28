import React from 'react';
import { FaBullhorn } from 'react-icons/fa';
import { useGetAnnouncementsByCourseQuery } from '../features/announcement/announcementApi';

const StudentAnnouncements = ({ courseId }) => {
  if (!courseId) return null; 
  const {
    data: announcements = [],
    isLoading,
    isError,
  } = useGetAnnouncementsByCourseQuery(courseId, {
    skip: !courseId,
  });

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-yellow-800 flex items-center gap-2">
        <FaBullhorn className="text-yellow-600" /> Announcements
      </h2>

      <div className="bg-white border border-yellow-200 shadow-md rounded-lg p-6 space-y-4">
        {isLoading ? (
          <p className="text-yellow-600">Loading announcements...</p>
        ) : isError ? (
          <p className="text-red-600">Failed to load announcements.</p>
        ) : announcements.length === 0 ? (
          <p className="text-gray-500 italic">No announcements for this course.</p>
        ) : (
          announcements.map((a) => (
            <div
              key={a.id}
              className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded text-yellow-800 shadow-sm"
            >
              <p className="font-bold text-base">📘 {a.course?.title}</p>

              📌 {a.message}
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default StudentAnnouncements;
