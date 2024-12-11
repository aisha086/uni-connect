import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthContext } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export function MembershipRequestStatus() {
  const [userRequests, setUserRequests] = useState([]);
  const [societyRequests, setSocietyRequests] = useState([]);
  const [adminSocieties, setAdminSocieties] = useState([]);
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth-screen');
      return;
    }

    const fetchAdminSocieties = async () => {
      const societiesRef = collection(db, 'societies');
      const societiesSnapshot = await getDocs(societiesRef);
      
      const adminSocietiesList = societiesSnapshot.docs.filter(doc => {
        const society = doc.data();
        return society.cabinetMembers?.some(
          member => 
            member.userId === user.uid && 
            (member.designation.toLowerCase() === 'president' || 
             member.designation.toLowerCase() === 'vice president')
        );
      });
      
      setAdminSocieties(adminSocietiesList.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    };

    const fetchUserRequests = async () => {
      const requestsCollection = collection(db, 'membershipRequests');
      const q = query(requestsCollection, where('userId', '==', user.uid));
      const requestsSnapshot = await getDocs(q);
      
      const requestsWithSocietyNames = await Promise.all(
        requestsSnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          const societyDoc = await getDoc(doc(db, 'societies', data.societyId));
          const societyData = societyDoc.data();
          return {
            id: docSnapshot.id,
            ...data,
            societyName: societyData?.name || 'Unknown Society'
          };
        })
      );
      
      setUserRequests(requestsWithSocietyNames);
    };

    const fetchSocietyRequests = async () => {
      if (adminSocieties.length === 0) return;
      
      const requestsCollection = collection(db, 'membershipRequests');
      const requests = [];
      
      for (const society of adminSocieties) {
        const q = query(requestsCollection, where('societyId', '==', society.id));
        const snapshot = await getDocs(q);
        
        const societyRequests = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data();
            const userDoc = await getDoc(doc(db, 'users', data.userId));
            const userData = userDoc.data();
            return {
              id: docSnapshot.id,
              ...data,
              userName: userData?.name || 'Unknown User',
              userEmail: userData?.email || 'No Email',
              societyName: society.name
            };
          })
        );
        
        requests.push(...societyRequests);
      }
      
      setSocietyRequests(requests);
    };

    fetchAdminSocieties().then(() => {
      fetchUserRequests();
      fetchSocietyRequests();
    });
  }, [user, navigate]);

  const handleDeleteRequest = async (requestId) => {
    try {
      await deleteDoc(doc(db, 'membershipRequests', requestId));
      setUserRequests(userRequests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      await updateDoc(doc(db, 'membershipRequests', requestId), {
        status: action
      });
      
      setSocietyRequests(societyRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: action }
          : request
      ));
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="max-w-[70%] w-full space-y-8 items-center">
        {/* User's Requests Section */}
        <div>
          <h2 className="text-xl text-[#6A1E55] font-semibold mb-4">Your Membership Requests</h2>
          {userRequests.length === 0 ? (
            <p>No pending membership requests.</p>
          ) : (
            <div className="space-y-4">
              {userRequests.map(request => (
                <div key={request.id} className="bg-[#6A1E55] p-4 rounded-lg relative">
                  <Button 
                    onClick={() => handleDeleteRequest(request.id)}
                    className="absolute top-2 right-2"
                  >
                    Delete
                  </Button>
                  <h3 className="font-bold">{request.societyName}</h3>
                  <p className={`text-sm ${
                    request.status === 'approved' ? 'text-green-500' : 
                    request.status === 'pending' ? 'text-yellow-500' : 
                    'text-red-500'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </p>
                  <p className="text-sm">{request.createdAt}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Society Admin Section */}
        {adminSocieties.length > 0 && (
          <div>
            <h2 className="text-xl text-[#6A1E55] font-semibold mb-4">Society Membership Requests</h2>
            {societyRequests.length === 0 ? (
              <p>No pending requests for your societies.</p>
            ) : (
              <div className="space-y-4">
                {societyRequests.map(request => (
                  <div key={request.id} className="bg-[#6A1E55] p-4 rounded-lg">
                    <h3 className="font-bold">{request.societyName}</h3>
                    <p className="text-sm">From: {request.userName} ({request.userEmail})</p>
                    <p className={`text-sm ${
                      request.status === 'approved' ? 'text-green-500' : 
                      request.status === 'pending' ? 'text-yellow-500' : 
                      'text-red-500'
                    }`}>
                      Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </p>
                    {request.status === 'pending' && (
                      <div className="mt-2 space-x-2">
                        <Button 
                          onClick={() => handleRequestAction(request.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleRequestAction(request.id, 'rejected')}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

