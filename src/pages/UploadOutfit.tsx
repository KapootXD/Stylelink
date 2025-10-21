import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Tag, 
  DollarSign,
  ArrowRight,
  X,
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import { Button, Card, Input, LoadingSpinner, Modal } from '../components';
import { useReducedMotion } from '../components/PageTransition';

const UploadOutfit: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    tags: '',
    price: '',
    brand: ''
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
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
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setShowPreview(true);
    }, 3000);
  };

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
            {/* Image Upload Section */}
            <motion.div variants={slideInLeft}>
              <Card className="h-full">
                <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6 flex items-center">
                  <Camera className="w-6 h-6 mr-3 text-[#B7410E]" />
                  Upload Photos
                </h2>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-[#8B5E3C]/30 rounded-2xl p-8 text-center mb-6 hover:border-[#B7410E]/50 transition-colors duration-300">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label 
                    htmlFor="image-upload"
                    className="cursor-pointer block"
                  >
                    <div className="bg-[#FAF3E0] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-[#B7410E]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#2D2D2D] mb-2">
                      Click to upload photos
                    </h3>
                    <p className="text-[#2D2D2D]/70 text-sm">
                      Drag and drop or click to select multiple images
                    </p>
                  </label>
                </div>

                {/* Image Preview Grid */}
                {uploadedImages.length > 0 && (
                  <motion.div 
                    className="grid grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {uploadedImages.map((image, index) => (
                      <motion.div
                        key={index}
                        className="relative group"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="aspect-square bg-gradient-to-br from-[#B7410E]/20 to-[#D4AF37]/20 rounded-xl overflow-hidden">
                          <img 
                            src={image} 
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <motion.button
                          className="absolute -top-2 -right-2 bg-[#B7410E] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          onClick={() => removeImage(index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    ))}
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
                    placeholder="e.g., streetwear, casual, vintage"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                  />

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
                      disabled={isUploading || uploadedImages.length === 0}
                      className="w-full"
                    >
                      {isUploading ? (
                        <>
                          <LoadingSpinner size="sm" color="#2D2D2D" />
                          <span className="ml-2">Uploading...</span>
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
              onClick={() => setShowPreview(false)}
            >
              Upload Another
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowPreview(false);
                // Navigate to profile or explore
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
