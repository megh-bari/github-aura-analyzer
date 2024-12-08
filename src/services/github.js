// src/services/github.js

class GitHubService {
  constructor() {
    this.baseUrl = 'https://api.github.com';
    this.headers = {
      'Authorization': `Bearer ${process.env.VITE_GITHUB_API_TOKEN}`, // Use process.env for environment variables
      'Accept': 'application/vnd.github.v3+json',
    };
  }

  async getProfile(username) {
    const response = await fetch(`${this.baseUrl}/users/${username}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`);
    }

    return await response.json();
  }

  async getRepositories(username) {
    const response = await fetch(
      `${this.baseUrl}/users/${username}/repos?sort=stars&per_page=5`,
      { headers: this.headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`);
    }

    return await response.json();
  }

  async getContributions(username) {
    // Note: This is a simplified version. GitHub's contribution data
    // requires GraphQL API for more detailed information
    const response = await fetch(
      `${this.baseUrl}/users/${username}/events?per_page=100`,
      { headers: this.headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`);
    }

    const events = await response.json();
    return events.length; // This is a simplified count of recent activity
  }
}

export const githubService = new GitHubService();


// src/services/github.js
// export const fetchGitHubProfile = async (username, token) => {
//     const response = await fetch(`https://api.github.com/users/${username}`, {
//       headers: {
//         'Authorization': `token ${token}`,
//         'Accept': 'application/vnd.github.v3+json'
//       }
//     });
//     if (!response.ok) {
//       throw new Error('Failed to fetch profile');
//     }
//     return await response.json();
//   };
  
//   export const fetchGitHubRepos = async (username, token) => {
//     const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
//       headers: {
//         'Authorization': `token ${token}`,
//         'Accept': 'application/vnd.github.v3+json'
//       }
//     });
//     if (!response.ok) {
//       throw new Error('Failed to fetch repositories');
//     }
//     return await response.json();
//   };