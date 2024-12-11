import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { supabase, getSignedUrl } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';

export function AddPost(){

    const [newPost, setNewPost] = useState({ title: '', caption: '' });
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const { societyId: societyId } = useParams();

    const validateForm = () => {
        const errors = {};
        
        // Title validation
        if (!newPost.title.trim()) {
            errors.title = 'Post title is required';
        } else if (newPost.title.trim().length < 3) {
            errors.title = 'Title must be at least 3 characters';
        }

        // Caption validation
        if (!newPost.caption.trim()) {
            errors.caption = 'Post caption is required';
        } else if (newPost.caption.trim().length < 10) {
            errors.caption = 'Caption must be at least 10 characters';
        }

        setValidationErrors(errors);
        return !Object.keys(errors).length;
    };

    const handleAddPost = async (e) => {
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
              .from('post-images')
              .upload(`${societyId}/${image.name}`, image);
    
            if (error) throw error;
    
            imageUrl = await getSignedUrl('post-images', data.path);
          }
    
          await addDoc(collection(db, 'posts'), {
            ...newPost,
            imageUrl,
            societyId,
            creationDate: new Date().toISOString(),
          });
    
          setSuccess('Post added successfully!');
          setNewPost({ title: '', caption: '' });
          setImage(null);
    
        } catch (error) {
          setError('Failed to add post. Please try again.');
        }
      };

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-[70%] border border-[#6A1E55] px-6 py-8 rounded-lg shadow-lg shadow-[#6A1E55]/20">
          <h2 className="text-xl font-semibold mb-4">Society Posts</h2>
        <form onSubmit={handleAddPost} className="space-y-4 mb-4">
          <div className="space-y-1">
            <Input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="Post Title"
              required
              className={validationErrors.title ? 'border-red-500' : ''}
            />
            {validationErrors.title && (
              <p className="text-red-500 text-sm">{validationErrors.title}</p>
            )}
          </div>

          <div className="space-y-1">
            <textarea
              value={newPost.caption}
              onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
              placeholder="Post Caption"
              className={`w-full p-2 bg-[#1A1A1D] text-white border border-[#6A1E55] rounded-md ${
                validationErrors.caption ? 'border-red-500' : ''
              }`}
              required
            />
            {validationErrors.caption && (
              <p className="text-red-500 text-sm">{validationErrors.caption}</p>
            )}
          </div>

          <Input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            accept="image/*"
          />
          <Button type="submit">Add Post</Button>
        </form>
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
          </div>
        </div>
      );
}