import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Button } from '../ui/Button';


export function EventCalendar({ societyId, canManage }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'events');
      const q = query(eventsCollection, where('societyId', '==', societyId));
      const eventsSnapshot = await getDocs(q);
      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsList);
    };

    fetchEvents();
  }, [societyId]);

  const handleDelete = async (eventId) => {
    try {
      await deleteDoc(doc(db, 'events', eventId));
      // Update local state to remove the deleted event
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Event Calendar</h2>
      {events.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1 max-w-full">
          {events.map(event => (
            <div key={event.id} className="bg-[#6A1E55] p-4 rounded-lg max-w-[40vh] relative">
              {canManage && (
                <Button 
                  onClick={() => handleDelete(event.id)}
                  className="absolute top-2 right-2"
                >
                  Delete
                </Button>
              )}
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-sm mb-2">{event.description}</p>
              <p className="text-sm"><strong>Date:</strong> {event.date}</p>
              <p className="text-sm"><strong>Venue:</strong> {event.venue}</p>
              {event.imageUrl && (
                <img src={event.imageUrl} alt={event.title} className="mt-2 rounded-md max-w-full h-auto" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

