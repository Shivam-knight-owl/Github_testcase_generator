import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  backButtonPath?: string;
  backButtonText?: string;
}

export default function Header({ 
  title = "Test Case Generator",
  showBackButton = false,
  backButtonPath,
  backButtonText = "Back"
}: HeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (backButtonPath) {
      navigate(backButtonPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky z-50 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl mx-auto sm:mx-auto mt-4 sm:mt-6 top-4 sm:top-6 shadow-2xl max-w-full md:max-w-5xl left-0 right-0">
      <div className="px-4 sm:px-6 md:px-8 py-2.5">
        <div className="flex items-center justify-between">
          {/* Back Button - Left Side */}
          <div className="flex-shrink-0 w-24 sm:w-32">
            {showBackButton && (
              <button 
                onClick={handleBackClick}
                className="font-['Inter'] text-sm text-gray-600 hover:text-purple-600 transition-colors cursor-pointer bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 shadow-sm hover:bg-white/30 flex items-center gap-1"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>{backButtonText}</span>
              </button>
            )}
          </div>
          
          {/* Title - Center */}
          <div className="flex-grow text-center">
            <Link to="/" className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {title}
            </Link>
          </div>

          {/* User Profile - Right Side */}
          <div className="flex-shrink-0 w-24 sm:w-32 flex justify-end">
            {user && (
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-white/30 backdrop-blur-lg border border-white/40 shadow-lg hover:shadow-xl hover:bg-white/40 transition-all duration-300 transform hover:scale-105">
                <img
                  src={`https://github.com/${user.username}.png`}
                  alt={user.username}
                  className="w-6 sm:w-8 h-6 sm:h-8 rounded-full border-2 border-white/50 shadow-md flex-shrink-0"
                />
                <div className="flex-col items-start min-w-0 hidden sm:flex">
                  <span className="font-['Inter'] font-bold text-gray-900 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{user.username}</span>
                  <span className="font-['Inter'] text-xs text-gray-600 font-medium">GitHub User</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
