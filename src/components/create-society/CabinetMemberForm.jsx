import { useState } from 'react';
import { query, where, collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserSelectionDialog } from './UserSelectionDialog';

export function CabinetMemberForm({ cabinetMembers, setCabinetMembers }) {
  const [newMember, setNewMember] = useState({ name: '', designation: '' });
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState('');

  const handleNewMemberChange = (field, value) => {
    setNewMember({ ...newMember, [field]: value });
  };

  const validateMember = async () => {
    setError('');
    if (!newMember.name || !newMember.designation) {
      setError('Both name and designation are required.');
      return false;
    }

    try {
      const q = query(collection(db, 'users'), where('name', '==', newMember.name));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError(`No matching student found for ${newMember.name}.`);
        return false;
      }

      const users = [];
      snapshot.forEach((doc) => users.push({ id: doc.id, ...doc.data() }));
      if (users.length > 1) {
        setMatchedUsers(users);
        setShowDialog(true);
        return false;
      }

      const user = users[0];
      setCabinetMembers([...cabinetMembers, { ...newMember, userId: user.id }]);
      setNewMember({ name: '', designation: '' });
      return true;
    } catch (err) {
      setError('Error validating member. Please try again.');
      return false;
    }
  };

  const handleAddMember = async () => {
    const isValid = await validateMember();
    if (!isValid) return;
    setError('');
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input
          type="text"
          placeholder="Name"
          value={newMember.name}
          onChange={(e) => handleNewMemberChange('name', e.target.value)}
        />
        <Input
          type="text"
          placeholder="Designation"
          value={newMember.designation}
          onChange={(e) => handleNewMemberChange('designation', e.target.value)}
        />
        <Button type="button" onClick={handleAddMember}>
          Add Member
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <UserSelectionDialog
        users={matchedUsers}
        show={showDialog}
        onClose={() => setShowDialog(false)}
        onSelect={(user) => {
          setCabinetMembers([...cabinetMembers, { ...newMember, userId: user.id }]);
          setShowDialog(false);
        }}
      />
    </div>
  );
}
