import { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { doc, getDoc,updateDoc, arrayUnion, arrayRemove  } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthContext } from '../auth/AuthProvider';
import { EventCalendar } from './EventCalendar';
import { OpenPositions } from './OpenPositions';
import { SocietyPosts } from './SocietyPosts';
import { Button } from '../ui/Button';

export function SocietyDashboard() {
  const [society, setSociety] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { societyId } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSociety = async () => {
      if (!societyId) return;

      const societyDoc = await getDoc(doc(db, 'societies', societyId));
      if (societyDoc.exists()) {
        const societyData = { id: societyDoc.id, ...societyDoc.data() };
        setSociety(societyData);

        if (user) {
          const userRole = societyData.cabinetMembers.find(member => member.userId === user.uid)?.designation || null;
          setUserRole(userRole);
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const followedSocieties = userDoc.data().followedSocieties || [];
          setIsFollowing(followedSocieties.includes(societyId));
        }
      }
    };

    fetchSociety();
  }, [societyId, user]);

  if (!society) {
    return <div>Loading...</div>;
  }

  var canManageSociety = false;

  if(userRole != null){
    canManageSociety = userRole.toLowerCase() === 'president' || userRole.toLowerCase() === 'vice president' || userRole.toLowerCase() === 'general secretary';
  }

  const handleFollowToggle = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        followedSocieties: isFollowing 
          ? arrayRemove(societyId)
          : arrayUnion(societyId)
      });

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };



  return (
    <div className="p-10 md:p-8 lg:p-12">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold mb-4">{society.name}</h1>
        <img src={society.icon} alt={society.name} className="w-24 h-24 rounded-full mb-4" />
      <p className="mb-4">{society.description}</p>
      {user && (
          <Button 
            onClick={handleFollowToggle}
            className={isFollowing ? 'bg-green-600 hover:bg-green-700 mb-4' : 'mb-4'}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      {canManageSociety && (
        <div className="flex gap-4 mb-6">
          <Button 
            onClick={() => navigate(`/society/${society.id}/create-event`)}
          >
            Create Event
          </Button>
          <Button 
            onClick={() => navigate(`/society/${society.id}/add-position`)}
          >
            Manage Positions
          </Button>
          <Button 
            onClick={() => navigate(`/society/${society.id}/add-post`)}
          >
            Add Posts
          </Button>
        </div>
      )}
      </div>
      <EventCalendar societyId={society.id} canManage={canManageSociety}/>
      <OpenPositions societyId={society.id} canManage={canManageSociety} />
      <SocietyPosts societyId={society.id } canManage={canManageSociety}/>
    </div>
  );
}
