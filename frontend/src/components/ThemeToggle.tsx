export default function ThemeToggle({
  theme,
  toggleTheme,
}: {
  theme: "dark" | "light";
  toggleTheme: () => void;
}) {
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      type="button"
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/30 backdrop-blur-lg border border-white/40 shadow-lg hover:bg-white/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
    >
      <div className="flex items-center gap-2">
        {theme === "dark" ? (
          <>
            <svg
              className="w-4 h-4 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
            <span className="font-['Inter'] text-sm font-medium text-gray-900">
              Dark
            </span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="font-['Inter'] text-sm font-medium text-gray-900">
              Light
            </span>
          </>
        )}
      </div>
    </button>
  );
}
