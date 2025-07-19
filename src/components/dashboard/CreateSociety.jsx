import { useState, useEffect } from 'react';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { supabase, getUrl } from '../../lib/supabase';
import { useAuthContext } from '../auth/AuthProvider';
import { CabinetMemberList } from '../create-society/CabinetMemberList';
import { CabinetMemberForm } from '../create-society/CabinetMemberForm';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNavigate } from 'react-router-dom';

export function CreateSociety() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(null);
  const [cabinetMembers, setCabinetMembers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);



  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth-screen');
    }
  }, [user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const validateForm = () => {
    const errors = {};

    // Society name validation
    if (!name.trim()) {
      errors.name = 'Society name is required';
    } else if (name.trim().length < 3) {
      errors.name = 'Society name must be at least 3 characters';
    }

    // Description validation
    if (!description.trim()) {
      errors.description = 'Description is required';
    } else if (description.trim().length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }

    if (!selectedFile) {
      errors.image = 'Image is required';
    } 

    // Cabinet members validation
    if (!cabinetMembers.length) {
      errors.cabinet = 'At least one cabinet member is required';
    }

    if (!cabinetMembers.find((member) => member.designation.toLowerCase() === 'president')) {
      errors.president = 'A President must be added to the cabinet';
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
      const societyData = {
        name,
        description,
        icon: '',
        createdBy: user.uid,
        cabinetMembers,
      };

      const doc = await addDoc(collection(db, 'applications'), {
        ...societyData,
        type: 'society',
        approved: 'pending',
      });

      let imageUrl = '';

      if (selectedFile) {
        const { data, err } = await supabase.storage
          .from('society-icons')
          .upload(`${doc.id}/${selectedFile.name}`, selectedFile);

        if (err) {
          setError('Error uploading image');
        }

        imageUrl = await getUrl('society-icons', data.path);
        console.log("this is image url");
        console.log(imageUrl);

        await updateDoc(doc, {
          icon: imageUrl
        });
      }

      setSuccess('Society creation application submitted successfully!');
      setName('');
      setDescription('');
      setSelectedFile(null);
      // setIcon(null);
      setCabinetMembers([]);
    } catch (e) {
      console.log(e);
      setError('Failed to submit society creation application. Please try again.');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-[70%] border border-[#6A1E55] px-6 py-8 rounded-lg shadow-lg shadow-[#6A1E55]/20">
        <h2 className="text-xl font-semibold mb-4">Create a Society</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Society Name"
              required
              className={validationErrors.name ? 'border-red-500' : ''}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm">{validationErrors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Society Description"
              className={`w-full p-2 bg-[#1A1A1D] text-white border border-[#6A1E55] rounded-md ${validationErrors.description ? 'border-red-500' : ''
                }`}
              required
            />
            {validationErrors.description && (
              <p className="text-red-500 text-sm">{validationErrors.description}</p>
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
            {selectedFile ? selectedFile.name : "Choose Logo"}
          </label>
          {validationErrors.image && (
              <p className="text-red-500 text-sm">{validationErrors.image}</p>
            )}
          </div>
          <div className="space-y-1">
            <CabinetMemberForm
              cabinetMembers={cabinetMembers}
              setCabinetMembers={setCabinetMembers}
            />
            {validationErrors.cabinet && (
              <p className="text-red-500 text-sm">{validationErrors.cabinet}</p>
            )}
            {validationErrors.president && (
              <p className="text-red-500 text-sm">{validationErrors.president}</p>
            )}
          </div>

          <CabinetMemberList cabinetMembers={cabinetMembers} />
          {error && <Alert variant="error">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Button type="submit">Submit Application</Button>
        </form>
      </div>
    </div>
  );
}
