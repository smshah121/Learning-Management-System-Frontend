import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentUserQuery, useUpdateUserMutation } from '../features/user/userApi';

const MyProfile = () => {
  const navigate = useNavigate();

  const { data: user, isLoading, error, refetch } = useGetCurrentUserQuery(undefined, {
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  const [updateUser] = useUpdateUserMutation();
  const [password, setPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);


  const getDashboardPath = () => {
    if (user?.role === 'student') return '/student-dashboard';
    if (user?.role === 'instructor') return '/instructor-dashboard';
    return '/'; // fallback
  };





  const handleChangePassword = async () => {
    try {
      await updateUser({ id: user.id, password }).unwrap();
      alert('✅ Password updated successfully');
      setPassword('');
      setShowPasswordForm(false);
    } catch (err) {
      alert('❌ Failed to update password');
    }
  };

  if (isLoading) return <p className="p-4">Loading profile...</p>;
  if (error) return <p className="p-4 text-red-500">Failed to load profile.</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      {/* Back Button */}
      <button
        onClick={() => navigate(getDashboardPath())}
        className="mb-4 text-blue-600 hover:underline text-sm"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-2xl font-semibold mb-4">👤 My Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>ID:</strong> {user.id}</p>

      <div className="mt-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          {showPasswordForm ? 'Cancel' : 'Change Password'}
        </button>

        {showPasswordForm && (
          <div className="mt-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="border p-2 rounded w-full mb-2"
            />
            <button
              onClick={handleChangePassword}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Update Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
