import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';

export function AddOpenPosition() {
    const [newPosition, setNewPosition] = useState({ title: '', description: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const { societyId } = useParams();

  const validateForm = () => {
    const errors = {};
    
    // Title validation
    if (!newPosition.title.trim()) {
      errors.title = 'Position title is required';
    } else if (newPosition.title.trim().length < 3) {
      errors.title = 'Position title must be at least 3 characters';
    }

    // Description validation
    if (!newPosition.description.trim()) {
      errors.description = 'Position description is required';
    } else if (newPosition.description.trim().length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }

    setValidationErrors(errors);
    return !Object.keys(errors).length;
  };

  const handleAddPosition = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      await addDoc(collection(db, 'openPositions'), {
        ...newPosition,
        societyId,
      });

      setSuccess('Position added successfully!');
      setNewPosition({ title: '', description: '' });
    } catch (error) {
      setError('Failed to add position. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-[70%] border border-[#6A1E55] px-6 py-8 rounded-lg shadow-lg shadow-[#6A1E55]/20">
        <h2 className="text-xl font-semibold mb-4">Open Positions</h2>
        <form onSubmit={handleAddPosition} className="space-y-4 mb-4">
          <div className="space-y-1">
            <Input
              type="text"
              value={newPosition.title}
              onChange={(e) => setNewPosition({ ...newPosition, title: e.target.value })}
              placeholder="Position Title"
              required
              className={validationErrors.title ? 'border-red-500' : ''}
            />
            {validationErrors.title && (
              <p className="text-red-500 text-sm">{validationErrors.title}</p>
            )}
          </div>

          <div className="space-y-1">
            <textarea
              value={newPosition.description}
              onChange={(e) => setNewPosition({ ...newPosition, description: e.target.value })}
              placeholder="Position Description"
              className={`w-full p-2 bg-[#1A1A1D] text-white border border-[#6A1E55] rounded-md ${
                validationErrors.description ? 'border-red-500' : ''
              }`}
              required
            />
            {validationErrors.description && (
              <p className="text-red-500 text-sm">{validationErrors.description}</p>
            )}
          </div>

          <Button type="submit">Add Position</Button>
        </form>
        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
      </div>
    </div>
  );
}
