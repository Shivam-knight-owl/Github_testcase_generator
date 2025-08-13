import { useLocation, useNavigate } from "react-router-dom";
import CodeEditor from "../components/CodeEditor.tsx";
import { useAppState } from "../contexts/AppStateContext";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function EditorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { testCodeMap } = useAppState();
  const { testCode, fileName } = location.state || {};
  const [copySuccess, setCopySuccess] = useState(false);

  // Prefer testCode from context if available
  const codeToShow = fileName && testCodeMap[fileName.replace(/\.test\.[^/.]+$/, "")] 
    ? testCodeMap[fileName.replace(/\.test\.[^/.]+$/, "")]
    : testCode;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeToShow);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  if (!codeToShow) {
    return (
      <>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-gradient-to-br from-red-500 via-pink-500 to-rose-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-gradient-to-tr from-orange-500 via-red-500 to-pink-400 rounded-full filter blur-3xl opacity-25 animate-pulse"></div>
          </div>

          <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
            <div className="text-center max-w-md bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-4">No Test Code Available</h2>
              <p className="font-['Inter'] text-gray-600 mb-6">No test code has been generated yet. Please go back and generate some test code first.</p>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-['Inter'] font-semibold px-6 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Go Back
              </button>
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
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div className="min-h-screen bg-gray-50 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500 via-cyan-500 to-teal-400 rounded-full filter blur-3xl opacity-25 animate-pulse"></div>
          <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 rounded-full filter blur-3xl opacity-15 animate-pulse"></div>
        </div>

        {/* Header */}
        <header className="relative z-50 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl mx-6 mt-6 sticky top-6 shadow-2xl max-w-6xl mx-auto">
          <div className="px-8 py-2.5">
            <div className="flex items-center justify-between">
              {/* Navigation */}
              <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="font-['Inter'] text-sm text-gray-600 hover:text-purple-600 transition-colors cursor-pointer">
                  ← Back to Summaries
                </button>
                <div className="w-px h-6 bg-white/30"></div>
                <span className="font-['Playfair_Display'] text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Test Code Editor
                </span>
              </div>

              {/* User Profile */}
              {user && (
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-2xl bg-white/30 backdrop-blur-lg border border-white/40 shadow-lg">
                  <img src={`https://github.com/${user.username}.png`} alt={user.username} className="w-8 h-8 rounded-full border-2 border-white/50 shadow-md" />
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
        <main className="relative z-10 max-w-[95vw] mx-auto px-6 py-8">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Generated <span className="italic bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Test Code</span>
            </h1>
            {fileName && (
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30 shadow-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <span className="font-['Inter'] font-semibold text-gray-900 font-mono text-lg">{fileName}</span>
              </div>
            )}
            <p className="font-['Inter'] text-lg text-gray-600 mt-4 max-w-3xl mx-auto leading-relaxed">
              Your AI-generated test code is ready. Review or copy the complete test suite.
            </p>
          </div>

          {/* Editor Container */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-['Inter'] text-lg font-bold text-gray-900">Test Code</h3>
                    <p className="font-['Inter'] text-sm text-gray-500">Production-ready test suite</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-['Inter'] font-semibold px-4 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                  >
                    {copySuccess ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden">
                <CodeEditor code={codeToShow} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/30 text-gray-700 font-['Inter'] font-semibold px-6 py-3 rounded-full hover:bg-white/80 hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Summaries
            </button>
            
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-['Inter'] font-semibold px-6 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
              </svg>
              Generate More Tests
            </button>
          </div>
        </main>
      </div>
    </>
  );
}