import React, { useEffect, useMemo, useState } from 'react';
import { Crown, Eye, Heart, Loader2, MessageCircle, UserPlus, Users } from 'lucide-react';
import ProtectedFeature from '../components/ProtectedFeature';
import { useAuth } from '../contexts/AuthContext';
import { useAccessControl } from '../hooks/useAccessControl';
import { getActivitiesForUser } from '../services/firebaseService';
import { ActivityRecord } from '../types/activity';

type ActivityTab = 'likes' | 'comments' | 'followers' | 'views';

const ActivityPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { isPremium } = useAccessControl();
  const premiumAccess = isPremium();
  const [activeTab, setActiveTab] = useState<ActivityTab>('likes');
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchActivities = async (): Promise<void> => {
      if (!currentUser) {
        if (isMounted) {
          setActivities([]);
          setError(null);
          setLoading(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setError(null);
          setLoading(true);
        }
        const results = await getActivitiesForUser(currentUser.uid);
        if (isMounted) {
          setActivities(results);
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
        if (isMounted) {
          setError('We were unable to load your activity. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchActivities();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);
  const getActivityIcon = (type: ActivityRecord['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case 'view':
        return <Eye className="h-5 w-5 text-gray-500" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getActivityText = (item: ActivityRecord) => {
    switch (item.type) {
      case 'like':
        return `${item.actorName} liked your post${item.postTitle ? ` "${item.postTitle}"` : ''}`;
      case 'comment':
        return `${item.actorName} commented on your post${item.postTitle ? ` "${item.postTitle}"` : ''}`;
      case 'follow':
        return `${item.actorName} started following you`;
      case 'view':
        return `${item.actorName} viewed your post${item.postTitle ? ` "${item.postTitle}"` : ''}`;
      default:
        return 'Activity';
    }
  };

  const formatTimestamp = (dateValue: Date) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }).format(dateValue);
    } catch (err) {
      console.error('Failed to format timestamp:', err);
      return dateValue.toString();
    }
  };

  const filteredActivities = useMemo(() => {
    const visibleActivities = activities.filter(item => {
      switch (activeTab) {
        case 'likes':
          return item.type === 'like';
        case 'comments':
          return item.type === 'comment';
        case 'followers':
          return item.type === 'follow';
        case 'views':
          return item.type === 'view';
        default:
          return true;
      }
    });

    if (activeTab === 'views' && !premiumAccess) {
      return [];
    }

    return visibleActivities;
  }, [activities, activeTab, premiumAccess]);

  const tabConfig = useMemo(
    () => [
      { key: 'likes', label: 'Likes', count: activities.filter(a => a.type === 'like').length },
      { key: 'comments', label: 'Comments', count: activities.filter(a => a.type === 'comment').length },
      { key: 'followers', label: 'Followers', count: activities.filter(a => a.type === 'follow').length },
      { key: 'views', label: 'Views', count: activities.filter(a => a.type === 'view').length, locked: !premiumAccess }
    ],
    [activities, premiumAccess]
  );

  const renderActivityList = () => {
    if (activeTab === 'views' && !premiumAccess) {
      return (
        <div className="p-6">
          <ProtectedFeature
            feature="premium"
            lockedMessage="Upgrade to Premium to see who is viewing your posts."
            showUpgradePrompt
          >
            <div />
          </ProtectedFeature>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="p-12 text-center text-gray-600 flex flex-col items-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#B7410E]" />
          <p>Loading your latest activity...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-12 text-center text-red-600">
          <p className="font-medium">{error}</p>
        </div>
      );
    }

    if (filteredActivities.length === 0) {
      return (
        <div className="p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} yet</h3>
          <p className="text-gray-500">
            {activeTab === 'likes' && "When people like your posts, they'll appear here."}
            {activeTab === 'comments' && "When people comment on your posts, they'll appear here."}
            {activeTab === 'followers' && "When people follow you, they'll appear here."}
            {activeTab === 'views' && "When people view your posts, they'll appear here."}
          </p>
        </div>
      );
    }
    return filteredActivities.map((item) => (
      <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
        <div className="flex items-start space-x-4">
          {/* Avatar placeholder */}
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#B7410E] to-[#D4AF37] flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {item.actorName.charAt(0)}
              </span>
            </div>
          </div>

          {/* Activity Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              {getActivityIcon(item.type)}
              <p className="text-sm text-gray-900">
                {getActivityText(item)}
                {item.actorUsername && (
                  <span className="text-gray-500 ml-2">({item.actorUsername})</span>
                )}
              </p>
            </div>

            {item.content && (
              <div className="bg-gray-100 rounded-lg p-3 mt-2">
                <p className="text-sm text-gray-700">"{item.content}"</p>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">{formatTimestamp(item.createdAt)}</p>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            <button className="text-[#B7410E] hover:text-[#8B5E3C] text-sm font-medium">
              View
            </button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity</h1>
          <p className="text-gray-600">See your recent likes, comments, followers, and premium-only views.</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
              {tabConfig.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as ActivityTab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-[#B7410E] text-[#B7410E]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } ${tab.locked && !premiumAccess ? 'opacity-70' : ''}`}
                >
                  <span className="inline-flex items-center">
                    {tab.key === 'views' && tab.locked && !premiumAccess && (
                      <Crown className="h-4 w-4 text-yellow-600 mr-1" />
                    )}
                    {tab.label}
                  </span>
                  <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs ${
                    activeTab === tab.key
                      ? 'bg-[#B7410E] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Activity List */}
          <div className="divide-y divide-gray-200">
            {renderActivityList()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
