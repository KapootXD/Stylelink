import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Camera,
  Edit3,
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Calendar,
  Plus,
  ArrowRight
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Button, Card, LoadingSpinner, EditProfileModal } from '../components';
import { useReducedMotion } from '../components/PageTransition';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../config/firebase';
import { searchOutfits } from '../services/apiService';
import { AppUser, OutfitUpload } from '../types';
import toast from 'react-hot-toast';

type ProfileViewData = {
  id: string;
  displayName: string;
  username: string;
  bio: string;
  profilePicture: string;
  location: string;
  joinDate: string;
  usernameChangeCount: number;
  stats: {
    followers: number;
    following: number;
    posts: number;
  };
  isOwnProfile: boolean;
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams<{ userId?: string }>();
  const { currentUser, userProfile, refreshUserProfile, loading: authLoading } = useAuth();
  const previousLocationRef = useRef<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileViewData | null>(null);
  const [profileImage, setProfileImage] = useState<string>('');
  const [outfitPosts, setOutfitPosts] = useState<OutfitUpload[]>([]);
  const [areOutfitsLoading, setAreOutfitsLoading] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const formatDate = (date?: Date | string | number | null) => {
    if (!date) return 'Recently';

    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recently';
    }
  };

  const generateAvatarPlaceholder = (name?: string | null, email?: string | null) => {
    const fallbackName = name || email?.split('@')[0] || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=8B5E3C&color=fff`;
  };

  const buildProfileView = ({
    profile,
    fallbackUser,
    targetId,
    isOwnProfile,
  }: {
    profile?: AppUser | null;
    fallbackUser?: User | null;
    targetId?: string;
    isOwnProfile: boolean;
  }): ProfileViewData => {
    const displayName =
      profile?.displayName ||
      fallbackUser?.displayName ||
      profile?.email ||
      fallbackUser?.email ||
      'User';

    const username = profile?.username
      ? `@${profile.username}`
      : fallbackUser?.email
        ? `@${fallbackUser.email.split('@')[0]}`
        : profile?.email
          ? `@${profile.email.split('@')[0]}`
          : `@${displayName.replace(/\s+/g, '').toLowerCase() || 'user'}`;

    const profilePicture =
      profile?.profilePicture ||
      profile?.photoURL ||
      profile?.avatarUrl ||
      fallbackUser?.photoURL ||
      generateAvatarPlaceholder(displayName, profile?.email || fallbackUser?.email || null);

    const joinDateValue = profile?.createdAt || profile?.joinDate || fallbackUser?.metadata?.creationTime;

    return {
      id: profile?.uid || targetId || fallbackUser?.uid || 'unknown',
      displayName,
      username,
      bio: profile?.bio || 'Tell the community about your style.',
      profilePicture,
      location: profile?.location || 'Add your location',
      joinDate: formatDate(joinDateValue),
      usernameChangeCount: profile?.usernameChangeCount ?? 0,
      stats: profile?.stats || {
        followers: 0,
        following: 0,
        posts: 0,
      },
      isOwnProfile,
    };
  };

  // Determine which user's profile to show
  // If userId param exists, view that user's profile, otherwise view own profile
  const targetUserId = userId || currentUser?.uid;
  const isViewingOwnProfile = !userId || userId === currentUser?.uid;

  // Fetch user profile from Firebase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!targetUserId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const profile = await getUserProfile(targetUserId);

        if (profile) {
          const formattedProfile = buildProfileView({
            profile,
            fallbackUser: currentUser,
            targetId: targetUserId,
            isOwnProfile: isViewingOwnProfile,
          });

          setProfileData(formattedProfile);
          setProfileImage(formattedProfile.profilePicture);
        } else {
          // No profile found, use user context data
          const fallbackProfile = buildProfileView({
            profile: userProfile,
            fallbackUser: currentUser,
            targetId: targetUserId,
            isOwnProfile: isViewingOwnProfile,
          });

          setProfileData(fallbackProfile);
          setProfileImage(fallbackProfile.profilePicture);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
        const fallbackProfile = buildProfileView({
          profile: userProfile,
          fallbackUser: currentUser,
          targetId: targetUserId,
          isOwnProfile: targetUserId === currentUser?.uid,
        });
        setProfileData(fallbackProfile);
        setProfileImage(fallbackProfile.profilePicture);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [targetUserId, currentUser, userProfile, authLoading]);

  // Fetch outfits for the profile user
  useEffect(() => {
    const fetchOutfits = async () => {
      if (!targetUserId) {
        setOutfitPosts([]);
        return;
      }

      try {
        setAreOutfitsLoading(true);
        console.log('📥 Fetching outfits for user:', targetUserId);
        const response = await searchOutfits('', { userId: targetUserId }, 1, 50);

        if (response.status === 'success') {
          console.log(`✅ Loaded ${response.data.outfits.length} outfits for user ${targetUserId}`);
          setOutfitPosts(response.data.outfits || []);
        } else {
          console.warn('⚠️ Failed to load outfits:', response.message);
          setOutfitPosts([]);
        }
      } catch (error) {
        console.error('❌ Error loading outfits:', error);
        toast.error('Failed to load style posts');
        setOutfitPosts([]);
      } finally {
        setAreOutfitsLoading(false);
      }
    };

    if (!authLoading && targetUserId) {
      fetchOutfits();
    }
  }, [targetUserId, authLoading, location.key]); // Added location.key to refresh on navigation

  // Refresh outfits when navigating to profile (e.g., after uploading an outfit)
  useEffect(() => {
    // Check if we just navigated here from upload page
    if (location.state?.fromUpload && targetUserId) {
      console.log('🔄 Refreshing outfits after upload...');
      const fetchOutfits = async () => {
        try {
          const response = await searchOutfits('', { userId: targetUserId }, 1, 50);
          if (response.status === 'success') {
            setOutfitPosts(response.data.outfits || []);
            console.log(`✅ Refreshed: ${response.data.outfits.length} outfits loaded`);
          }
        } catch (error) {
          console.error('Error refreshing outfits:', error);
        }
      };
      // Small delay to ensure Firestore has indexed the new outfit
      setTimeout(fetchOutfits, 1000);
    }
  }, [location.state, targetUserId]);

  useEffect(() => {
    if (!profileData && (userProfile || currentUser) && targetUserId) {
      const baseProfile = buildProfileView({
        profile: userProfile,
        fallbackUser: currentUser,
        targetId: targetUserId,
        isOwnProfile: isViewingOwnProfile,
      });
      setProfileData(baseProfile);
      setProfileImage(baseProfile.profilePicture);
    }
  }, [profileData, userProfile, currentUser, targetUserId, isViewingOwnProfile]);

  // Use Firebase profile data or fallback to user context, but always reflect real post count
  const fallbackProfileData = buildProfileView({
    profile: userProfile,
    fallbackUser: currentUser,
    targetId: targetUserId,
    isOwnProfile: isViewingOwnProfile,
  });

  const baseProfile = profileData || fallbackProfileData;
  const currentUserData: ProfileViewData = {
    ...baseProfile,
    stats: {
      ...baseProfile.stats,
      posts: outfitPosts.length || baseProfile.stats?.posts || 0,
    },
  };

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

  const handleProfileSaved = async () => {
    console.log('🔄 Profile saved, refreshing data...');
    
    // Refresh profile data after save
    await refreshUserProfile();
    
    // Re-fetch profile to get updated data
    if (targetUserId) {
      try {
        console.log('📥 Fetching updated profile for:', targetUserId);
        const profile = await getUserProfile(targetUserId);
        console.log('📥 Fetched profile:', profile);

        if (profile) {
          const formattedProfile = buildProfileView({
            profile,
            fallbackUser: currentUser,
            targetId: targetUserId,
            isOwnProfile: isViewingOwnProfile,
          });

          console.log('✅ Setting profile data:', formattedProfile);
          setProfileData(formattedProfile);
          setProfileImage(formattedProfile.profilePicture);
        } else {
          console.warn('⚠️ No profile returned from getUserProfile');
        }
      } catch (error) {
        console.error('❌ Error refreshing profile:', error);
        toast.error('Profile updated but failed to refresh. Please reload the page.');
      }
    }
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
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-[#B7410E]/20 to-[#D4AF37]/20">
                <img
                  src={profileImage || currentUserData.profilePicture}
                  alt={`${currentUserData.displayName}'s profile`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = generateAvatarPlaceholder(
                      currentUserData.displayName,
                      currentUser?.email || userProfile?.email || null,
                    );
                  }}
                />
              </div>
            </motion.div>

            {/* Profile Info */}
            <motion.div 
              className="flex-1 text-center md:text-left"
              variants={fadeInUp}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {currentUserData.displayName}
              </h1>
              <p className="text-xl text-white/90 mb-4">{currentUserData.username}</p>
              
              <p className="text-lg text-white/80 mb-6 max-w-2xl leading-relaxed">
                {currentUserData.bio}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="w-5 h-5" />
                  <span>{currentUserData.location}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="w-5 h-5" />
                  <span>Joined {currentUserData.joinDate}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 justify-center md:justify-start mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{(currentUserData.stats?.followers || 0).toLocaleString()}</div>
                  <div className="text-white/80">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{currentUserData.stats?.following || 0}</div>
                  <div className="text-white/80">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{currentUserData.stats?.posts || 0}</div>
                  <div className="text-white/80">Posts</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {currentUserData.isOwnProfile && currentUser ? (
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
              {currentUserData.isOwnProfile ? 'Your shared looks' : `${currentUserData.displayName}'s style collection`}
            </p>
          </motion.div>

          {areOutfitsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : outfitPosts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              {outfitPosts.map((post) => {
                const primaryItem = post.items?.[0];
                const priceLabel = primaryItem?.price ? `${primaryItem.currency || 'USD'} ${primaryItem.price}` : null;
                const brandLabel = primaryItem?.brand || 'View details';
                const handleViewLook = () => navigate(
                  `/profile/${post.userId}/outfits/${post.id}`,
                  { state: { outfit: post, seller: currentUserData } }
                );

                return (
                  <motion.div
                    key={post.id}
                    variants={fadeInUp}
                    className="group"
                  >
                    <Card
                      variant="outfit"
                      className="overflow-hidden h-full"
                      onClick={handleViewLook}
                    >
                      <div className="relative h-80 bg-gradient-to-br from-[#B7410E]/10 to-[#D4AF37]/10 rounded-t-2xl overflow-hidden">
                        {post.mainImageUrl ? (
                          <img
                            src={post.mainImageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/api/placeholder/300/400';
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[#2D2D2D]/60">
                            No image available
                          </div>
                        )}

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

                        {priceLabel && (
                          <div className="absolute bottom-4 left-4">
                            <span className="bg-[#D4AF37] text-[#2D2D2D] font-bold px-3 py-1 rounded-full text-sm">
                              {priceLabel}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-[#2D2D2D] mb-2 group-hover:text-[#B7410E] transition-colors duration-300">
                          {post.title}
                        </h3>

                        <p className="text-[#2D2D2D]/70 mb-4 text-sm leading-relaxed line-clamp-3">
                          {post.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-[#2D2D2D]/70 text-sm">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likes.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Share2 className="w-4 h-4" />
                              <span>{post.shares?.toLocaleString?.() || post.shares || 0}</span>
                            </div>
                          </div>
                          <span className="text-[#2D2D2D]/50 text-xs">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.styleTags?.map((tag, tagIndex) => (
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
                            {brandLabel}
                          </span>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewLook();
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            Shop Look
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
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
                  onClick={() => navigate('/upload')}
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
      {currentUser && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleProfileSaved}
          initialData={{
            displayName: currentUserData.displayName,
            username: currentUserData.username?.replace('@', '') || '',
            bio: currentUserData.bio,
            location: currentUserData.location,
            profilePicture: currentUserData.profilePicture,
            usernameChangeCount: currentUserData.usernameChangeCount
          }}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
