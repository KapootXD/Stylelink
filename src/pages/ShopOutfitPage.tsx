import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, ShieldCheck, ShoppingBag, Sparkles, Tag } from 'lucide-react';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { OutfitUpload } from '../types';
import { getOutfitById } from '../services/apiService';
import { searchOfflineOutfits } from '../utils/offlineOutfits';
import { demoUsers } from '../data/demoData';
import toast from 'react-hot-toast';

type LocationState = {
  outfit?: OutfitUpload;
  seller?: {
    displayName?: string;
    username?: string;
    profilePicture?: string;
    bio?: string;
    location?: string;
  };
};

const ShopOutfitPage: React.FC = () => {
  const { userId, outfitId } = useParams<{ userId: string; outfitId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as LocationState) || {};

  const [outfit, setOutfit] = useState<OutfitUpload | null>(locationState.outfit || null);
  const [isLoading, setIsLoading] = useState(!locationState.outfit);
  const [error, setError] = useState('');

  const sellerProfile = useMemo(() => {
    const demoSeller = demoUsers.find((user) => user.id === (userId || outfit?.userId));

    return {
      displayName:
        locationState.seller?.displayName ||
        demoSeller?.displayName ||
        'StyleLink Seller',
      username:
        locationState.seller?.username ||
        (demoSeller?.username ? `@${demoSeller.username}` : userId ? `@${userId}` : '@seller'),
      profilePicture:
        locationState.seller?.profilePicture ||
        demoSeller?.avatarUrl ||
        outfit?.mainImageUrl ||
        '/api/placeholder/200/200',
      bio: locationState.seller?.bio || demoSeller?.bio || 'Curating pieces they love so you can shop the whole look.',
      location: locationState.seller?.location || 'Ships worldwide'
    };
  }, [locationState.seller, outfit?.mainImageUrl, userId]);

  const priceLabel = useMemo(() => {
    if (!outfit) return '';
    const totalPrice = outfit.items.reduce((sum, item) => sum + (item.price || 0), 0);
    return totalPrice > 0
      ? `${outfit.items[0]?.currency || 'USD'} ${totalPrice.toFixed(0)}`
      : 'See item pricing';
  }, [outfit]);

  useEffect(() => {
    const loadOutfit = async () => {
      if (!outfitId || outfit) return;

      setIsLoading(true);
      setError('');

      try {
        const response = await getOutfitById(outfitId);
        if (response.status === 'success' && response.data) {
          setOutfit(response.data);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Falling back to offline outfits:', err);
      }

      try {
        const offlineMatch = searchOfflineOutfits('', {}, 1, 200).outfits.find((o) => o.id === outfitId);
        if (offlineMatch) {
          setOutfit(offlineMatch);
          setIsLoading(false);
          return;
        }
      } catch (offlineError) {
        console.error('Unable to load outfit offline:', offlineError);
      }

      setError('We could not find this look. Please try again from the Discover feed.');
      setOutfit(null);
      setIsLoading(false);
    };

    loadOutfit();
  }, [outfit, outfitId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF3E0] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!outfit || error) {
    return (
      <div className="min-h-screen bg-[#FAF3E0] flex items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center">
          <Sparkles className="w-12 h-12 text-[#B7410E] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">Look unavailable</h2>
          <p className="text-[#2D2D2D]/70 mb-6">{error || 'This look could not be found.'}</p>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3E0]">
      {/* Hero / Seller info */}
      <section className="bg-gradient-to-br from-[#B7410E] to-[#8B5E3C] text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to profile
            </button>
            <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-sm">
              <ShieldCheck className="w-4 h-4" />
              Trusted seller experience
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/40 shadow-lg">
                <img
                  src={sellerProfile.profilePicture}
                  alt={sellerProfile.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-white/80">{sellerProfile.username}</p>
                <h1 className="text-3xl font-bold leading-tight">{sellerProfile.displayName}</h1>
                <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{sellerProfile.location}</span>
                </div>
              </div>
            </div>
            <div className="max-w-xl text-white/80">{sellerProfile.bio}</div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 pb-12">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-[#E6D8C5]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Visual */}
            <div className="relative bg-gradient-to-b from-[#FAF3E0] to-white">
              <div className="p-6">
                <div className="rounded-2xl overflow-hidden shadow-xl border border-[#F1E6D6]">
                  <img
                    src={outfit.mainImageUrl}
                    alt={outfit.title}
                    className="w-full h-[480px] object-cover"
                  />
                </div>
              </div>
              <div className="absolute top-6 right-6">
                <div className="bg-white/90 backdrop-blur-sm text-[#2D2D2D] px-4 py-2 rounded-full shadow">
                  <ShoppingBag className="w-4 h-4 inline mr-2 text-[#B7410E]" />
                  {priceLabel}
                </div>
              </div>
              <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                {outfit.styleTags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-white/80 text-[#8B5E3C] px-3 py-1 rounded-full text-xs font-semibold shadow"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Shop this look</p>
                <h2 className="text-3xl font-bold text-[#2D2D2D]">{outfit.title}</h2>
                <p className="text-gray-700 leading-relaxed">{outfit.description}</p>
              </div>

              <div className="bg-[#FAF3E0] border border-[#E6D8C5] rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#8B5E3C]">Full look total</p>
                    <p className="text-2xl font-bold text-[#2D2D2D]">{priceLabel}</p>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-[#B7410E] hover:bg-[#8B2F0B] text-white shadow-lg"
                    onClick={() => toast.success('Checkout coming soon')}
                  >
                    Buy from seller
                  </Button>
                </div>
                <p className="text-xs text-[#8B5E3C] mt-2">
                  Secure checkout and order tracking are on the way. For now, review the pieces below.
                </p>
              </div>

              <div className="space-y-4">
                {outfit.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border border-[#F1E6D6] rounded-2xl bg-white shadow-sm"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover border border-[#E6D8C5]"
                    />
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-[#2D2D2D]">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span>{item.color}</span>
                        {item.size && <span>| Size {item.size}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#2D2D2D]">
                        {item.currency || 'USD'} {item.price}
                      </p>
                      <a
                        href={item.directLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-[#B7410E] hover:underline mt-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        View item
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#B7410E]" />
                <div className="text-sm text-gray-700">
                  Every outfit comes straight from the seller&rsquo;s closet or shop. Buying keeps their style flowing.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOutfitPage;
