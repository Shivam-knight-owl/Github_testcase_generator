import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingIndicator from "../components/LoadingIndicator";

interface Repo {
  name: string;
  full_name: string;
  html_url: string;
  private: boolean;
  description?: string;
  language?: string;
  updated_at?: string;
  stargazers_count?: number;
}

export default function HomePage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { user, clearUser } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/github/repos", { withCredentials: true });
        const data = res.data as { repos: Repo[] };
        setRepos(data.repos);
      } catch (err: any) {
        console.error("Error fetching repos:", err);
        if (err.response?.status === 401 || err.response?.status === 404) {
          // User is not properly authenticated, clear auth state
          clearUser();
          setError("Authentication failed. Please sign in again.");
        } else {
          setError("Failed to load repositories.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [clearUser]);

  if (loading) {
    return (
      <>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-gradient-to-tr from-blue-500 via-cyan-500 to-teal-400 rounded-full filter blur-3xl opacity-25 animate-pulse"></div>
          </div>

          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <LoadingIndicator message="Loading your repositories..." />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-gradient-to-br from-red-500 via-pink-500 to-rose-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-gradient-to-tr from-orange-500 via-red-500 to-pink-400 rounded-full filter blur-3xl opacity-25 animate-pulse"></div>
          </div>

          <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
            <div className="text-center max-w-md bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
              <p className="font-['Inter'] text-gray-600 mb-6">{error}</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-['Inter'] font-semibold px-6 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Back to Landing Page
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-gray-50 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500 via-cyan-500 to-teal-400 rounded-full filter blur-3xl opacity-25 animate-pulse"></div>
          <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 rounded-full filter blur-3xl opacity-15 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-gradient-to-bl from-emerald-400 via-cyan-400 to-blue-500 rounded-full filter blur-3xl opacity-15 animate-pulse"></div>
        </div>

        {/* Header */}
        <header className="relative z-50 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl mx-6 mt-6 sticky top-6 shadow-2xl max-w-5xl mx-auto">
          <div className="px-8 py-2.5">
            <div className="flex items-center justify-between">
              {/* Logo/Title */}
              <div className="flex items-center">
                <Link to="/" className="font-['Playfair_Display'] text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Test Case Generator
                </Link>
              </div>

              {/* User Profile Floating Glassmorphism */}
              {user && (
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-2xl bg-white/30 backdrop-blur-lg border border-white/40 shadow-lg hover:shadow-xl hover:bg-white/40 transition-all duration-300 transform hover:scale-105">
                  <img
                    src={`https://github.com/${user.username}.png`}
                    alt={user.username}
                    className="w-8 h-8 rounded-full border-2 border-white/50 shadow-md"
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-['Inter'] font-bold text-gray-900 text-sm">{user.username}</span>
                    <span className="font-['Inter'] text-xs text-gray-600 font-medium">GitHub User</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="mb-12 text-center">
            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your <span className="italic bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Repositories</span>
            </h1>
            <p className="font-['Inter'] text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Select a repository to start generating AI-powered test cases for your codebase.
            </p>
          </div>

          {/* Repository Grid */}
          {repos.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-xl max-w-2xl mx-auto">
                <div className="text-gray-400 mb-6">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  </svg>
                </div>
                <h3 className="font-['Playfair_Display'] text-3xl font-bold text-gray-900 mb-4">No repositories found</h3>
                <p className="font-['Inter'] text-lg text-gray-600 mb-8 leading-relaxed">
                  It looks like you don't have any repositories yet. Create one on GitHub to get started with AI-powered test generation!
                </p>
                <a
                  href="https://github.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-['Inter'] font-semibold text-lg px-8 py-4 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                >
                  Create Repository on GitHub
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {repos.map((repo) => (
                <Link
                  key={repo.name}
                  to={`/repo/${repo.name}`}
                  className="group block cursor-pointer"
                >
                  <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-6 h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-white/80 hover:border-white/40">
                    {/* Repository Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                          </svg>
                        </div>
                      </div>
                      {/* Privacy Badge */}
                      <div className={`px-4 py-2 rounded-full text-xs font-['Inter'] font-semibold shadow-sm ${
                        repo.private 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {repo.private ? 'Private' : 'Public'}
                      </div>
                    </div>

                    {/* Repository Info */}
                    <div className="mb-6">
                      <h3 className="font-['Inter'] text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300 leading-tight">
                        {repo.name}
                      </h3>
                    </div>

                    {/* Repository Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 font-['Inter']">
                      <div className="flex items-center gap-4">
                        {repo.language && (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                            <span className="font-medium">{repo.language}</span>
                          </div>
                        )}
                        {repo.stargazers_count !== undefined && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-medium">{repo.stargazers_count}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-purple-600 group-hover:text-purple-700 font-semibold">
                        <span>Generate</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-white/20 text-center">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <p className="font-['Inter'] text-gray-600 leading-relaxed">
                Need help? Check out our{' '}
                <Link to="/" className="text-purple-600 hover:text-purple-700 font-semibold underline decoration-purple-200 hover:decoration-purple-400 transition-colors">
                  documentation
                </Link>{' '}
                or{' '}
                <a href="https://github.com/support" className="text-purple-600 hover:text-purple-700 font-semibold underline decoration-purple-200 hover:decoration-purple-400 transition-colors">
                  contact support
                </a>
                .
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
