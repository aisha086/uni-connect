import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircleIcon, ClockIcon, UserGroupIcon, ArrowRightStartOnRectangleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuthContext } from '../auth/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { DeactivateAccount } from '../auth/DeactivateAccount';

export function Sidebar() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
    <div className="w-64 h-screen bg-[#1A1A1D] text-white fixed left-0 top-0 p-4">
      {/* Profile Section */}
      <div className="mb-8 p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="truncate">
            <p className="font-medium">{user?.email || 'User'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2">
        <Link
          to="/create-society"
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <PlusCircleIcon className="w-6 h-6" />
          <span>Create Society</span>
        </Link>

        <Link
          to="/application-status"
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <ClockIcon className="w-6 h-6" />
          <span>Application Status</span>
        </Link>

        <Link
          to="/membership-requests"
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <UserGroupIcon className="w-6 h-6" />
          <span>Membership Requests</span>
        </Link>

        <button
            onClick={() => setShowDeactivateModal(true)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-red-400"
          >
            <TrashIcon className="w-6 h-6" />
            <span>Deactivate Account</span>
          </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-red-400"
        >
          <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
          <span>Logout</span>
        </button>
      </nav>

      {/* Footer Section */}
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-700">
        <p className="text-sm text-gray-400 text-center">
          Uni Connect © {new Date().getFullYear()}
        </p>
      </div>
    </div>
    {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1D] rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-white">Deactivate Account</h2>
            <p className="text-red-400 mb-4">
              Warning: This action cannot be undone. Your account and all associated data will be permanently deleted.
            </p>
            <DeactivateAccount onClose={() => setShowDeactivateModal(false)} />
            <button
              onClick={() => setShowDeactivateModal(false)}
              className="mt-4 w-full p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}