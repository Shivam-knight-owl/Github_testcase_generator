import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAppState } from "../contexts/AppStateContext";
import { useAuth } from "../contexts/AuthContext";
import LoadingIndicator from "../components/LoadingIndicator";
import Header from "../components/Header";

export default function RepoFilesPage() {
  const { repo } = useParams<{ repo: string }>();
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "tree">("tree");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const { selectedFiles, setSelectedFiles } = useAppState();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Clear selections from other repos when repo changes
  useEffect(() => {
    setSelectedFiles(prev => prev.filter(f => f.repo === repo));
  }, [repo, setSelectedFiles]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/repos/files", { params: { repo } });
        setFiles((res.data as { files: string[] }).files);
      } catch (err) {
        console.error(err);
        setError("Failed to load files");
      } finally {
        setLoading(false);
      }
    })();
  }, [repo]);

  const isSelected = (path: string) => {
    return selectedFiles.some(f => f.repo === repo && f.path === path);
  };

  const toggle = (path: string) => {
    if (isSelected(path)) {
      setSelectedFiles(prev => prev.filter(f => !(f.repo === repo && f.path === path)));
    } else {
      setSelectedFiles(prev => [...prev, { repo: repo!, path }]);
    }
  };

  const onGenerate = () => {
    const selectedForThisRepo = selectedFiles.filter(f => f.repo === repo);
    if (selectedForThisRepo.length === 0) return alert("Select files");
    navigate("/summaries");
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">JS</span>
          </div>
        );
      case 'ts':
      case 'tsx':
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">TS</span>
          </div>
        );
      case 'py':
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">PY</span>
          </div>
        );
      case 'java':
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">JV</span>
          </div>
        );
      case 'c':
      case 'cpp':
      case 'cc':
      case 'cxx':
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
        );
      case 'cs':
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">C#</span>
          </div>
        );
      case 'go':
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">GO</span>
          </div>
        );
      case 'php':
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-purple-700 to-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">PHP</span>
          </div>
        );
      case 'rb':
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-700 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">RB</span>
          </div>
        );
      case 'swift':
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">SW</span>
          </div>
        );
      case 'kt':
      case 'kts':
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">KT</span>
          </div>
        );
      case 'rs':
        return (
          <div className="w-8 h-8 bg-gradient-to-r from-orange-800 to-yellow-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">RS</span>
          </div>
        );
      case 'html':
        return (
          <div className="w-10 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center px-1">
            <span className="text-white text-xs font-bold">HTML</span>
          </div>
        );
      case 'css':
        return (
          <div className="w-9 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">CSS</span>
          </div>
        );
      case 'json':
        return (
          <div className="w-10 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded flex items-center justify-center px-1">
            <span className="text-white text-xs font-bold">JSON</span>
          </div>
        );
      case 'xml':
        return (
          <div className="w-9 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">XML</span>
          </div>
        );
      case 'yml':
      case 'yaml':
        return (
          <div className="w-9 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">YML</span>
          </div>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  // Build folder structure from files list
  const buildFolderStructure = (files: string[]) => {
    const structure: any = {};
    
    files.forEach(file => {
      const parts = file.split('/');
      let current = structure;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = i === parts.length - 1 ? null : {};
        }
        if (current[part] !== null) {
          current = current[part];
        }
      }
    });
    
    return structure;
  };

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const renderTreeNode = (node: any, path: string = "", level: number = 0) => {
    const entries = Object.entries(node);
    
    return entries.map(([name, value]: [string, any]) => {
      const currentPath = path ? `${path}/${name}` : name;
      const isFile = value === null;
      const isFolder = !isFile;
      const isExpanded = expandedFolders.has(currentPath);
      
      if (isFile) {
        return (
          <div
            key={currentPath}
            className={`group flex items-center gap-3 p-3 ml-${level * 4} rounded-xl transition-all duration-300 border cursor-pointer ${
              isSelected(currentPath)
                ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 shadow-md'
                : 'bg-white/30 backdrop-blur-sm border-white/20 hover:bg-white/50 hover:shadow-sm'
            }`}
            onClick={() => toggle(currentPath)}
          >
            {/* File Icon */}
            <div className="flex-shrink-0 ml-6">
              {getFileIcon(currentPath)}
            </div>

            {/* File Name */}
            <div className="flex-1 min-w-0">
              <div className="font-['Inter'] text-sm font-medium text-gray-900 truncate">
                {name}
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex-shrink-0">
              <div className={`w-4 h-4 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                isSelected(currentPath)
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 border-purple-500'
                  : 'border-gray-300 group-hover:border-purple-400'
              }`}>
                {isSelected(currentPath) && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        );
      } else {
        const folderFiles = files.filter(f => f.startsWith(currentPath + '/'));
        const selectedCount = folderFiles.filter(f => isSelected(f)).length;
        
        return (
          <div key={currentPath}>
            {/* Folder Header */}
            <div
              className="group flex items-center gap-3 p-3 ml-0 rounded-xl transition-all duration-300 border cursor-pointer bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/40 hover:shadow-sm mb-1"
              onClick={() => toggleFolder(currentPath)}
              style={{ marginLeft: `${level * 1}rem` }}
            >
              {/* Expand/Collapse Icon */}
              <div className="flex-shrink-0">
                <svg 
                  className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              {/* Folder Icon */}
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
              </div>

              {/* Folder Name and Count */}
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className="font-['Inter'] text-sm font-semibold text-gray-900 truncate">
                  {name}
                </span>
                <span className="font-['Inter'] text-xs text-gray-500">
                  ({folderFiles.length} files)
                </span>
                {selectedCount > 0 && (
                  <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {selectedCount} selected
                  </span>
                )}
              </div>
            </div>

            {/* Folder Contents */}
            {isExpanded && (
              <div className="ml-4 space-y-1">
                {renderTreeNode(value, currentPath, level + 1)}
              </div>
            )}
          </div>
        );
      }
    });
  };

  if (loading) {
    return (
      <>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-gradient-to-tr from-blue-500 via-cyan-500 to-teal-400 rounded-full filter blur-3xl opacity-25 animate-pulse"></div>
          </div>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <LoadingIndicator message="Loading repository files..." />
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
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-4">Failed to Load Files</h2>
              <p className="font-['Inter'] text-gray-600 mb-6">{error}</p>
              <Link to="/home" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-['Inter'] font-semibold px-6 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                Back to Repositories
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
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div className="min-h-screen bg-gray-50 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500 via-cyan-500 to-teal-400 rounded-full filter blur-3xl opacity-25 animate-pulse"></div>
          <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 rounded-full filter blur-3xl opacity-15 animate-pulse"></div>
        </div>

        {/* Header with Back Button */}
        <Header 
          title={repo || "Repository"} 
          showBackButton={true}
          backButtonPath="/home"
          backButtonText="Repositories"
        />

        {/* Main Content - No separate back button needed */}
        <main className="relative z-10 w-full max-w-full md:max-w-[95vw] mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-8 mt-16">
          {/* Light Theme Section - Files List */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/20 shadow-xl mb-6 sm:mb-8 w-full overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="mb-6 sm:mb-8">
                <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 leading-tight">
                  Select Files for <span className="italic bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Testing</span>
                </h1>
                <p className="font-['Inter'] text-sm sm:text-base md:text-lg text-gray-600">
                  Choose the files you want to generate comprehensive test cases for using AI.
                </p>
              </div>

              {/* File Count Summary with View Toggle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-white/20 gap-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <div className="bg-white/40 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 border border-white/30">
                    <span className="font-['Inter'] text-xs sm:text-sm font-semibold text-gray-700">
                      {files.length} files available
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2">
                    <span className="font-['Inter'] text-xs sm:text-sm font-semibold text-white">
                      {selectedFiles.filter(f => f.repo === repo).length} selected
                    </span>
                  </div>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 sm:gap-2 bg-white/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-1 border border-white/30 w-full sm:w-auto">
                  <button
                    onClick={() => setViewMode("tree")}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg transition-all duration-200 cursor-pointer flex-1 sm:flex-none justify-center ${
                      viewMode === "tree" 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                    </svg>
                    <span className="font-['Inter'] text-xs sm:text-sm font-medium">Tree</span>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg transition-all duration-200 cursor-pointer flex-1 sm:flex-none justify-center ${
                      viewMode === "list" 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span className="font-['Inter'] text-xs sm:text-sm font-medium">List</span>
                  </button>
                </div>
              </div>

              {/* Files Display */}
              {viewMode === "tree" ? (
                <div className="space-y-2 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                  {renderTreeNode(buildFolderStructure(files))}
                </div>
              ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3 sm:gap-4">
                  {files.map((file, index) => (
                    <div
                      key={file}
                      className={`group flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 border cursor-pointer ${
                        isSelected(file)
                          ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 shadow-lg scale-[1.02]'
                          : 'bg-white/40 backdrop-blur-sm border-white/30 hover:bg-white/60 hover:shadow-md hover:scale-[1.01]'
                      }`}
                      onClick={() => toggle(file)}
                    >
                      {/* File Icon */}
                      <div className="flex-shrink-0">
                        {getFileIcon(file)}
                      </div>

                      {/* File Path */}
                      <div className="flex-1 min-w-0">
                        <div className="font-['Inter'] text-sm font-medium text-gray-900 truncate">
                          {file.split('/').pop()}
                        </div>
                        {file.includes('/') && (
                          <div className="font-['Inter'] text-xs text-gray-500 truncate">
                            {file.substring(0, file.lastIndexOf('/'))}
                          </div>
                        )}
                      </div>

                      {/* Checkbox */}
                      <div className="flex-shrink-0">
                        <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                          isSelected(file)
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 border-purple-500'
                            : 'border-gray-300 group-hover:border-purple-400'
                        }`}>
                          {isSelected(file) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dark Theme Section - Generate Button */}
          <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl w-full mt-8">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full filter blur-2xl opacity-30"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full filter blur-2xl opacity-25"></div>
            </div>
            
            <div className="relative z-10 p-4 sm:p-6 md:p-8 text-center">
              <h2 className="font-['Playfair_Display'] text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                Ready to Generate <span className="italic bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">AI Tests</span>?
              </h2>
              <p className="font-['Inter'] text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                {selectedFiles.filter(f => f.repo === repo).length > 0
                  ? `Generate comprehensive test suites for ${selectedFiles.filter(f => f.repo === repo).length} selected files using advanced AI models.`
                  : "Select files above to start generating intelligent test cases."
                }
              </p>
              
              <button
                onClick={onGenerate}
                disabled={selectedFiles.filter(f => f.repo === repo).length === 0}
                className={`inline-flex items-center gap-2 sm:gap-3 font-['Inter'] font-semibold text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full transition-all duration-300 transform cursor-pointer w-full sm:w-auto justify-center ${
                  selectedFiles.filter(f => f.repo === repo).length > 0
                    ? 'bg-white text-black hover:bg-gray-100 hover:scale-105 shadow-2xl hover:shadow-white/20'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="truncate">Generate Summary for Test Cases</span>
                {selectedFiles.filter(f => f.repo === repo).length > 0 && (
                  <span className="ml-2 bg-black/20 px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm flex-shrink-0">
                    {selectedFiles.filter(f => f.repo === repo).length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}