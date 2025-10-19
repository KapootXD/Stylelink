import React from 'react';
import { useParams } from 'react-router-dom';

const MainFeaturePage: React.FC = () => {
  const { mainFeature } = useParams<{ mainFeature: string }>();

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary-600 mb-4 text-center">
          {mainFeature ? mainFeature.charAt(0).toUpperCase() + mainFeature.slice(1) : 'Main Feature'}
        </h1>
        <p className="text-secondary-600 text-lg text-center">
          Exploring {mainFeature || 'main feature'} on StyleLink
        </p>
      </div>
    </div>
  );
};

export default MainFeaturePage;
