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
  Award,
  TrendingUp,
} from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

const Result = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contributions, setContributions] = useState({
    total: 0,
    yearTotal: 0,
  });
  const [totalStars, setTotalStars] = useState(0);
  const profileCardRef = useRef(null);

  const determineAura = (profile, repos) => {
  const { followers, public_repos, bio, created_at, login } = profile;
  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );
  const forkRatio = repos.filter((repo) => repo.fork).length / repos.length;
  const totalWatchers = repos.reduce(
    (sum, repo) => sum + repo.watchers_count,
    0
  );
  const hasPopularRepo = repos.some(repo => repo.stargazers_count > 1000);
  const accountAge = new Date().getFullYear() - new Date(created_at).getFullYear();
  
  // Calculate language distribution
  const languageStats = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});
  const primaryLanguage = Object.entries(languageStats)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  // Calculate commit frequency (approximation based on repo update dates)
  const activeRepos = repos.filter(repo => 
    new Date(repo.updated_at) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  ).length;

  // Legendary Tier (100k+ followers)
  if (followers > 100000) {
    if (totalStars > 100000) {
      return {
        type: "Tech Luminary",
        description: "A transcendent figure whose work has revolutionized the tech industry.",
        color: "bg-gradient-to-r from-yellow-300 via-purple-600 to-red-700",
        tier: "legendary",
      };
    }
    return {
      type: "Tech Icon",
      description: "An inspirational leader with global influence in technology.",
      color: "bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600",
      tier: "legendary",
    };
  }

  // Elite Tier (50k-100k followers)
  if (followers > 50000) {
    if (totalStars > 50000) {
      return {
        type: "Tech Virtuoso",
        description: "A masterful developer whose innovations shape the future of technology.",
        color: "bg-gradient-to-r from-purple-600 via-pink-500 to-red-500",
        tier: "elite",
      };
    }
    return {
      type: "Tech Maestro",
      description: "A distinguished leader with extraordinary impact on the developer community.",
      color: "bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500",
      tier: "elite",
    };
  }

  // Master Tier (10k-50k followers)
  if (followers > 10000) {
    if (totalStars > 25000) {
      return {
        type: "Tech Maven",
        description: "A visionary developer whose work inspires countless others.",
        color: "bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500",
        tier: "master",
      };
    }
    if (hasPopularRepo) {
      return {
        type: "Innovation Leader",
        description: "A pioneering developer known for groundbreaking projects.",
        color: "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500",
        tier: "master",
      };
    }
    return {
      type: "Community Leader",
      description: "A respected figure with significant influence in tech communities.",
      color: "bg-gradient-to-r from-green-600 via-teal-500 to-blue-500",
      tier: "master",
    };
  }

  // Expert Tier (5k-10k followers)
  if (followers > 5000) {
    if (totalStars > 10000) {
      return {
        type: "Tech Innovator",
        description: "A creative force driving technological advancement.",
        color: "bg-gradient-to-r from-purple-600 via-pink-500 to-red-500",
        tier: "expert",
      };
    }
    if (activeRepos > 10) {
      return {
        type: "Active Mentor",
        description: "A dedicated developer fostering growth in the community.",
        color: "bg-gradient-to-r from-green-500 via-teal-500 to-blue-500",
        tier: "expert",
      };
    }
    return {
      type: "Tech Authority",
      description: "An established expert with proven expertise and influence.",
      color: "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500",
      tier: "expert",
    };
  }

  // Advanced Tier (2k-5k followers)
  if (followers > 2000) {
    if (totalStars > 5000) {
      return {
        type: "Rising Innovator",
        description: "An emerging tech leader with innovative contributions.",
        color: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500",
        tier: "advanced",
      };
    }
    if (public_repos > 100) {
      return {
        type: "Prolific Builder",
        description: "A highly productive developer with diverse project experience.",
        color: "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
        tier: "advanced",
      };
    }
    return {
      type: "Community Catalyst",
      description: "A developer accelerating community growth and collaboration.",
      color: "bg-gradient-to-r from-green-500 via-teal-500 to-blue-500",
      tier: "advanced",
    };
  }

  // Established Tier (1k-2k followers)
  if (followers > 1000) {
    if (totalStars > 2000) {
      return {
        type: "Project Virtuoso",
        description: "A skilled developer known for high-quality projects.",
        color: "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500",
        tier: "established",
      };
    }
    if (forkRatio > 0.5) {
      return {
        type: "Collaboration Expert",
        description: "A developer excelling in collaborative development.",
        color: "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
        tier: "established",
      };
    }
    return {
      type: "Respected Developer",
      description: "A developer with proven expertise and growing influence.",
      color: "bg-gradient-to-r from-green-500 via-teal-500 to-blue-500",
      tier: "established",
    };
  }

  // Growing Tier (500-1k followers)
  if (followers > 500) {
    if (activeRepos > 5) {
      return {
        type: "Active Innovator",
        description: "A consistently contributing developer with growing impact.",
        color: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500",
        tier: "growing",
      };
    }
    if (public_repos > 50) {
      return {
        type: "Project Explorer",
        description: "A curious developer with diverse technical interests.",
        color: "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
        tier: "growing",
      };
    }
    return {
      type: "Rising Developer",
      description: "A developer steadily building their reputation.",
      color: "bg-gradient-to-r from-green-500 via-teal-500 to-blue-500",
      tier: "growing",
    };
  }

  // Active Tier (100-500 followers)
  if (followers > 100) {
    if (totalStars > 500) {
      return {
        type: "Emerging Creator",
        description: "A promising developer with notable project success.",
        color: "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500",
        tier: "active",
      };
    }
    if (accountAge > 3) {
      return {
        type: "Seasoned Contributor",
        description: "A consistent long-term contributor to the community.",
        color: "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
        tier: "active",
      };
    }
    return {
      type: "Active Builder",
      description: "An engaged developer actively growing their skills.",
      color: "bg-gradient-to-r from-green-500 via-teal-500 to-blue-500",
      tier: "active",
    };
  }

  // Special Categories
  if (public_repos > 100 && totalStars > 1000) {
    return {
      type: "Project Maestro",
      description: "A developer with an impressive portfolio of valuable projects.",
      color: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500",
      tier: "special",
    };
  }

  if (forkRatio > 0.7 && public_repos > 30) {
    return {
      type: "Open Source Advocate",
      description: "A developer dedicated to collaborative improvement.",
      color: "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500",
      tier: "special",
    };
  }

  // Language Specialist Categories
  if (primaryLanguage && public_repos > 20) {
    return {
      type: `${primaryLanguage} Specialist`,
      description: `A focused developer with expertise in ${primaryLanguage}.`,
      color: "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
      tier: "specialist",
    };
  }

  // Emerging Tier (default)
  if (accountAge < 1) {
    return {
      type: "Fresh Explorer",
      description: "A newcomer embarking on their development journey.",
      color: "bg-gradient-to-r from-gray-500 via-slate-500 to-gray-600",
      tier: "emerging",
    };
  }

  return {
    type: "Code Explorer",
    description: "A developer discovering their path in the tech world.",
    color: "bg-gradient-to-r from-gray-500 via-slate-500 to-gray-600",
    tier: "emerging",
  };
};

