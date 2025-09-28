import React, { useState } from 'react';
import { useGetMyCoursesQuery } from '../features/course/courseApi';
import { useCreateAnnouncementMutation, useDeleteAnnouncementMutation, useGetAnnouncementsByCourseQuery } from '../features/announcement/announcementApi';
import { MdDelete  } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
const InstructorAnnouncement = () => {
  const { data: courses = [] } = useGetMyCoursesQuery();
  const [courseId, setCourseId] = useState('');
  const [message, setMessage] = useState('');
  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [deleteAnnouncement]= useDeleteAnnouncementMutation()
  const {
    data: announcements = [],
    isLoading,
    refetch,
  } = useGetAnnouncementsByCourseQuery(courseId, {
    skip: !courseId,
  });

  const handleDelete = async (id)=> {
    const confirm = window.confirm("are you sure you want to delete Announcement?")
    if(!confirm) return
    try {
        await deleteAnnouncement(id).unwrap()
        alert("announcement deketed")
    } catch(err) {
        console.log(err)
        alert("failed to delete")
    }

    
  }

  const handlePost = async () => {
    if (!courseId || !message.trim()) {
      return alert('Please select a course and write a message.');
    }

    try {
      await createAnnouncement({ message, courseId: Number(courseId) });
      alert('✅ Announcement posted!');
      setMessage('');
      refetch();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to post announcement.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">📢 Post Course Announcement</h2>

      <select
        value={courseId}
        onChange={(e) => setCourseId(Number(e.target.value))}
        className="w-full mb-3 px-2 py-2 bg-transparent border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-all duration-200"
      >
        <option value="">Select Course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
        ))}
      </select>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder="Write your announcement..."
        className="w-full mb-3 px-2 py-2 bg-transparent border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-all duration-200"
      ></textarea>

      <button
        onClick={handlePost}
        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
      >
        <IoMdAdd/>
      </button>

      {courseId && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">📄 Announcements</h3>
          {isLoading ? (
            <p>Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p className="text-gray-500 italic">No announcements yet.</p>
          ) : (
            <ul className="space-y-3">
              {announcements.map((a, index) => (
                <li key={index} className="border-none py-4 w-full  shadow-lg bg-gray-50 hover:bg-gray-100 transition flex justify-between">
                  📌 {a.message}
                  <button className='text-red-500 px-2 py-1 rounded hover:bg-red-600 transition mt-3' onClick={()=> handleDelete(a.id)}><MdDelete size={24}/></button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default InstructorAnnouncement;
