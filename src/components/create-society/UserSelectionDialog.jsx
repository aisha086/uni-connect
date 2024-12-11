import { Button } from '../ui/Button';

export function UserSelectionDialog({ users, show, onClose, onSelect }) {
    if (!show) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-[#1A1A1D] p-4 rounded-md shadow-lg max-w-sm w-full">
          <h3 className="text-lg font-semibold mb-2">Select a User</h3>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id}>
                <button
                  className="text-[#6A1E55] hover:underline"
                  onClick={() => onSelect(user)}
                >
                  <p className='font-bold'>{user.name} ({user.email})</p>
                  
                </button>
              </li>
            ))}
          </ul>
          <Button onClick={onClose} className='mt-2'>Cancel</Button>
        </div>
      </div>
    );
  }
  