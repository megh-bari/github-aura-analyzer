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

  // const determineAura = (profile, repos) => {
  //   const { followers, public_repos, bio } = profile;
  //   const totalStars = repos.reduce(
  //     (sum, repo) => sum + repo.stargazers_count,
  //     0
  //   );
  //   const forkRatio = repos.filter((repo) => repo.fork).length / repos.length;

  //   if (followers > 10000 && totalStars > 5000) {
  //     return {
  //       type: "Global Tech Icon",
  //       description:
  //         "An unparalleled leader in the tech world with immense influence.",
  //       color: "bg-gradient-to-r from-red-600 to-yellow-600",
  //     };
  //   }

  //   if (followers > 5000 && totalStars > 1000) {
  //     return {
  //       type: "Tech Influencer",
  //       description:
  //         "A highly recognized developer with massive community impact and thought leadership.",
  //       color: "bg-gradient-to-r from-blue-600 to-purple-600",
  //     };
  //   }

  //   if (followers > 1000 && totalStars > 500) {
  //     return {
  //       type: "Rising Star",
  //       description: "A rapidly growing developer with increasing influence.",
  //       color: "bg-gradient-to-r from-orange-600 to-red-600",
  //     };
  //   }

  //   if (followers > 500 && followers <= 1000) {
  //     return {
  //       type: "Growing Contributor",
  //       description:
  //         "A developer with a growing impact and a steadily increasing follower base.",
  //       color: "bg-gradient-to-r from-green-600 to-teal-500",
  //     };
  //   }

  //   if (followers > 50 && followers <= 500) {
  //     return {
  //       type: "Budding Developer",
  //       description:
  //         "An emerging developer with potential for significant growth.",
  //       color: "bg-gradient-to-r from-indigo-600 to-pink-500",
  //     };
  //   }

  //   if (
  //     bio &&
  //     (bio.toLowerCase().includes("open source") ||
  //       bio.toLowerCase().includes("contributor"))
  //   ) {
  //     return {
  //       type: "Community Builder",
  //       description:
  //         "Passionate about collaborative development and knowledge sharing.",
  //       color: "bg-gradient-to-r from-green-600 to-teal-500",
  //     };
  //   }

  //   if (public_repos > 50 && totalStars > 500) {
  //     return {
  //       type: "Prolific Creator",
  //       description:
  //         "A consistently productive developer with a diverse and impactful portfolio.",
  //       color: "bg-gradient-to-r from-indigo-600 to-pink-500",
  //     };
  //   }

  //   if (forkRatio > 0.5) {
  //     return {
  //       type: "Collaborative Innovator",
  //       description:
  //         "Skilled at building upon and improving existing projects.",
  //       color: "bg-gradient-to-r from-yellow-600 to-orange-500",
  //     };
  //   }

  //   return {
  //     type: "Aspiring Developer",
  //     description:
  //       "A developer at the beginning of their journey, ready to learn and grow.",
  //     color: "bg-gradient-to-r from-gray-500 to-black-500",
  //   };
  // };

  // const calculateAuraPoints = (profile, repos) => {
  //   const { followers, public_repos } = profile;
  //   const totalStars = repos.reduce(
  //     (sum, repo) => sum + repo.stargazers_count,
  //     0
  //   );

  //   let points = 0;
  //   points += Math.min(followers, 5000) / 50;
  //   points += totalStars;
  //   points += public_repos * 2;

  //   return Math.min(Math.round(points), 1000);
  // };

  // new
  const determineAura = (profile, repos) => {
    const { followers, public_repos, bio } = profile;

// Special case for users with 0-2 followers or zero repositories
if (followers <= 2 || repos.length === 0) {
  return {
      type: "Noob",
      description: "You need to work hard, LFG!",
      color: "bg-gradient-to-r from-gray-500 to-red-500",
      auraAnalysis: "You need to grind",
      pointMultiplier: 0.1
  };
}

    const totalStars = repos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );
    const forkRatio = repos.filter((repo) => repo.fork).length / repos.length;

    // Comprehensive Aura Categorization
    const auraCategories = [
      {
        range: { min: 1_000_000, max: Infinity },
        type: "Global Tech Titan",
        description:
          "A legendary developer with massive global influence and unprecedented impact.",
        color: "bg-gradient-to-r from-red-800 to-yellow-800",
        pointMultiplier: 1.5,
      },
      {
        range: { min: 200_000, max: 1_000_000 },
        type: "Tech Visionary",
        description:
          "An extraordinary developer shaping the future of technology with groundbreaking contributions.",
        color: "bg-gradient-to-r from-purple-800 to-indigo-800",
        pointMultiplier: 1.3,
      },
      {
        range: { min: 100_000, max: 200_000 },
        type: "Thought Leader",
        description:
          "A highly influential developer with significant industry recognition and impact.",
        color: "bg-gradient-to-r from-blue-800 to-purple-800",
        pointMultiplier: 1.2,
      },
      {
        range: { min: 50_000, max: 100_000 },
        type: "Tech Luminary",
        description:
          "A prominent developer with substantial community influence and innovative contributions.",
        color: "bg-gradient-to-r from-green-800 to-blue-800",
        pointMultiplier: 1.1,
      },
      {
        range: { min: 20_000, max: 50_000 },
        type: "Influential Innovator",
        description:
          "A recognized developer with significant contributions and growing community impact.",
        color: "bg-gradient-to-r from-orange-800 to-red-800",
        pointMultiplier: 1.0,
      },
      {
        range: { min: 10_000, max: 20_000 },
        type: "Rising Influencer",
        description:
          "An emerging developer with substantial potential and increasing community recognition.",
        color: "bg-gradient-to-r from-yellow-700 to-orange-700",
        pointMultiplier: 0.9,
      },
      {
        range: { min: 5_000, max: 10_000 },
        type: "Tech Innovator",
        description:
          "A passionate developer making significant strides in their technological journey.",
        color: "bg-gradient-to-r from-teal-700 to-green-700",
        pointMultiplier: 0.8,
      },
      {
        range: { min: 1_000, max: 5_000 },
        type: "Growing Contributor",
        description:
          "A dedicated developer with increasing impact and community engagement.",
        color: "bg-gradient-to-r from-indigo-700 to-purple-700",
        pointMultiplier: 0.7,
      },
      {
        range: { min: 500, max: 1_000 },
        type: "Emerging Talent",
        description:
          "A promising developer building their reputation and expanding their skills.",
        color: "bg-gradient-to-r from-pink-700 to-red-700",
        pointMultiplier: 0.6,
      },
      {
        range: { min: 100, max: 500 },
        type: "Budding Developer",
        description:
          "An enthusiastic developer starting to make their mark in the tech community.",
        color: "bg-gradient-to-r from-green-700 to-teal-700",
        pointMultiplier: 0.5,
      },
      {
        range: { min: 0, max: 100 },
        type: "Aspiring Developer",
        description:
          "A passionate beginner taking their first steps in the world of technology.",
        color: "bg-gradient-to-r from-gray-700 to-black",
        pointMultiplier: 0.4,
      },
      {
        range: { min: 0, max: 2 },
        type: "Noob",
        description: "You need to work hard, LFG!",
        color: "bg-gradient-to-r from-gray-500 to-red-500",
      },
    ];

    // Special case for open-source and community contributors
    if (
      bio &&
      (bio.toLowerCase().includes("open source") ||
        bio.toLowerCase().includes("contributor"))
    ) {
      return {
        type: "Community Builder",
        description:
          "Passionate about collaborative development and knowledge sharing.",
        color: "bg-gradient-to-r from-green-600 to-teal-500",
        pointMultiplier: 0.7,
      };
    }

    // Find the appropriate aura category based on followers
    const matchedCategory =
      auraCategories.find(
        (category) =>
          followers >= category.range.min && followers < category.range.max
      ) || auraCategories[auraCategories.length - 1];

    return matchedCategory;
  };

  const calculateAuraPoints = (profile, repos) => {
    const { followers, public_repos } = profile;
    const totalStars = repos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );

    const auraCategory = determineAura(profile, repos);
    const pointMultiplier = auraCategory.pointMultiplier || 1;

    let points = 0;
    // Follower points with more nuanced scaling
    points += Math.min(followers, 1_000_000) / 25;

    // Stars points
    points += totalStars * 1.5;

    // Repository points
    points += public_repos * 3;

    // Apply category-specific multiplier
    points *= pointMultiplier;

    // Ensure points are capped at 10,000
    return Math.min(Math.round(points), 10_000);
  };

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
        if (userResponse.status === 401) {
          throw new Error(
            "Invalid GitHub API token or insufficient permissions. Please check your token and try again."
          );
        } else {
          // Check for rate limit
          const rateLimitRemaining = userResponse.headers.get(
            "X-RateLimit-Remaining"
          );
          if (rateLimitRemaining === "0") {
            const rateLimitReset =
              userResponse.headers.get("X-RateLimit-Reset");
            const resetTime = new Date(rateLimitReset * 1000).toLocaleString();
            throw new Error(
              `GitHub API rate limit reached. Please try again after ${resetTime}`
            );
          } else {
            throw new Error("Failed to fetch GitHub profile");
          }
        }
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
      toast.error(error.message);
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
          <CardHeader className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 text-center p-6">
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
