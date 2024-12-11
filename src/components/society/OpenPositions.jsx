import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useAuthContext } from '../auth/AuthProvider';



export function OpenPositions({ societyId, canManage }) {
  const [positions, setPositions] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [newPosition, setNewPosition] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(null);
  const [showApplyDialog, setShowApplyDialog] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch positions
      const positionsCollection = collection(db, 'openPositions');
      const positionsQuery = query(positionsCollection, where('societyId', '==', societyId));
      const positionsSnapshot = await getDocs(positionsQuery);
      const positionsList = positionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPositions(positionsList);

      // Fetch user's applications if user is logged in
      if (user) {
        const applicationsCollection = collection(db, 'membershipRequests');
        const applicationsQuery = query(
          applicationsCollection, 
          where('userId', '==', user.uid),
          where('societyId', '==', societyId)
        );
        const applicationsSnapshot = await getDocs(applicationsQuery);
        const applicationsList = applicationsSnapshot.docs.map(doc => doc.data().positionId);
        setUserApplications(applicationsList);
      }
    };

    fetchData();
  }, [societyId, user]);


  const handleDeletePosition = async (positionId) => {
    try {
      await deleteDoc(doc(db, 'openPositions', positionId));
      setPositions(positions.filter(pos => pos.id !== positionId));
      setSuccess('Position deleted successfully!');
    } catch (error) {
      setError('Failed to delete position');
    }
    setShowDeleteDialog(null);
  };

  const handleApply = async (position) => {
    try {
      await addDoc(collection(db, 'membershipRequests'), {
        userId: user.uid,
        societyId,
        positionId: position.id,
        positionTitle: position.title,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setSuccess('Application submitted successfully!');
    } catch (error) {
      setError('Failed to submit application');
    }
    setShowApplyDialog(null);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Open Positions</h2>
      {positions.length === 0 ? (
        <p>No open positions at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1 max-w-full">
          {positions.map(position => (
            <div key={position.id} className="bg-[#6A1E55] p-4 rounded-lg relative">
              <h3 className="font-bold">{position.title}</h3>
              <p className="text-sm">{position.description}</p>
              {canManage ? (
                <button
                  onClick={() => setShowDeleteDialog(position.id)}
                  className="absolute top-2 right-2 text-white hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              ) : userApplications.includes(position.id) ? (
                <span className="mt-2 px-3 py-1 bg-gray-500 rounded-md text-sm cursor-not-allowed">
                  Applied
                </span>
              ) : (
                <button
                  onClick={() => setShowApplyDialog(position)}
                  className="mt-2 px-3 py-1 bg-[#A64D79] rounded-md hover:bg-[#8B3D65] text-sm"
                >
                  Apply
                </button>
              )}
            </div>
          ))}
        </div>
      )}
       {/* Delete Confirmation Dialog */}
       {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1D] p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this position?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={() => setShowDeleteDialog(null)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={() => handleDeletePosition(showDeleteDialog)} variant="danger">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Apply Confirmation Dialog */}
      {showApplyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1D] p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Application</h3>
            <p>Are you sure you want to apply for {showApplyDialog.title}?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={() => setShowApplyDialog(null)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={() => handleApply(showApplyDialog)} variant="primary">
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
    </div>
  );
}