const calculateAuraPoints = (profile, repos) => {
  const { followers, public_repos, created_at } = profile;
  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );
  const totalWatchers = repos.reduce(
    (sum, repo) => sum + repo.watchers_count,
    0
  );
  const accountAge = new Date().getFullYear() - new Date(created_at).getFullYear();
  const activeRepos = repos.filter(repo => 
    new Date(repo.updated_at) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  ).length;

  let points = 0;
  
  // Follower points (max 400 points)
  points += Math.min(followers, 100000) / 250;
  
  // Stars points (max 300 points)
  points += Math.min(totalStars, 50000) / 167;
  
  // Repository points (max 100 points)
  points += Math.min(public_repos, 500) * 0.2;
  
  // Watchers points (max 50 points)
  points += Math.min(totalWatchers, 10000) / 200;
  
  // Active repos bonus (max 50 points)
  points += activeRepos * 2;
  
  // Account age bonus (max 50 points)
  points += Math.min(accountAge * 5, 50);

  // Exceptional achievements bonuses
  if (followers > 50000) points += 100;
  if (totalStars > 25000) points += 100;
  if (public_repos > 300) points += 50;
  if (activeRepos > 20) points += 50;
  if (totalWatchers > 5000) points += 50;

  return Math.min(Math.round(points), 1000);
};
  // const downloadProfileImage = async () => {
  //   if (profileCardRef.current) {
  //     try {
  //       toast.loading("Generating image...");

  //       const canvas = await html2canvas(profileCardRef.current, {
  //         scale: 2,
  //         useCORS: true,
  //         backgroundColor: "#fff",
  //         logging: false,
  //         windowWidth: profileCardRef.current.scrollWidth,
  //         windowHeight: profileCardRef.current.scrollHeight,
  //         allowTaint: true,
  //       });

  //       const tempCanvas = document.createElement("canvas");
  //       const ctx = tempCanvas.getContext("2d");
  //       const padding = 40;

  //       tempCanvas.width = canvas.width + padding * 2;
  //       tempCanvas.height = canvas.height + padding * 2;

  //       ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height); // Clear any previous fill
  //       ctx.fillStyle = "white"; // Add background fill if needed
  //       ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  //       ctx.drawImage(canvas, padding, padding);

  //       const link = document.createElement("a");
  //       link.download = `${username}_github_aura.png`;
  //       link.href = tempCanvas.toDataURL("image/png");
  //       link.click();

  //       toast.dismiss();
  //       toast.success("Profile image downloaded successfully!");
  //     } catch (error) {
  //       console.error("Error downloading image:", error);
  //       toast.error("Failed to download profile image");
  //     }
  //   }
  // };

  const shareOnTwitter = () => {
    if (profile) {
      const auraPoints = calculateAuraPoints(profile, repos);
      const text = encodeURIComponent(
        `🚀 Just discovered my GitHub Aura! I'm a ${profile.aura.type} 🌟 with 🏅 ${auraPoints} Aura Points!\n\n` +
          `Discover your GitHub Aura at: https://github-aura-analyzer.vercel.app/\n\n` +
          `#GitHubAura #DeveloperProfile`
      );
      const url = `https://twitter.com/intent/tweet?text=${text}`;
      window.open(url, "_blank");
    }
  };

  const fetchProfileData = async () => {
    const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN;
    const headers = GITHUB_TOKEN
      ? {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        }
      : {
          Accept: "application/vnd.github.v3+json",
        };

    try {
      const [
        userResponse,
        reposResponse,
        contributionsResponse,
        yearContributionsResponse,
      ] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, { headers }),
        fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
          { headers }
        ),
        fetch(`https://api.github.com/users/${username}/events`, { headers }),
        fetch(`https://api.github.com/users/${username}/events?per_page=1000`, {
          headers,
        }),
      ]);

      if (
        !userResponse.ok ||
        !reposResponse.ok ||
        !contributionsResponse.ok ||
        !yearContributionsResponse.ok
      ) {
        throw new Error("Failed to fetch GitHub profile");
      }

      const userData = await userResponse.json();
      const reposData = await reposResponse.json();
      const contributionsData = await contributionsResponse.json();
      const yearContributionsData = await yearContributionsResponse.json();

      const totalStarsCount = reposData.reduce(
        (sum, repo) => sum + repo.stargazers_count,
        0
      );
      setTotalStars(totalStarsCount);

      const totalContributions = contributionsData.filter(
        (event) =>
          event.type === "PushEvent" || event.type === "PullRequestEvent"
      ).length;

      const yearTotalContributions = yearContributionsData.filter((event) => {
        const eventDate = new Date(event.created_at);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        return (
          (event.type === "PushEvent" || event.type === "PullRequestEvent") &&
          eventDate >= oneYearAgo
        );
      }).length;

      setContributions({
        total: totalContributions,
        yearTotal: yearTotalContributions,
      });

      const completeProfile = {
        ...userData,
        aura: determineAura(userData, reposData),
      };

      setProfile(completeProfile);
      setRepos(reposData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message);
      setLoading(false);
      toast.error(
        "Failed to fetch GitHub profile. Check username or try again."
      );
    }
  };

  useEffect(() => {
    setProfile(null);
    setRepos([]);
    setLoading(true);
    setError(null);
    fetchProfileData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-pulse flex flex-col items-center">
            <TrendingUp className="w-16 h-16 text-purple-500 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Analyzing GitHub Profile
            </h2>
            <p className="text-gray-400">
              {username ? `Fetching data for @${username}` : "Loading..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-white mb-6">{error}</p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <ArrowLeft className="mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const auraPoints = calculateAuraPoints(profile, repos);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-purple-950/20 to-black/20 z-0"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex  sm:flex-row justify-between items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto bg-gray-900/50 text-white border-purple-500/30 hover:bg-gray-500/50 hover:text-white"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
            {/* <Button
              onClick={downloadProfileImage}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="mr-2 w-4 h-4" /> Download
            </Button> */}
            <Button
              onClick={shareOnTwitter}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Twitter className="mr-2 w-4 h-4" /> Share
            </Button>
          </div>
        </div>

        <Card
          ref={profileCardRef}
          className="bg-gray-900/90 backdrop-blur-xl border-2 border-transparent hover:border-purple-600/50 transition-all duration-300 ease-in-out shadow-2xl rounded-2xl overflow-hidden"
        >
          {/* <CardHeader className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 text-center p-6">
            <div className="relative mb-4">
              <img
                src={profile?.avatar_url}
                alt={profile?.name}
                className="w-32 h-32 rounded-full border-4 border-purple-500/70 shadow-2xl mx-auto transform transition-transform"
              />
              <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2">
                <Badge className="bg-yellow-500 text-white px-4 py-2 rounded-full text-xs shadow-lg transform transition-transform flex items-center justify-center space-x-2 sm:px-5 sm:py-3 sm:text-sm">
                  <Award className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> {auraPoints}{" "}
                  Aura Points
                </Badge>
              </div>
            </div>

            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
              {profile?.name || profile?.login}
              <div className="text-gray-400 text-lg mt-1">
                @{profile?.login}
              </div>
            </CardTitle>

            <p className="text-gray-300 text-base max-w-xl mx-auto">
              {profile?.bio || "No bio available"}
            </p>

            <Badge
              variant="outline"
              className={`mt-4 ${profile?.aura?.color} text-white text-sm px-4 py-2 rounded-full border-2 border-white/30`}
            >
              {profile?.aura?.type} Aura
            </Badge>
          </CardHeader>

          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: <Users className="w-5 h-5 text-purple-400" />,
                  label: "Followers",
                  value: profile?.followers,
                },
                {
                  icon: <BookOpen className="w-5 h-5 text-purple-400" />,
                  label: "Repositories",
                  value: profile?.public_repos,
                },
                {
                  icon: <Star className="w-5 h-5 text-yellow-400" />,
                  label: "Total Stars",
                  value: totalStars,
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-center mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white text-center">
                    {stat.value?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400 text-center">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div> */}
<CardHeader className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 text-center p-6">
        <div className="relative mb-4">
          <img
            src={profile?.avatar_url}
            alt={profile?.name}
            className="w-32 h-32 rounded-full border-4 border-purple-500/70 shadow-2xl mx-auto"
          />
          <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2">
            <Badge className="bg-yellow-500 text-white px-4 py-2 rounded-full text-xs shadow-lg flex items-center justify-center space-x-2">
              <Award className="mr-2 w-4 h-4" /> 
              {auraPoints} Aura Points
            </Badge>
          </div>
        </div>

        <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
          {profile?.name || profile?.login}
          <div className="text-gray-400 text-lg mt-1">
            @{profile?.login}
          </div>
        </CardTitle>

        <p className="text-gray-300 text-base max-w-xl mx-auto">
          {profile?.bio || "No bio available"}
        </p>

        <Badge
          variant="outline"
          className={`mt-4 ${aura.color} text-white text-sm px-4 py-2 rounded-full border-2 border-white/30`}
        >
          {aura.type} Aura
        </Badge>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <Users className="w-5 h-5 text-purple-400" />,
              label: "Followers",
              value: profile?.followers,
            },
            {
              icon: <BookOpen className="w-5 h-5 text-purple-400" />,
              label: "Repositories",
              value: profile?.public_repos,
            },
            {
              icon: <Star className="w-5 h-5 text-yellow-400" />,
              label: "Total Stars",
              value: totalStars,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-center mb-2">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white text-center">
                {stat.value?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400 text-center">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
            <Card className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-xl hover:border-purple-500/50 cursor-pointer">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-3">
                  Aura Analysis
                </h3>
                <p className="text-gray-300 mb-4">
                  {profile?.aura?.description}
                </p>
                {/*       
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Total Contributions</div>
          <div className="text-xl font-bold text-white">
            {contributions.total.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <div className="text-sm text-gray-400">Contributions (Last Year)</div>
          <div className="text-xl font-bold text-white">
            {contributions.yearTotal.toLocaleString()}
          </div>
        </div>
      </div> */}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Result;
