import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthContext } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';


export function ApplicationStatus() {
  const [applications, setApplications] = useState([]);
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth-screen');
      return;
    }

    const fetchApplications = async () => {
      const applicationsCollection = collection(db, 'applications');
      const q = query(applicationsCollection, where('createdBy', '==', user.uid));
      const applicationsSnapshot = await getDocs(q);
      const applicationsList = applicationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(applicationsList);
    };

    fetchApplications();
  }, [user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-w-[100vw] flex justify-center p-4">
      <div className="max-w-full ">
      <h1 className="text-xl text-[#6A1E55] font-semibold mb-4">Application Status</h1>
      {applications.length === 0 ? (
        <p>No pending applications.</p>
      ) : (
         <div className="sm:w-[300px] md:w-[400px] lg:w-[600px]">
         {applications.map(app => (
           <div key={app.id} className="bg-[#6A1E55] p-4 rounded-lg mb-4 w-full">
            <img src={app.icon} alt={app.name} className="w-16 h-16 mb-2 rounded-full" />
             <h3 className="font-bold">{app.name}</h3>
             <p className="text-sm"><span className="font-bold">Application Type: </span>{app.type}</p>
             <p className={`text-sm ${
               app.approved === 'approved' ? 'text-green-500' : 
               app.approved === 'pending' ? 'text-yellow-500' : 
               'text-red-500'
             }`}>{app.approved === 'approved'? 'Approved' : app.approved === 'pending'? 'Pending' : 'Rejected'}</p>
           </div>
         ))}
       </div>
      )}
    </div>
    </div>
  );
}

