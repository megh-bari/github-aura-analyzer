import React from 'react';
import { Loader } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
        <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 font-bold animate-pulse">
          Loading GitHub Aura...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;