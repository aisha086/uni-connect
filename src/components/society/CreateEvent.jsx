import { useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { supabase, getSignedUrl } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';

export function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const { societyId } = useParams();

  const validateForm = () => {
    const errors = {};
    
    // Title validation
    if (!title.trim()) {
      errors.title = 'Event title is required';
    } else if (title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    // Description validation
    if (!description.trim()) {
      errors.description = 'Event description is required';
    } else if (description.trim().length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }

    // Date validation
    if (!date) {
      errors.date = 'Event date is required';
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = 'Event date cannot be in the past';
      }
    }

    // Venue validation
    if (!venue.trim()) {
      errors.venue = 'Event venue is required';
    } else if (venue.trim().length < 3) {
      errors.venue = 'Venue must be at least 3 characters';
    }

    if (!image) {
      errors.image = 'Image is required';
    } 


    setValidationErrors(errors);
    return !Object.keys(errors).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        const { data, error } = await supabase.storage
          .from('event-images')
          .upload(`${societyId}/${image.name}`, image);

        if (error) throw error;

        imageUrl = await getSignedUrl('event-images', data.path);
      }

      const eventData = {
        title,
        description,
        date,
        venue,
        imageUrl,
        societyId,
      };

      await addDoc(collection(db, 'events'), eventData);

      setSuccess('Event created successfully!');
      setTitle('');
      setDescription('');
      setDate('');
      setVenue('');
      setImage(null);
    } catch (error) {
      setError('Failed to create event. Please try again.');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-[70%] border border-[#6A1E55] px-6 py-8 rounded-lg shadow-lg shadow-[#6A1E55]/20">
        <h2 className="text-xl font-semibold mb-4">Create Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-full">
          <div className="space-y-1">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event Title"
              required
              className={validationErrors.title ? 'border-red-500' : ''}
            />
            {validationErrors.title && (
              <p className="text-red-500 text-sm">{validationErrors.title}</p>
            )}
          </div>

          <div className="space-y-1">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event Description"
              className={`w-full p-2 bg-[#1A1A1D] text-white border border-[#6A1E55] rounded-md ${
                validationErrors.description ? 'border-red-500' : ''
              }`}
              required
            />
            {validationErrors.description && (
              <p className="text-red-500 text-sm">{validationErrors.description}</p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={validationErrors.date ? 'border-red-500' : ''}
            />
            {validationErrors.date && (
              <p className="text-red-500 text-sm">{validationErrors.date}</p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Venue"
              required
              className={validationErrors.venue ? 'border-red-500' : ''}
            />
            {validationErrors.venue && (
              <p className="text-red-500 text-sm">{validationErrors.venue}</p>
            )}
          </div>

          <div>
          <input
            type="file"
            id="logo"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />

          <label
            htmlFor="logo"
            className="inline-block px-4 py-2 bg-[#6A1E55] text-white rounded hover:bg-[#5a1947] cursor-pointer"
          >
            {image ? image.name : "Choose Logo"}
          </label>
          {validationErrors.image && (
              <p className="text-red-500 text-sm">{validationErrors.image}</p>
            )}
          </div>
          
          {error && <Alert variant="error">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Button type="submit">Create Event</Button>
        </form>
      </div>
    </div>
  );
}
