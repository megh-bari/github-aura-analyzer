import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Activity,
  BookOpen,
  Download,
  Share2,
  Twitter,
  ArrowLeft,
  Star,
  GitBranch,
} from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import ReactPlayer from "react-player";

const Result = () => {
  // const audioRef = useRef(null); // Ref for the audio element

  // const playMusic = () => {
  //   if (audioRef.current) {
  //     audioRef.current.play();
  //   }
  // };

  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const profileCardRef = useRef(null);

  // Comprehensive Aura Determination Function
  // Comprehensive Aura Determination Function
const determineAura = (profile, repos) => {
  const { followers, public_repos, bio } = profile;
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const forkRatio = repos.filter((repo) => repo.fork).length / repos.length;

  // Complex Aura Determination Logic
  if (followers > 10000 && totalStars > 5000) {
    return {
      type: "Global Tech Icon",
      description: "An unparalleled leader in the tech world with immense influence.",
      color: "bg-gradient-to-r from-red-600 to-yellow-600",
    };
  }

  if (followers > 5000 && totalStars > 1000) {
    return {
      type: "Tech Influencer",
      description: "A highly recognized developer with massive community impact and thought leadership.",
      color: "bg-gradient-to-r from-blue-600 to-purple-600",
    };
  }

  if (followers > 1000 && totalStars > 500) {
    return {
      type: "Rising Star",
      description: "A rapidly growing developer with increasing influence.",
      color: "bg-gradient-to-r from-orange-600 to-red-600",
    };
  }

  if (followers > 500 && followers <= 1000) {
    return {
      type: "Growing Contributor",
      description: "A developer with a growing impact and a steadily increasing follower base.",
      color: "bg-gradient-to-r from-green-600 to-teal-500",
    };
  }

  if (followers > 50 && followers <= 500) {
    return {
      type: "Budding Developer",
      description: "An emerging developer with potential for significant growth.",
      color: "bg-gradient-to-r from-indigo-600 to-pink-500",
    };
  }

  if (bio && (bio.toLowerCase().includes("open source") || bio.toLowerCase().includes("contributor"))) {
    return {
      type: "Community Builder",
      description: "Passionate about collaborative development and knowledge sharing.",
      color: "bg-gradient-to-r from-green-600 to-teal-500",
    };
  }

  if (public_repos > 50 && totalStars > 500) {
    return {
      type: "Prolific Creator",
      description: "A consistently productive developer with a diverse and impactful portfolio.",
      color: "bg-gradient-to-r from-indigo-600 to-pink-500",
    };
  }

  if (forkRatio > 0.5) {
    return {
      type: "Collaborative Innovator",
      description: "Skilled at building upon and improving existing projects.",
      color: "bg-gradient-to-r from-yellow-600 to-orange-500",
    };
  }

  return {
    type: "Aspiring Developer",
    description: "A developer at the beginning of their journey, ready to learn and grow.",
    color: "bg-gradient-to-r from-gray-500 to-black-500",
  };
};


  // Download profile as image
  const downloadProfileImage = async () => {
    if (profileCardRef.current) {
      try {
        const canvas = await html2canvas(profileCardRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
        });

        const link = document.createElement("a");
        link.download = `${username}_github_aura.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        toast.success("Profile image downloaded successfully!");
      } catch (error) {
        console.error("Error downloading image:", error);
        toast.error("Failed to download profile image");
      }
    }
  };

  // Share on Twitter
const shareOnTwitter = () => {
  if (profile) {
    const text = encodeURIComponent(
      `🚀 Just discovered my GitHub Aura! I'm a ${profile.aura.type} 🌟\n\n` +
        `Discover your GitHub Aura at: https://github-aura-analyzer.com\n\n` +
        `#GitHubAura #DeveloperProfile`
    );
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank");
  }
};


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch(
          `https://api.github.com/users/${username}`,
          {
            headers: {
              Authorization: `token ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Profile not found");
        }

        const userData = await userResponse.json();

        // Fetch user repositories
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100`,
          {
            headers: {
              Authorization: `token ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        const reposData = await reposResponse.json();

        // Determine Aura
        const completeProfile = {
          ...userData,
          aura: determineAura(userData, reposData),
        };

        // playMusic(); // Play music when data is successfully fetched

        setProfile(completeProfile);
        setRepos(reposData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message);
        setLoading(false);
        toast.error("Failed to fetch GitHub profile");
      }
    };

    fetchProfileData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-white animate-pulse text-2xl">
          Analyzing GitHub Profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">{error}</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-2 sm:p-4 md:p-6">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-pattern"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Responsive header buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto bg-gray-900/50 text-white border-purple-500/30 hover:bg-gray-500/50 hover:text-white"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
            <Button
              onClick={downloadProfileImage}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="mr-2 w-4 h-4" /> Download
            </Button>
            <Button
              onClick={shareOnTwitter}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Twitter className="mr-2 w-4 h-4" /> Share
            </Button>
          </div>
        </div>

        {/* Main Card */}
        <Card
          ref={profileCardRef}
          className="bg-gray-900/80 backdrop-blur-lg border-2 border-purple-500/30 shadow-2xl"
        >
          <CardHeader className="text-center p-4 sm:p-6">
            <div className="flex justify-center mb-4">
              <img
                src={profile?.avatar_url}
                alt={profile?.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-purple-500 shadow-lg"
              />
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
              {profile?.name || profile?.login}
              <div className="text-gray-400 text-base sm:text-lg mt-1 sm:mt-0 sm:ml-2 sm:inline">
                @{profile?.login}
              </div>
            </CardTitle>
            <p className="text-gray-300 text-sm sm:text-base">
              {profile?.bio || "No bio available"}
            </p>
            <Badge className={`mt-4 ${profile?.aura?.color} text-white text-xs sm:text-sm`}>
              {profile?.aura?.type} Aura
            </Badge>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6">
              <StatCard
                icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
                label="Followers"
                value={profile?.followers}
              />
              <StatCard
                icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
                label="Following"
                value={profile?.following}
              />
              <StatCard
                icon={<BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />}
                label="Repositories"
                value={profile?.public_repos}
              />
              <StatCard
                icon={<Star className="w-4 h-4 sm:w-5 sm:h-5" />}
                label="Total Stars"
                value={repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
              />
            </div>

            {/* Analysis Card */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20">
              <CardContent className="p-4">
                <h3 className="text-lg sm:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
                  Aura Analysis
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  {profile?.aura?.description}
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-purple-400 text-sm sm:text-base mb-2">
                      Top Repositories
                    </h4>
                    {repos
                      .sort((a, b) => b.stargazers_count - a.stargazers_count)
                      .slice(0, 3)
                      .map((repo) => (
                        <div
                          key={repo.id}
                          className="flex items-center space-x-2 text-gray-300 text-xs sm:text-sm mb-2"
                        >
                          <GitBranch className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-purple-300 truncate"
                          >
                            {repo.name}
                            <span className="ml-2 text-yellow-400">
                              ★ {repo.stargazers_count}
                            </span>
                          </a>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm p-2 sm:p-4 rounded-lg text-center border border-purple-500/20">
    <div className="flex items-center justify-center text-purple-400 mb-1 sm:mb-2">
      {icon}
    </div>
    <div className="text-lg sm:text-2xl font-bold text-white mb-1">
      {value?.toLocaleString()}
    </div>
    <div className="text-xs sm:text-sm text-gray-400">{label}</div>
  </div>
);
export default Result;
