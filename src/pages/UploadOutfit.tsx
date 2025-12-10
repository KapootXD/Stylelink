import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  Tag, 
  ArrowRight,
  X,
  Image as ImageIcon,
  Video
} from 'lucide-react';
import { Button, Card, Input, LoadingSpinner, Modal } from '../components';
import { useReducedMotion } from '../components/PageTransition';
import { useAuth } from '../contexts/AuthContext';
import { createOutfitWithMedia } from '../services/firebaseService';
import { addOfflineOutfit } from '../utils/offlineOutfits';
import { isFirebaseConfigured } from '../services/apiService';
import { validateFileSize, validateImageType, getFileSize } from '../utils/imageCompression';
import toast from 'react-hot-toast';

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const UploadOutfit: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    brand: '',
    shopLink: '',
    color: '',
    size: '',
    occasion: '',
    season: 'spring' as 'spring' | 'summer' | 'fall' | 'winter'
  });
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [styleSelection, setStyleSelection] = useState('');
  const [customStyle, setCustomStyle] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const styleOptions = [
    'Streetwear',
    'Casual',
    'Vintage',
    'Minimalist',
    'Bohemian',
    'Formal',
    'Athleisure',
    'Classic',
    'Preppy',
    'Glam',
    'Avant-garde'
  ];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.3 : 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: prefersReducedMotion ? 0.3 : 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: prefersReducedMotion ? 0.3 : 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0.05 : 0.1,
        delayChildren: 0.1
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addStyleTag = (style: string) => {
    const normalizedStyle = style.trim();
    if (!normalizedStyle) return;
    setSelectedStyles(prev => (prev.includes(normalizedStyle) ? prev : [...prev, normalizedStyle]));
  };

  const removeStyleTag = (style: string) => {
    setSelectedStyles(prev => prev.filter(tag => tag !== style));
  };

  const handleCustomStyleAdd = () => {
    addStyleTag(customStyle);
    setCustomStyle('');
  };

  const addHashtag = () => {
    const cleaned = hashtagInput.trim().replace(/^#/, '');
    if (!cleaned) return;
    if (hashtags.length >= 5) {
      toast.error('You can only add up to 5 hashtags');
      return;
    }

    const normalized = `#${cleaned}`;
    if (hashtags.includes(normalized)) {
      toast.error('Hashtag already added');
      return;
    }

    setHashtags(prev => [...prev, normalized]);
    setHashtagInput('');
  };

  const removeHashtag = (tag: string) => {
    setHashtags(prev => prev.filter(item => item !== tag));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (videoFiles.length > 0) {
      toast.error('You can only upload photos OR a single video, not both. Remove the video to add photos.');
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      return;
    }

    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => {
        // Validate file type
        if (!validateImageType(file)) {
          toast.error(`${file.name} is not a valid image file. Please use JPEG, PNG, WebP, or GIF.`);
          return false;
        }
        
        // Validate file size (max 10MB before compression)
        if (!validateFileSize(file, 10)) {
          toast.error(`${file.name} is too large (${getFileSize(file.size)}). Maximum size is 10MB.`);
          return false;
        }
        
        return true;
      });
      
      if (newFiles.length > 0) {
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setImageFiles(prev => [...prev, ...newFiles]);
        setImagePreviews(prev => [...prev, ...newPreviews]);
        
        // Show file size info
        const totalSize = newFiles.reduce((sum, file) => sum + file.size, 0);
        if (totalSize > 5 * 1024 * 1024) {
          toast.success(`Images will be compressed before upload. Original size: ${getFileSize(totalSize)}`, { duration: 3000 });
        }
      }
    }
    // Reset input to allow selecting the same file again
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (imageFiles.length > 0) {
      toast.error('You can only upload photos OR a single video, not both. Remove the photos to add a video.');
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
      return;
    }

    const files = event.target.files;
    if (files) {
      if (videoFiles.length >= 1) {
        toast.error('Only one video can be uploaded. Remove the current video to replace it.');
        if (videoInputRef.current) {
          videoInputRef.current.value = '';
        }
        return;
      }

      const validFile = Array.from(files).find(file => file.type.startsWith('video/'));
      if (validFile) {
        const preview = URL.createObjectURL(validFile);
        setVideoFiles([validFile]);
        setVideoPreviews([preview]);
      } else {
        toast.error('Please select a valid video file');
      }
    }
    // Reset input to allow selecting the same file again
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    // Revoke object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    // Revoke object URL to free memory
    URL.revokeObjectURL(videoPreviews[index]);
    setVideoFiles(prev => prev.filter((_, i) => i !== index));
    setVideoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error('Please log in to upload content');
      navigate('/login');
      return;
    }

    if ((imageFiles.length > 0 && videoFiles.length > 0) || (imageFiles.length === 0 && videoFiles.length === 0)) {
      toast.error('Upload either photos for a slideshow or one video.');
      return;
    }

    if (hashtags.length > 5) {
      toast.error('Please limit hashtags to 5 or fewer.');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter an outfit title');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const styleTags = selectedStyles;

      const baseItem = {
        name: formData.title,
        brand: formData.brand || 'Independent Seller',
        price: Number(formData.price.replace(/[^0-9.]/g, '')) || 0,
        currency: 'USD',
        size: formData.size || 'One size',
        color: formData.color || 'Assorted',
        category: 'outerwear' as const,
        directLink: formData.shopLink || '#',
        imageUrl: imagePreviews[0] || '',
        availability: 'in-stock' as const
      };

      if (isFirebaseConfigured()) {
        // Create outfit with media on Firebase
        await createOutfitWithMedia(
          {
            title: formData.title,
            description: formData.description,
            occasion: formData.occasion || 'casual',
            season: formData.season,
            styleTags,
            hashtags,
            items: [baseItem],
            isPublic: true
          },
          currentUser.uid,
          imageFiles,
          videoFiles,
          (progress) => {
            setUploadProgress(progress);
          }
        );

        toast.success('Outfit uploaded successfully!');
        // Navigate to profile to see the new post
        setTimeout(() => {
          navigate('/profile', { state: { fromUpload: true } });
        }, 1500); // Small delay to show success message and allow Firestore to index
      } else {
        // Offline/local demo mode: persist to localStorage so Discover shows uploads
        const mediaSources = imageFiles.length > 0 ? imageFiles : videoFiles;
        const mediaDataUrls = await Promise.all(mediaSources.map((file) => fileToDataUrl(file)));

        addOfflineOutfit({
          id: `offline-${Date.now()}`,
          userId: currentUser.uid,
          title: formData.title,
          description: formData.description,
          occasion: formData.occasion || 'casual',
          season: formData.season,
          styleTags,
          hashtags,
          items: [
            {
              ...baseItem,
              id: `item-${Date.now()}`,
              imageUrl: mediaDataUrls[0] || 'https://via.placeholder.com/600x800?text=StyleLink+Look'
            }
          ],
          mainImageUrl: mediaDataUrls[0] || 'https://via.placeholder.com/600x800?text=StyleLink+Look',
          additionalImages: mediaDataUrls.slice(1),
          createdAt: new Date(),
          updatedAt: new Date(),
          likes: 0,
          shares: 0,
          isPublic: true
        });

        setUploadProgress(100);
        toast.success('Saved locally! Your look is now in the Discover feed.');
        setShowPreview(true);
        return;
      }
    } catch (error: any) {
      console.error('Error uploading outfit:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to upload outfit. Please try again.';
      
      if (error.code === 'storage/unauthorized') {
        errorMessage = 'You do not have permission to upload files. Please check your Firebase Storage rules.';
      } else if (error.code === 'storage/canceled') {
        errorMessage = 'Upload was canceled. Please try again.';
      } else if (error.code === 'storage/unknown') {
        errorMessage = 'An unknown error occurred. Please check your internet connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Cleanup object URLs on unmount
  React.useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      videoPreviews.forEach(url => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF3E0]">
      {/* Header Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-[#B7410E] to-[#8B5E3C]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Share Your Style
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Upload your outfit photos, tag where you bought each item, and inspire the StyleLink community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upload Form */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Media Upload Section */}
            <motion.div variants={slideInLeft}>
              <Card className="h-full">
                <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6 flex items-center">
                  <Camera className="w-6 h-6 mr-3 text-[#B7410E]" />
                  Upload Media
                </h2>
                
                {/* Image Upload Area */}
                <div className="mb-6">
                  <div className="border-2 border-dashed border-[#8B5E3C]/30 rounded-2xl p-6 text-center mb-4 hover:border-[#B7410E]/50 transition-colors duration-300">
                    <input
                      ref={imageInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`cursor-pointer block ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="bg-[#FAF3E0] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ImageIcon className="w-6 h-6 text-[#B7410E]" />
                      </div>
                      <h3 className="text-base font-semibold text-[#2D2D2D] mb-1">
                        Upload Photos
                      </h3>
                      <p className="text-[#2D2D2D]/70 text-xs">
                        Click to select images for your slideshow
                      </p>
                    </label>

                    {imagePreviews.length > 0 && (
                      <div className="mt-4 text-left">
                        <h4 className="text-sm font-semibold text-[#2D2D2D] mb-2">Selected Photos ({imagePreviews.length})</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {imagePreviews.map((preview, index) => (
                            <motion.div
                              key={preview}
                              className="relative group"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                              <div className="aspect-square bg-gradient-to-br from-[#B7410E]/20 to-[#D4AF37]/20 rounded-xl overflow-hidden">
                                <img
                                  src={preview}
                                  alt={`Outfit preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <motion.button
                                className="absolute -top-2 -right-2 bg-[#B7410E] text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                                onClick={() => removeImage(index)}
                                disabled={isUploading}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <X className="w-3 h-3" />
                              </motion.button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                {/* Video Upload Area */}
                <div className="border-2 border-dashed border-[#8B5E3C]/30 rounded-2xl p-6 text-center hover:border-[#B7410E]/50 transition-colors duration-300">
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="video-upload"
                    className={`cursor-pointer block ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="bg-[#FAF3E0] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Video className="w-6 h-6 text-[#B7410E]" />
                    </div>
                    <h3 className="text-base font-semibold text-[#2D2D2D] mb-1">
                        Upload One Video
                    </h3>
                    <p className="text-[#2D2D2D]/70 text-xs">
                        Click to select a single video
                    </p>
                  </label>

                  {videoPreviews.length > 0 && (
                    <div className="mt-4 text-left">
                      <h4 className="text-sm font-semibold text-[#2D2D2D] mb-2">Selected Video</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {videoPreviews.map((preview, index) => (
                          <motion.div
                            key={preview}
                            className="relative group"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <div className="aspect-square bg-gradient-to-br from-[#B7410E]/20 to-[#D4AF37]/20 rounded-xl overflow-hidden relative">
                              <video
                                src={preview}
                                className="w-full h-full object-cover"
                                controls={false}
                                muted
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Video className="w-8 h-8 text-white/80" />
                              </div>
                            </div>
                            <motion.button
                              className="absolute -top-2 -right-2 bg-[#B7410E] text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                              onClick={() => removeVideo(index)}
                              disabled={isUploading}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X className="w-3 h-3" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#2D2D2D]/70">
                        {uploadProgress < 10 ? 'Compressing images...' : 
                         uploadProgress < 70 ? 'Uploading images...' : 
                         uploadProgress < 95 ? 'Uploading videos...' : 
                         'Finalizing...'}
                      </span>
                      <span className="text-sm font-semibold text-[#B7410E]">{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-[#FAF3E0] rounded-full h-2">
                      <motion.div
                        className="bg-[#B7410E] h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    {uploadProgress < 10 && (
                      <p className="text-xs text-[#2D2D2D]/60 mt-1">
                        Optimizing images for faster upload...
                      </p>
                    )}
                  </div>
                )}

              </Card>
            </motion.div>

            {/* Form Section */}
            <motion.div variants={slideInRight}>
              <Card className="h-full">
                <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6 flex items-center">
                  <Tag className="w-6 h-6 mr-3 text-[#B7410E]" />
                  Outfit Details
                </h2>

                <div className="space-y-6">
                  <Input
                    label="Outfit Title"
                    placeholder="e.g., Streetwear Vibes"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />

                  <Input
                    label="Description"
                    placeholder="Tell us about your style inspiration..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Location"
                      placeholder="e.g., Tokyo, Japan"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />

                    <Input
                      label="Price Range"
                      placeholder="e.g., $50-100"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                    />
                  </div>

                  <Input
                    label="Brand/Store"
                    placeholder="Where did you buy this?"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                  />

                  <Input
                    label="Shop Link"
                    placeholder="Paste the product or seller link"
                    value={formData.shopLink}
                    onChange={(e) => handleInputChange('shopLink', e.target.value)}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Size"
                      placeholder="e.g., M or One Size"
                      value={formData.size}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                    />

                    <Input
                      label="Color"
                      placeholder="e.g., Navy / Black"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-[#2D2D2D]">Style Tags</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <select
                        value={styleSelection}
                        onChange={(e) => {
                          addStyleTag(e.target.value);
                          setStyleSelection('');
                        }}
                        className="w-full px-4 py-3 rounded-lg border-2 border-[#8B5E3C]/30 bg-white text-[#2D2D2D] focus:outline-none focus:border-[#B7410E]"
                      >
                        <option value="">Select a style</option>
                        {styleOptions.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customStyle}
                          onChange={(e) => setCustomStyle(e.target.value)}
                          placeholder="Other style"
                          className="w-full px-4 py-3 rounded-lg border-2 border-[#8B5E3C]/30 bg-white text-[#2D2D2D] focus:outline-none focus:border-[#B7410E]"
                        />
                        <Button
                          variant="secondary"
                          onClick={handleCustomStyleAdd}
                          disabled={!customStyle.trim()}
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    {selectedStyles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedStyles.map((style) => (
                          <span
                            key={style}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF3E0] text-[#2D2D2D] rounded-full text-sm border border-[#8B5E3C]/30"
                          >
                            {style}
                            <button
                              type="button"
                              onClick={() => removeStyleTag(style)}
                              className="text-[#B7410E] hover:text-[#8B5E3C]"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-[#2D2D2D]">Hashtags (max 5)</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            addHashtag();
                          }
                        }}
                        placeholder="#StreetStyle"
                        className="w-full px-4 py-3 rounded-lg border-2 border-[#8B5E3C]/30 bg-white text-[#2D2D2D] focus:outline-none focus:border-[#B7410E]"
                        disabled={hashtags.length >= 5}
                      />
                      <Button variant="secondary" onClick={addHashtag} disabled={!hashtagInput.trim() || hashtags.length >= 5}>
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-[#2D2D2D]/70">Press Enter or comma to add a hashtag. Up to 5 hashtags.</p>

                    {hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {hashtags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF3E0] text-[#2D2D2D] rounded-full text-sm border border-[#8B5E3C]/30"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeHashtag(tag)}
                              className="text-[#B7410E] hover:text-[#8B5E3C]"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                        Occasion
                      </label>
                      <select
                        value={formData.occasion}
                        onChange={(e) => handleInputChange('occasion', e.target.value)}
                        className="w-full px-4 py-2 border border-[#8B5E3C]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7410E]"
                      >
                        <option value="">Select occasion</option>
                        <option value="casual">Casual</option>
                        <option value="formal">Formal</option>
                        <option value="party">Party</option>
                        <option value="work">Work</option>
                        <option value="sports">Sports</option>
                        <option value="beach">Beach</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                        Season
                      </label>
                      <select
                        value={formData.season}
                        onChange={(e) => handleInputChange('season', e.target.value)}
                        className="w-full px-4 py-2 border border-[#8B5E3C]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7410E]"
                      >
                        <option value="spring">Spring</option>
                        <option value="summer">Summer</option>
                        <option value="fall">Fall</option>
                        <option value="winter">Winter</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.div 
                    className="pt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleSubmit}
                      disabled={isUploading || (imageFiles.length === 0 && videoFiles.length === 0)}
                      className="w-full"
                    >
                      {isUploading ? (
                        <>
                          <LoadingSpinner size="sm" color="#2D2D2D" />
                          <span className="ml-2">Uploading... {Math.round(uploadProgress)}%</span>
                        </>
                      ) : (
                        <>
                          Share Your Style
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Outfit Uploaded Successfully!"
        size="lg"
      >
        <div className="text-center py-8">
          <motion.div
            className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <ImageIcon className="w-10 h-10 text-[#2D2D2D]" />
          </motion.div>
          
          <h3 className="text-2xl font-bold text-[#2D2D2D] mb-4">
            Your style is now live!
          </h3>
          
          <p className="text-[#2D2D2D]/70 mb-8">
            Your outfit has been shared with the StyleLink community. 
            You can now earn commissions when others shop your looks!
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button
              variant="secondary"
              onClick={() => {
                setShowPreview(false);
                // Reset form
                setFormData({
                  title: '',
                  description: '',
                  location: '',
                  price: '',
                  brand: '',
                  shopLink: '',
                  color: '',
                  size: '',
                  occasion: '',
                  season: 'spring'
                });
                setSelectedStyles([]);
                setStyleSelection('');
                setCustomStyle('');
                setHashtags([]);
                setHashtagInput('');
                setImageFiles([]);
                setVideoFiles([]);
                setImagePreviews([]);
                setVideoPreviews([]);
              }}
            >
              Upload Another
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowPreview(false);
                // Reset form
                setFormData({
                  title: '',
                  description: '',
                  location: '',
                  price: '',
                  brand: '',
                  shopLink: '',
                  color: '',
                  size: '',
                  occasion: '',
                  season: 'spring'
                });
                setSelectedStyles([]);
                setStyleSelection('');
                setCustomStyle('');
                setHashtags([]);
                setHashtagInput('');
                setImageFiles([]);
                setVideoFiles([]);
                setImagePreviews([]);
                setVideoPreviews([]);
                navigate('/profile');
              }}
            >
              View Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UploadOutfit;
