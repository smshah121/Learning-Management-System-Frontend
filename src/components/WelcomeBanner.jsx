import React from 'react';
import { useGetCurrentUserQuery } from '../features/user/userApi';

const WelcomeBanner = () => {
  const { data: user, isLoading } = useGetCurrentUserQuery();

  if (isLoading) return null;
  const role = user?.role || "User"

  return (
    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded shadow">
      <p className="font-semibold text-lg">
        👋 Welcome back, {user?.name || 'User'}!
      </p>
      <p className="text-sm">Here’s your {role.toLowerCase()} dashboard overview.</p>
    </div>
  );
};

export default WelcomeBanner;
