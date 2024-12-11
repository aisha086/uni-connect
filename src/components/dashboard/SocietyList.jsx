import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';


export function SocietyList() {
  const [societies, setSocieties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSocieties = async () => {
      const societiesCollection = collection(db, 'societies');
      const societiesSnapshot = await getDocs(societiesCollection);
      const societiesList = societiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSocieties(societiesList);
    };

    fetchSocieties();
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Societies</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {societies.map(society => (
          <div key={society.id} className="flex-shrink-0 w-64 bg-[#6A1E55] rounded-lg p-4" onClick={() => navigate(`/society/${society.id}`)}>
            <img src={society.icon} alt={society.name} className="w-16 h-16 mb-2 rounded-full" />
            <h3 className="font-bold">{society.name}</h3>
            <p className="text-sm">{society.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

