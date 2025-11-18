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
import { validateFileSize, validateImageType, getFileSize } from '../utils/imageCompression';
import toast from 'react-hot-toast';

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
    tags: '',
    price: '',
    brand: '',
    occasion: '',
    season: 'spring' as 'spring' | 'summer' | 'fall' | 'winter'
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => file.type.startsWith('video/'));
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setVideoFiles(prev => [...prev, ...newFiles]);
      setVideoPreviews(prev => [...prev, ...newPreviews]);
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

    if (imageFiles.length === 0 && videoFiles.length === 0) {
      toast.error('Please upload at least one image or video');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter an outfit title');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Parse style tags
      const styleTags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      // Create outfit with media
      const outfit = await createOutfitWithMedia(
        {
          title: formData.title,
          description: formData.description,
          occasion: formData.occasion || 'casual',
          season: formData.season,
          styleTags,
          items: [], // Can be added later
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
      setShowPreview(true);
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
                        Click to select images
                      </p>
                    </label>
                  </div>

                  {/* Video Upload Area */}
                  <div className="border-2 border-dashed border-[#8B5E3C]/30 rounded-2xl p-6 text-center hover:border-[#B7410E]/50 transition-colors duration-300">
                    <input
                      ref={videoInputRef}
                      type="file"
                      multiple
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
                        Upload Videos
                      </h3>
                      <p className="text-[#2D2D2D]/70 text-xs">
                        Click to select videos
                      </p>
                    </label>
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

                {/* Image Preview Grid */}
                {imagePreviews.length > 0 && (
                  <motion.div 
                    className="mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-sm font-semibold text-[#2D2D2D] mb-3">Images ({imagePreviews.length})</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <motion.div
                          key={index}
                          className="relative group"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <div className="aspect-square bg-gradient-to-br from-[#B7410E]/20 to-[#D4AF37]/20 rounded-xl overflow-hidden">
                            <img 
                              src={preview} 
                              alt={`Image ${index + 1}`}
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
                  </motion.div>
                )}

                {/* Video Preview Grid */}
                {videoPreviews.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-sm font-semibold text-[#2D2D2D] mb-3">Videos ({videoPreviews.length})</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {videoPreviews.map((preview, index) => (
                        <motion.div
                          key={index}
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
                  </motion.div>
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
                    label="Style Tags"
                    placeholder="e.g., streetwear, casual, vintage (comma-separated)"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                  />

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
                  tags: '',
                  price: '',
                  brand: '',
                  occasion: '',
                  season: 'spring'
                });
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
                  tags: '',
                  price: '',
                  brand: '',
                  occasion: '',
                  season: 'spring'
                });
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
