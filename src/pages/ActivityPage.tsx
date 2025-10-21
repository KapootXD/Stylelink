import React, { useState } from 'react';
import { Heart, MessageCircle, UserPlus, Eye, Users } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'view';
  user: {
    name: string;
    username: string;
    avatar?: string;
  };
  content?: string;
  postTitle?: string;
  timestamp: string;
}

const ActivityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'likes' | 'comments' | 'followers' | 'views'>('likes');

  // Mock data - in a real app, this would come from an API
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'like',
      user: { name: 'Sarah Johnson', username: '@sarahj', avatar: '' },
      postTitle: 'Summer Streetwear Look',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'comment',
      user: { name: 'Mike Chen', username: '@mikechen', avatar: '' },
      content: 'Love this outfit! Where did you get the jacket?',
      postTitle: 'Denim & Sneakers Combo',
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      type: 'follow',
      user: { name: 'Emma Wilson', username: '@emmaw', avatar: '' },
      timestamp: '6 hours ago'
    },
    {
      id: '4',
      type: 'view',
      user: { name: 'Alex Rodriguez', username: '@alexr', avatar: '' },
      postTitle: 'Vintage 90s Style',
      timestamp: '1 day ago'
    },
    {
      id: '5',
      type: 'like',
      user: { name: 'Jordan Lee', username: '@jordanl', avatar: '' },
      postTitle: 'Minimalist Fashion',
      timestamp: '2 days ago'
    }
  ];

  const getActivityIcon = (type: string) => {
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

  const getActivityText = (item: ActivityItem) => {
    switch (item.type) {
      case 'like':
        return `${item.user.name} liked your post "${item.postTitle}"`;
      case 'comment':
        return `${item.user.name} commented on your post "${item.postTitle}"`;
      case 'follow':
        return `${item.user.name} started following you`;
      case 'view':
        return `${item.user.name} viewed your post "${item.postTitle}"`;
      default:
        return 'Activity';
    }
  };

  const filteredActivities = activities.filter(item => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity</h1>
          <p className="text-gray-600">See all your recent likes, comments, followers, and views</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'likes', label: 'Likes', count: activities.filter(a => a.type === 'like').length },
                { key: 'comments', label: 'Comments', count: activities.filter(a => a.type === 'comment').length },
                { key: 'followers', label: 'Followers', count: activities.filter(a => a.type === 'follow').length },
                { key: 'views', label: 'Views', count: activities.filter(a => a.type === 'view').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-[#B7410E] text-[#B7410E]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
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
            {filteredActivities.length > 0 ? (
              filteredActivities.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Avatar placeholder */}
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#B7410E] to-[#D4AF37] flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {item.user.name.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {getActivityIcon(item.type)}
                        <p className="text-sm text-gray-900">
                          {getActivityText(item)}
                        </p>
                      </div>
                      
                      {item.content && (
                        <div className="bg-gray-100 rounded-lg p-3 mt-2">
                          <p className="text-sm text-gray-700">"{item.content}"</p>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">{item.timestamp}</p>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <button className="text-[#B7410E] hover:text-[#8B5E3C] text-sm font-medium">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} yet</h3>
                <p className="text-gray-500">
                  {activeTab === 'likes' && "When people like your posts, they'll appear here."}
                  {activeTab === 'comments' && "When people comment on your posts, they'll appear here."}
                  {activeTab === 'followers' && "When people follow you, they'll appear here."}
                  {activeTab === 'views' && "When people view your profile, they'll appear here."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
