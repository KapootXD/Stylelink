import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Upload, Loader } from 'lucide-react';
import { Button, Input, Modal, LoadingSpinner } from './index';
import { useAuth } from '../contexts/AuthContext';
import { isUsernameAvailable, updateUserProfileInFirestore, uploadFile, updateUserProfile } from '../config/firebase';
import toast from 'react-hot-toast';
import { compressImage } from '../utils/imageCompression';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData: {
    displayName?: string | null;
    username?: string;
    bio?: string;
    location?: string;
    profilePicture?: string;
    usernameChangeCount?: number;
  };
}

const COUNTRY_OPTIONS = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'India',
  'Japan',
  'China',
  'Brazil'
];

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const { currentUser, refreshUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    displayName: initialData.displayName || '',
    username: initialData.username || '',
    bio: initialData.bio || '',
    location: initialData.location || ''
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(initialData.profilePicture || null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(initialData.profilePicture || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [profilePictureRemoved, setProfilePictureRemoved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form when initialData changes
  useEffect(() => {
    setFormData({
      displayName: initialData.displayName || '',
      username: initialData.username || '',
      bio: initialData.bio || '',
      location: initialData.location || ''
    });
    setProfilePicture(initialData.profilePicture || null);
    setProfilePicturePreview(initialData.profilePicture || null);
    setProfilePictureFile(null);
    setProfilePictureRemoved(false);
  }, [initialData, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBioChange = (value: string) => {
    const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

    if (wordCount > 50) {
      toast.error('Bio must be 50 words or fewer');
      return;
    }

    handleInputChange('bio', value);
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      setIsUploadingPicture(true);
      
      // Compress image before preview
      const compressedFile = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.8,
        maxSizeMB: 1
      });

      setProfilePictureFile(compressedFile);
      setProfilePictureRemoved(false);
      
      // Create preview
      const preview = URL.createObjectURL(compressedFile);
      setProfilePicturePreview(preview);
      
      toast.success('Profile picture ready to upload');
    } catch (error) {
      console.error('Error processing profile picture:', error);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    // Validate username format
    if (formData.username && !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      toast.error('Username can only contain letters, numbers, and underscores');
      return;
    }

    // Validate username length
    if (formData.username && formData.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    try {
      setIsSaving(true);

      let profilePictureUrl = profilePicture;

      // Upload profile picture if changed
      if (profilePictureFile) {
        try {
          toast.loading('Uploading profile picture...', { id: 'upload-picture' });
          
          const uploadedUrl = await uploadFile(
            profilePictureFile,
            currentUser.uid,
            'profile',
            (progress) => {
              // Show upload progress
              console.log(`Profile picture upload: ${Math.round(progress)}%`);
            }
          );

          profilePictureUrl = uploadedUrl;

          // Update Firebase Auth profile picture
          await updateUserProfile({ photoURL: uploadedUrl });

          toast.success('Profile picture uploaded!', { id: 'upload-picture' });
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          toast.error('Failed to upload profile picture', { id: 'upload-picture' });
          // Continue with other updates even if picture upload fails
        }
      }

      if (profilePictureRemoved && !profilePictureFile) {
        profilePictureUrl = null;
      }

      // Prepare update data - only include non-empty values
      const updateData: any = {
        uid: currentUser.uid,
        email: currentUser.email || ''
      };

      // Only add fields that have values
      if (formData.displayName && formData.displayName.trim()) {
        updateData.displayName = formData.displayName.trim();
      }
      const normalizedUsername = formData.username.trim();
      const initialUsername = initialData.username?.trim();
      const usernameChanged = normalizedUsername && normalizedUsername !== initialUsername;
      const usernameChangeCount = initialData.usernameChangeCount || 0;

      if (usernameChanged) {
        if (usernameChangeCount >= 3) {
          toast.error('Username can only be changed 3 times.');
          setIsSaving(false);
          return;
        }

        const available = await isUsernameAvailable(normalizedUsername, currentUser.uid);
        if (!available) {
          toast.error('This username is already taken.');
          setIsSaving(false);
          return;
        }

        updateData.username = normalizedUsername;
        updateData.usernameChangeCount = usernameChangeCount + 1;
      } else if (normalizedUsername) {
        updateData.username = normalizedUsername;
      }
      if (formData.bio && formData.bio.trim()) {
        updateData.bio = formData.bio.trim();
      }
      if (formData.location && formData.location.trim()) {
        updateData.location = formData.location.trim();
      }
      if (profilePictureUrl !== undefined) {
        updateData.avatarUrl = profilePictureUrl;
        updateData.photoURL = profilePictureUrl || null;
      }

      console.log('📝 Updating profile with data:', updateData);

      // Update Firestore profile
      await updateUserProfileInFirestore(currentUser.uid, updateData);

      console.log('✅ Profile updated in Firestore');

      // Update Firebase Auth display name
      if (formData.displayName) {
        await updateUserProfile({ displayName: formData.displayName });
      }

      if (profilePictureRemoved && !profilePictureFile) {
        await updateUserProfile({ photoURL: null });
      }

      // Refresh user profile in context
      console.log('🔄 Refreshing user profile...');
      await refreshUserProfile();
      console.log('✅ User profile refreshed');

      toast.success('Profile updated successfully!');
      
      // Call onSave callback to trigger parent refresh
      onSave();
      
      // Small delay to ensure state updates
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePicture = () => {
    setProfilePictureFile(null);
    setProfilePicturePreview(null);
    setProfilePicture(null);
    setProfilePictureRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" size="lg">
      <div className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#B7410E]/20 to-[#D4AF37]/20 border-4 border-white shadow-lg">
              {profilePicturePreview ? (
                <img
                  src={profilePicturePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-12 h-12 text-[#8B5E3C]/50" />
                </div>
              )}
            </div>
            {isUploadingPicture && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <Loader className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
              id="profile-picture-upload"
              disabled={isUploadingPicture}
            />
            <Button
              variant="secondary"
              size="sm"
              className="cursor-pointer"
              disabled={isUploadingPicture}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {profilePicturePreview ? 'Change' : 'Upload'} Photo
            </Button>
            {profilePicturePreview && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRemovePicture}
                disabled={isUploadingPicture}
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <Input
            label="Display Name"
            placeholder="Your full name"
            value={formData.displayName}
            onChange={(e) => handleInputChange('displayName', e.target.value)}
            maxLength={50}
          />

          <Input
            label="Username"
            placeholder="username (e.g., @alexstyle)"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value.replace('@', ''))}
            maxLength={30}
            helpText="Only letters, numbers, and underscores. 3-30 characters."
          />

          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
              Bio
            </label>
            <textarea
              className="w-full px-4 py-2 border border-[#8B5E3C]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7410E] resize-none"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => handleBioChange(e.target.value)}
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-[#2D2D2D]/60 mt-1">
              {formData.bio.trim() ? formData.bio.trim().split(/\s+/).length : 0}/50 words
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2">Location</label>
            <select
              className="w-full px-4 py-2 border border-[#8B5E3C]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7410E] bg-white"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            >
              <option value="">Select your country</option>
              {COUNTRY_OPTIONS.map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
              {formData.location && !COUNTRY_OPTIONS.includes(formData.location) && (
                <option value={formData.location}>{formData.location}</option>
              )}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving || isUploadingPicture}
            className="flex-1"
          >
            {isSaving ? (
              <>
                <LoadingSpinner size="sm" color="#2D2D2D" />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;

