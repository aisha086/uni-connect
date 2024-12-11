import { useState } from 'react';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';

export function DeactivateAccount({ onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return !Object.keys(errors).length;
  };

  const handleDeactivate = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }
    
    const user = auth.currentUser;
    if (!user || !user.email) return;

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      
      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', user.uid));
      
      // Delete the authentication account
      await deleteUser(user);
      
      onClose();
      window.location.href = '/'; // Force redirect to home
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError('Failed to deactivate account. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleDeactivate} className="space-y-4">
      <div className="space-y-1">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Confirm Password"
          required
          className={validationErrors.password ? 'border-red-500' : ''}
        />
        {validationErrors.password && (
          <p className="text-red-500 text-sm">{validationErrors.password}</p>
        )}
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      <Button type="submit" variant="danger">Confirm Deactivation</Button>
    </form>
  );
}