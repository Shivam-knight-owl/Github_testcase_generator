export default function LoadingIndicator({ 
  message = "Loading...", 
  size = "large",
  variant = "primary" 
}: { 
  message?: string;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary";
}) {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8", 
    large: "w-12 h-12"
  };

  const variantClasses = {
    primary: "border-purple-600",
    secondary: "border-gray-400"
  };

  return (
    <div className="text-center py-8">
      <div className={`animate-spin rounded-full border-b-2 mx-auto mb-4 ${sizeClasses[size]} ${variantClasses[variant]}`}></div>
      <p className="text-gray-600 font-['Inter'] text-lg">{message}</p>
    </div>
  );
}
