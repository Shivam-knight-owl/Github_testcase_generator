import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  function handleSignIn() {
    if (!loading) {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/github/login`;
    }
  }

  function handleGoHome() {
    navigate("/home");
  }

  // Only show sign-in/go-home button, always show landing page
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
        {/* Background Decorative Elements - Enhanced visibility */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500 via-cyan-500 to-teal-400 rounded-full filter blur-3xl opacity-35 animate-pulse"></div>
          <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 rounded-full filter blur-3xl opacity-25 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-gradient-to-bl from-emerald-400 via-cyan-400 to-blue-500 rounded-full filter blur-3xl opacity-25 animate-pulse"></div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
              Start your journey
              <br />
              <span className="italic bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                with Test Case Generator
              </span>
            </h1>

            <p className="font-['Inter'] text-lg sm:text-xl md:text-2xl text-gray-600 max-w-5xl mx-auto mb-12 leading-relaxed">
              Revolutionize your development workflow with intelligent AI-powered test
              automation.
              <br className="hidden sm:block" />
              Connect GitHub, explore repositories, select files, and generate
              <br className="hidden lg:block" />
              production-ready test suites in seconds.
            </p>

            <button
              onClick={user ? handleGoHome : handleSignIn}
              disabled={loading}
              className={`inline-flex items-center gap-3 font-['Inter'] font-semibold text-lg px-10 py-5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 cursor-pointer
                ${user
                  ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900"
                  : "bg-white text-black hover:shadow-2xl"
                }`}
            >
              {user ? (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-1h2v1zm0-2H9V7h2v4z" />
                  </svg>
                  Go to Home
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Sign in with GitHub
                </>
              )}
            </button>
            {user && (
              <div className="mt-3 text-gray-500 text-base font-['Inter']">
                You're already signed in with GitHub.
              </div>
            )}
          </div>
        </section>

        {/* Explore Features Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Complete testing automation pipeline
              </h2>
              <p className="font-['Inter'] text-xl text-gray-600 max-w-3xl mx-auto">
                From repository connection to production-ready test suites — everything
                you need for comprehensive test coverage
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Row 1 - Top 3 cards */}
              {/* GitHub OAuth Integration */}
              <div className="group p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <h3 className="font-['Inter'] text-xl font-semibold text-gray-900 mb-4">Secure GitHub OAuth</h3>
                <p className="font-['Inter'] text-gray-600 leading-relaxed">
                  One-click secure authentication with GitHub. Access all your repositories
                  with enterprise-grade security and permissions.
                </p>
              </div>

              {/* Repository Explorer */}
              <div className="group p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  </svg>
                </div>
                <h3 className="font-['Inter'] text-xl font-semibold text-gray-900 mb-4">Smart Repository Explorer</h3>
                <p className="font-['Inter'] text-gray-600 leading-relaxed">
                  Browse all your repositories with intelligent filtering. Quickly identify
                  codebases that need comprehensive test coverage.
                </p>
              </div>

              {/* Multi-File Selection */}
              <div className="group p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-['Inter'] text-xl font-semibold text-gray-900 mb-4">Intelligent File Selection</h3>
                <p className="font-['Inter'] text-gray-600 leading-relaxed">
                  Select multiple files across your codebase. Our AI analyzes dependencies
                  and suggests optimal testing strategies for each component.
                </p>
              </div>

              {/* Row 2 - Bottom 3 cards */}
              {/* AI Test Case Generation */}
              <div className="group p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-['Inter'] text-xl font-semibold text-gray-900 mb-4">AI-Powered Test Generation</h3>
                <p className="font-['Inter'] text-gray-600 leading-relaxed">
                  Generate comprehensive test summaries with edge cases, boundary conditions,
                  and integration scenarios using advanced AI models.
                </p>
              </div>

              {/* Multi-Framework Support */}
              <div className="group p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="font-['Inter'] text-xl font-semibold text-gray-900 mb-4">Multi-Framework Mastery</h3>
                <p className="font-['Inter'] text-gray-600 leading-relaxed">
                  AI reads your selected file type and auto-generates tests in the perfect
                  framework—Jest, PyTest, JUnit, and beyond.
                </p>
              </div>

              {/* Code Generation */}
              <div className="group p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="font-['Inter'] text-xl font-semibold text-gray-900 mb-4">Production-Ready Code</h3>
                <p className="font-['Inter'] text-gray-600 leading-relaxed">
                  Transform test summaries into complete, executable test suites. Clean,
                  documented, and ready for immediate integration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How it works
              </h2>
              <p className="font-['Inter'] text-xl text-gray-600">
                End-to-end AI-powered test automation in five simple steps
              </p>
            </div>

            {/* Desktop: Horizontal flow */}
            <div className="hidden lg:flex items-center justify-between relative">
              {/* Step 1 */}
              <div className="relative z-10 text-center group max-w-xs">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <h3 className="font-['Inter'] text-lg font-semibold text-gray-900 mb-3">Connect with GitHub</h3>
                <p className="font-['Inter'] text-sm text-gray-600">
                  Secure OAuth authentication
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 text-center group max-w-xs">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h3 className="font-['Inter'] text-lg font-semibold text-gray-900 mb-3">Browse Repositories</h3>
                <p className="font-['Inter'] text-sm text-gray-600">
                  View all your GitHub repos
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 text-center group max-w-xs">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h3 className="font-['Inter'] text-lg font-semibold text-gray-900 mb-3">Select Files</h3>
                <p className="font-['Inter'] text-sm text-gray-600">
                  Pick repo & multiple files
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative z-10 text-center group max-w-xs">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-2xl">4</span>
                </div>
                <h3 className="font-['Inter'] text-lg font-semibold text-gray-900 mb-3">AI Test Summary</h3>
                <p className="font-['Inter'] text-sm text-gray-600">
                  Smart test case analysis
                </p>
              </div>

              {/* Step 5 */}
              <div className="relative z-10 text-center group max-w-xs">
                <div className="w-20 h-20 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-2xl">5</span>
                </div>
                <h3 className="font-['Inter'] text-lg font-semibold text-gray-900 mb-3">Generate Code</h3>
                <p className="font-['Inter'] text-sm text-gray-600">
                  Production-ready test suites
                </p>
              </div>
            </div>

            {/* Mobile & Tablet: Vertical flow */}
            <div className="lg:hidden space-y-12">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <h3 className="font-['Inter'] text-lg font-semibold text-gray-900 mb-3">Connect with GitHub</h3>
                <p className="font-['Inter'] text-gray-600">
                  Authenticate securely via GitHub OAuth to enable seamless integration.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h3 className="font-['Inter'] text-lg font-semibold text-gray-900 mb-3">Browse Repositories</h3>
                <p className="font-['Inter'] text-gray-600">
                  Instantly view and search all your GitHub repositories in a unified
                  dashboard.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h3 className="font-['Inter'] text-lg font-semibold text-gray-900 mb-3">Select Repo & Files</h3>
                <p className="font-['Inter'] text-gray-600">
                  Pick a repository and select multiple files for which you want to generate
                  tests.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-2xl">4</span>
                </div>
                <h3 className="font-['Inter'] text-lg font-semibold text-gray-900 mb-3">AI Test Summary</h3>
                <p className="font-['Inter'] text-gray-600">
                  Instantly get a smart summary of required test cases for each selected file.
                </p>
              </div>

              {/* Step 5 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-2xl">5</span>
                </div>
                <h3 className="font-['Inter'] text-lg font-semibold text-gray-900 mb-3">Generate Test Code</h3>
                <p className="font-['Inter'] text-gray-600">
                  Click once to generate robust, framework-ready test code for all selected
                  files using AI.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full filter blur-3xl opacity-30"></div>
            {/* Add more decorative elements here if needed */}
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Boost your testing workflow
              <br />
              <span className="italic bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                with AI — start today
              </span>
            </h2>

            <p className="font-['Inter'] text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join developers who are already saving hours of manual testing work
              every week
            </p>

            <button
              onClick={handleSignIn}
              disabled={loading}
              className="inline-flex items-center gap-3 bg-white text-black font-['Inter'] font-semibold text-lg px-10 py-5 rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Sign in with GitHub
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </>
    );
  }
