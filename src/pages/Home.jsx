import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github, Zap, Sparkles, ExternalLink, Twitter } from "lucide-react";
import LoadingScreen from "./LoadingScreen"; // Add this import at the top

const Home = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add this state
  const navigate = useNavigate();

  useEffect(() => {
    // This will handle the initial loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

  const handleAnalyze = () => {
    if (username.trim()) {
      navigate(`/result/${username}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAnalyze();
    }
  };

  // Show loading screen while loading
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Rest of your component remains exactly the same
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative">
      {/* Built by tag */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50">
        <a
          href="https://github.com/megh-bari"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
        >
          <span className="font-medium">Built by megh-bari</span>
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
        </a>
      </div>

      {/* Rest of your existing JSX */}
      {/* Header - Always horizontal navbar */}
      <header className="p-3 sm:p-6 max-w-7xl mx-auto">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
            <Github className="w-5 h-5 sm:w-7 sm:h-7 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
            <div className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 whitespace-nowrap">
              GitHub Aura
            </div>
          </div>
          <div className="z-10">
            <a
              href="https://twitter.com/megh_bari"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 text-xs sm:text-base"
            >
              <span className="font-medium whitespace-nowrap">Follow Me</span>
              <Twitter className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center p-3 sm:p-4 min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-88px)]">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-pattern"></div>
        <Card className="w-full max-w-[95%] sm:max-w-md bg-gray-900 border-2 border-purple-500/30 shadow-2xl relative z-10 transform hover:scale-[1.02] transition-all duration-500">
          <CardHeader className="text-center pb-3 sm:pb-4">
            <div className="flex justify-center mb-3 sm:mb-4">
              <Sparkles className="w-12 h-12 sm:w-14 sm:h-14 text-purple-400 animate-pulse" />
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
              GitHub Aura
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-300 flex items-center justify-center">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-yellow-400" />
              Unveil the unique essence of GitHub profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="relative group">
              <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
              <Input
                placeholder="Enter GitHub username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-9 sm:pl-10 bg-gray-800 border-purple-500/30 focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500 transition-all duration-300 text-sm sm:text-base"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={!username.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 font-medium py-4 sm:py-6 text-sm sm:text-base"
            >
              Analyze Profile
            </Button>
          </CardContent>
          <CardFooter className="text-center justify-center px-4 py-3 sm:px-6 sm:py-4">
            <p className="text-[10px] sm:text-xs text-gray-400">
              Powered by GitHub API & AI-Driven Insights
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Home;