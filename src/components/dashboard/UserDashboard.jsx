import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuthContext } from '../auth/AuthProvider';
import { SocietyList } from './SocietyList';
import { Sidebar } from './Sidebar';
import { FollowedSocietyPosts } from '../society/FollowedSocietyPosts';
import { Button } from '../ui/Button';




export function UserDashboard() {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user && !loading){
      navigate('/auth-screen');
    }
  }, [user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#49494b] z-0">
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar - hidden on mobile, shown on larger screens */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl text-white font-bold mb-6">Welcome, {user.displayName}</h1>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Society List */}
            <div className="col-span-1">
              <div className="bg-[#1A1A1D] rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold mb-4 text-white">Your Societies</h2>
                <SocietyList />
              </div>
            </div>

            {/* Society Posts */}
            <div className="col-span-1">
              <div className="bg-[#1A1A1D] rounded-lg shadow p-4">
                <FollowedSocietyPosts/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

