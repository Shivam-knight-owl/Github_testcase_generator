import { useState, useEffect, useRef } from "react";
import api from "../api";
import { useAppState } from "../contexts/AppStateContext";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import ThemeToggle from "../components/ThemeToggle";
import SelectedFilesList from "../components/SelectedFilesList";
import SummaryBox from "../components/SummaryBox";
import ErrorMessage from "../components/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";

// Define the Summary type if not imported from elsewhere
type Summary = {
  filePath: string;
  fileContent: string;
  summary: string;
};

export default function SummaryPage() {
  const { selectedFiles, summaries, setSummaries, testCodeMap, setTestCodeMap } = useAppState();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [loadingTestCode, setLoadingTestCode] = useState<string | null>(null); // Track which file is loading
  const [editorTheme, setEditorTheme] = useState<"dark" | "light">(
    () => (localStorage.getItem("toastui-theme") as "dark" | "light") || "dark"
  );
  const [themeVersion, setThemeVersion] = useState(0);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setEditorTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("toastui-theme", next);
      setThemeVersion(v => v + 1);
      return next;
    });
  };

  // Only clear summaries if selectedFiles do not match summaries
  useEffect(() => {
    // Get all filePaths from selectedFiles and summaries
    const selectedPaths = selectedFiles.map(f => f.path).sort();
    const summaryPaths = summaries.map(s => s.filePath).sort();

    // If the selected files match the summaries, keep them
    const isSame =
      selectedPaths.length === summaryPaths.length &&
      selectedPaths.every((v, i) => v === summaryPaths[i]);

    if (isSame && summaries.length > 0) {
      setHasGenerated(true);
    } else {
      setSummaries([]);
      setHasGenerated(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFiles]);

  const generateSummaries = async () => {
    setLoading(true);
    setError("");
    try {
      const filesWithContent = await Promise.all(
        selectedFiles.map(async ({ repo, path }) => {
          const res = await api.get("/repos/file-content", {
            params: { repo, filePath: path },
            withCredentials: true
          });
          return {
            filePath: path,
            fileContent: (res.data as { fileContent: string }).fileContent
          };
        })
      );

      const res = await api.post("/generate-test-summaries", {
        files: filesWithContent
      }, {
        withCredentials: true
      });

      const data = res.data as { summaries?: { filePath: string; fileContent: string; summary: string }[] };
      setSummaries(data.summaries || []);
      setHasGenerated(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate summaries");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTestCode = async (summary: { filePath: string; fileContent: string; summary: string }) => {
    if (testCodeMap[summary.filePath]) {
      navigate("/editor", {
        state: {
          testCode: testCodeMap[summary.filePath],
          fileName: summary.filePath.replace(/\.[^/.]+$/, ".test$&")
        }
      });
      return;
    }

    try {
      setLoadingTestCode(summary.filePath); // Set loading for this specific file
      const res = await api.post("/generate-test-code", {
        filePath: summary.filePath,
        fileContent: summary.fileContent
      }, {
        withCredentials: true
      });

      const data = res.data as { testCode: string };
      setTestCodeMap(prev => ({ ...prev, [summary.filePath]: data.testCode }));

      navigate("/editor", {
        state: {
          testCode: data.testCode,
          fileName: summary.filePath.replace(/\.[^/.]+$/, ".test$&")
        }
      });
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to generate test code");
    } finally {
      setLoadingTestCode(null); // Clear loading state
    }
  };

  // Add refs for each summary editor
  const summaryEditors = useRef<{ [key: string]: any }>({});

  if (selectedFiles.length === 0) {
    return (
      <>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-gradient-to-tr from-blue-500 via-cyan-500 to-teal-400 rounded-full filter blur-3xl opacity-25 animate-pulse"></div>
          </div>

          <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
            <div className="text-center max-w-md bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-4">No Files Selected</h2>
              <p className="font-['Inter'] text-gray-600 mb-6">Select some files first to generate test summaries.</p>
              <Link to="/home" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-['Inter'] font-semibold px-6 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                Back to Repositories
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading && summaries.length === 0) {
    return (
      <>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-gradient-to-tr from-blue-500 via-cyan-500 to-teal-400 rounded-full filter blur-3xl opacity-25 animate-pulse"></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <LoadingIndicator message="Generating test summaries..." />
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
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-4">Error Occurred</h2>
              <p className="font-['Inter'] text-gray-600 mb-6">{error}</p>
              <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-['Inter'] font-semibold px-6 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 cursor-pointer">
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
                  ← Back to Files
                </button>
                <div className="w-px h-6 bg-white/30"></div>
                <span className="font-['Playfair_Display'] text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Test Summaries
                </span>
              </div>

              {/* Right Side - Theme Toggle + User Profile */}
              <div className="flex items-center gap-4">
                <ThemeToggle theme={editorTheme} toggleTheme={toggleTheme} />
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
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-[95vw] mx-auto px-6 py-8">
          {/* Page Title */}
          <div className="mb-12 text-center">
            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Test Case <span className="italic bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Summaries</span>
            </h1>
            <p className="font-['Inter'] text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              AI-generated comprehensive test cases summaries for your selected files.
            </p>
          </div>

          {/* Show selected files before generating */}
          {!hasGenerated && (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl mb-8 max-w-4xl mx-auto">
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-4">
                    Selected Files for <span className="italic bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Testing</span>
                  </h2>
                  <p className="font-['Inter'] text-lg text-gray-600">
                    Review your selected files and generate comprehensive test summaries.
                  </p>
                </div>

                {/* File Count Summary */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/20">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl px-4 py-2">
                    <span className="font-['Inter'] text-sm font-semibold text-white">
                      {selectedFiles.length} files selected
                    </span>
                  </div>
                </div>

                {/* Files List */}
                <div className="space-y-3 mb-8">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/30 transition-all duration-300 hover:bg-white/60 hover:shadow-md">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{file.path.split('.').pop()?.toUpperCase().slice(0, 2)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-['Inter'] text-sm font-medium text-gray-900">
                          {file.path.split('/').pop()}
                        </div>
                        <div className="font-['Inter'] text-xs text-gray-500">
                          {file.repo} • {file.path}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Generate Button */}
                <div className="text-center">
                  <button
                    onClick={generateSummaries}
                    disabled={loading}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-['Inter'] font-semibold text-lg px-8 py-4 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {loading ? "Generating Summaries..." : "Generate Test Summaries"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {hasGenerated && summaries.length > 0 && (
            <div className="space-y-8">
              {summaries.map((summary: Summary, index: number) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl overflow-hidden">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-['Inter'] text-lg font-bold text-gray-900">
                              {summary.filePath.split('/').pop()}
                            </h3>
                            <p className="font-['Inter'] text-sm text-gray-500 font-mono">
                              {summary.filePath}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleGenerateTestCode(summary)}
                        disabled={loadingTestCode === summary.filePath}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-['Inter'] font-semibold px-6 py-3 rounded-full hover:from-emerald-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        {loadingTestCode === summary.filePath ? "Generating..." : "Generate Test Code"}
                      </button>
                    </div>
                    
                    <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden">
                      <div className="p-4 border-b border-white/20">
                        <h4 className="font-['Inter'] text-sm font-semibold text-gray-700">Test Cases Summary:</h4>
                      </div>
                      <div className="p-0">
                        <SummaryBox
                          summary={summary}
                          loading={loadingTestCode === summary.filePath}
                          onGenerateTestCode={() => handleGenerateTestCode(summary)}
                          editorTheme={editorTheme}
                          themeVersion={themeVersion}
                          summaryRef={(el: any) => { summaryEditors.current[summary.filePath] = el; }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasGenerated && summaries.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-xl max-w-2xl mx-auto">
                <div className="text-gray-400 mb-6">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-4">No Summaries Generated</h3>
                <p className="font-['Inter'] text-gray-600 leading-relaxed">
                  Something went wrong during the generation process. Please try again.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}