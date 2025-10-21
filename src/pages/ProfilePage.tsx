import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Edit3, 
  Heart, 
  MessageCircle, 
  Share2, 
  ShoppingBag,
  MapPin,
  Calendar,
  Settings,
  Plus,
  ArrowRight,
  User,
  Mail,
  Link as LinkIcon
} from 'lucide-react';
import { Button, Card, Input, Modal, LoadingSpinner } from '../components';
import { useReducedMotion } from '../components/PageTransition';
import { useUser } from '../contexts/UserContext';

// Mock user data - replace with actual user context when backend is implemented
const mockUser = {
  id: '1',
  displayName: 'Alex Chen',
  username: '@alexstyle',
  bio: 'Fashion enthusiast sharing authentic streetwear from Tokyo to NYC. Always on the hunt for unique local brands! 🌟',
  profilePicture: '/api/placeholder/150/150',
  location: 'Tokyo, Japan',
  joinDate: 'March 2023',
  stats: {
    followers: 2847,
    following: 156,
    posts: 42
  },
  isOwnProfile: true // For demo purposes
};

// Mock outfit posts data
const mockOutfitPosts = [
  {
    id: '1',
    image: '/api/placeholder/300/400',
    title: 'Tokyo Streetwear Vibes',
    description: 'Perfect for exploring the city streets',
    likes: 1247,
    comments: 89,
    price: '$89',
    brand: 'Local Tokyo Brand',
    tags: ['streetwear', 'urban', 'casual'],
    createdAt: '2 days ago'
  },
  {
    id: '2',
    image: '/api/placeholder/300/400',
    title: 'Minimalist Monday',
    description: 'Clean lines and neutral tones',
    likes: 892,
    comments: 45,
    price: '$120',
    brand: 'Nordic Design Co',
    tags: ['minimalist', 'scandinavian', 'clean'],
    createdAt: '5 days ago'
  },
  {
    id: '3',
    image: '/api/placeholder/300/400',
    title: 'Vintage Denim Look',
    description: 'Thrifted finds that never go out of style',
    likes: 2156,
    comments: 123,
    price: '$45',
    brand: 'Thrifted',
    tags: ['vintage', 'denim', 'retro'],
    createdAt: '1 week ago'
  },
  {
    id: '4',
    image: '/api/placeholder/300/400',
    title: 'Bohemian Dreams',
    description: 'Flowing fabrics and earthy tones',
    likes: 743,
    comments: 67,
    price: '$65',
    brand: 'Local Artisan',
    tags: ['bohemian', 'flowy', 'colorful'],
    createdAt: '2 weeks ago'
  },
  {
    id: '5',
    image: '/api/placeholder/300/400',
    title: 'Athleisure Perfection',
    description: 'Comfort meets style for active days',
    likes: 1834,
    comments: 98,
    price: '$95',
    brand: 'Aussie Active',
    tags: ['athleisure', 'sporty', 'comfortable'],
    createdAt: '3 weeks ago'
  },
  {
    id: '6',
    image: '/api/placeholder/300/400',
    title: 'Formal Elegance',
    description: 'Business casual that makes a statement',
    likes: 967,
    comments: 34,
    price: '$180',
    brand: 'British Tailoring',
    tags: ['formal', 'elegant', 'business'],
    createdAt: '1 month ago'
  }
];

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    location: user?.location || '',
    profilePicture: user?.profilePicture || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileImage, setProfileImage] = useState<string>(user?.profilePicture || mockUser.profilePicture);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Use user data or fallback to mock data
  const currentUser = user || mockUser;

  // Update profileImage when user context changes
  useEffect(() => {
    if (user?.profilePicture) {
      setProfileImage(user.profilePicture);
    }
  }, [user?.profilePicture]);

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

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0.05 : 0.1,
        delayChildren: 0.1
      }
    }
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!editForm.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    if (!editForm.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (editForm.username && !editForm.username.startsWith('@')) {
      newErrors.username = 'Username must start with @';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Update user context with new data
      updateUser({
        displayName: editForm.displayName,
        username: editForm.username,
        bio: editForm.bio,
        location: editForm.location,
        profilePicture: editForm.profilePicture
      });
      
      setIsLoading(false);
      setIsEditModalOpen(false);
    }, 1500);
  };

  const handleCancelEdit = () => {
    setEditForm({
      displayName: currentUser.displayName,
      username: currentUser.username,
      bio: currentUser.bio,
      location: currentUser.location,
      profilePicture: currentUser.profilePicture
    });
    setErrors({});
    setIsEditModalOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create a URL for the image preview
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      
      // Update the user context with the new image
      updateUser({ profilePicture: imageUrl });
      
      // In a real app, you would upload the file to a server here
      console.log('Profile picture uploaded:', file.name);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0]">
      {/* Profile Header */}
      <section className="py-12 px-4 bg-gradient-to-br from-[#B7410E] to-[#8B5E3C]">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="flex flex-col md:flex-row items-center md:items-start gap-8"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Profile Picture */}
            <motion.div 
              className="relative"
              variants={slideInLeft}
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                <img 
                  src={profileImage || currentUser.profilePicture} 
                  alt={`${currentUser.displayName}'s profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              {currentUser.isOwnProfile && (
                <>
                  <motion.button
                    onClick={triggerFileInput}
                    className="absolute -bottom-2 -right-2 bg-[#D4AF37] text-[#2D2D2D] p-2 rounded-full shadow-lg hover:bg-[#B8860B] transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Change profile picture"
                  >
                    <Camera className="w-4 h-4" />
                  </motion.button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                    aria-label="Upload profile picture"
                  />
                </>
              )}
            </motion.div>

            {/* Profile Info */}
            <motion.div 
              className="flex-1 text-center md:text-left"
              variants={fadeInUp}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {currentUser.displayName}
        </h1>
              <p className="text-xl text-white/90 mb-4">{currentUser.username}</p>
              
              <p className="text-lg text-white/80 mb-6 max-w-2xl leading-relaxed">
                {currentUser.bio}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="w-5 h-5" />
                  <span>{currentUser.location}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="w-5 h-5" />
                  <span>Joined {currentUser.joinDate}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 justify-center md:justify-start mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{currentUser.stats.followers.toLocaleString()}</div>
                  <div className="text-white/80">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{currentUser.stats.following}</div>
                  <div className="text-white/80">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{currentUser.stats.posts}</div>
                  <div className="text-white/80">Posts</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {currentUser.isOwnProfile ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleEditProfile}
                    className="bg-[#D4AF37] text-[#2D2D2D] hover:bg-[#B8860B]"
                  >
                    <Edit3 className="w-5 h-5 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      size="lg"
                      className="bg-[#D4AF37] text-[#2D2D2D] hover:bg-[#B8860B]"
                    >
                      Follow
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="border-white/50 text-white hover:bg-white hover:text-[#2D2D2D]"
                    >
                      Message
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Outfit Posts Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="mb-8"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-2">
              Style Posts
            </h2>
            <p className="text-[#2D2D2D]/70 text-lg">
              {currentUser.isOwnProfile ? 'Your shared looks' : `${currentUser.displayName}'s style collection`}
            </p>
          </motion.div>

          {mockOutfitPosts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              {mockOutfitPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  variants={fadeInUp}
                  className="group"
                >
                  <Card 
                    variant="outfit" 
                    className="overflow-hidden h-full"
                    onClick={() => console.log('Post clicked:', post.id)}
                  >
                    {/* Image Placeholder */}
                    <div className="relative h-80 bg-gradient-to-br from-[#B7410E]/20 to-[#D4AF37]/20 rounded-t-2xl overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <ShoppingBag className="w-16 h-16 text-[#B7410E]/50 mx-auto mb-2" />
                          <p className="text-[#2D2D2D]/60 text-sm">Outfit Image</p>
                        </div>
                      </div>
                      
                      {/* Overlay Actions */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.button
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Like post"
                        >
                          <Heart className="w-4 h-4 text-[#B7410E]" />
                        </motion.button>
                        <motion.button
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Comment on post"
                        >
                          <MessageCircle className="w-4 h-4 text-[#B7410E]" />
                        </motion.button>
                        <motion.button
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Share post"
                        >
                          <Share2 className="w-4 h-4 text-[#B7410E]" />
                        </motion.button>
                      </div>

                      {/* Price Tag */}
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-[#D4AF37] text-[#2D2D2D] font-bold px-3 py-1 rounded-full text-sm">
                          {post.price}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#2D2D2D] mb-2 group-hover:text-[#B7410E] transition-colors duration-300">
                        {post.title}
                      </h3>
                      
                      <p className="text-[#2D2D2D]/70 mb-4 text-sm leading-relaxed">
                        {post.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-[#2D2D2D]/70 text-sm">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                        <span className="text-[#2D2D2D]/50 text-xs">
                          {post.createdAt}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="bg-[#FAF3E0] text-[#8B5E3C] px-2 py-1 rounded-full text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-[#2D2D2D]/70 text-sm font-medium">
                          {post.brand}
                        </span>
                        <Button 
                          variant="primary" 
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          Shop Look
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <div className="bg-white rounded-2xl p-12 max-w-md mx-auto">
                <div className="w-20 h-20 bg-[#FAF3E0] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-10 h-10 text-[#B7410E]" />
                </div>
                <h3 className="text-2xl font-bold text-[#2D2D2D] mb-4">
                  No looks posted yet
                </h3>
                <p className="text-[#2D2D2D]/70 mb-6">
                  Start sharing your style and inspire the StyleLink community!
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => console.log('Navigate to upload')}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Share Your First Look
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        title="Edit Profile"
        size="lg"
      >
        <div className="space-y-6">
          <Input
            label="Display Name"
            placeholder="Enter your display name"
            value={editForm.displayName}
            onChange={(e) => handleInputChange('displayName', e.target.value)}
            error={errors.displayName}
            required
          />

          <Input
            label="Username"
            placeholder="@username"
            value={editForm.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            error={errors.username}
            required
          />

          <Input
            label="Bio"
            placeholder="Tell us about yourself..."
            value={editForm.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
          />

          <Input
            label="Location"
            placeholder="Where are you based?"
            value={editForm.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />

          <div className="flex gap-4 pt-6">
            <Button
              variant="secondary"
              onClick={handleCancelEdit}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
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
    </div>
  );
};

export default ProfilePage;