
import React from 'react';

const EnvironmentIndicator: React.FC = () => {
  const isProduction = import.meta.env.MODE === 'production';
  
  // Don't show anything in production
  if (isProduction) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-amber-600 text-white text-xs font-medium px-2 py-1 rounded-md opacity-80 z-50">
      DEV
    </div>
  );
};

export default EnvironmentIndicator;
