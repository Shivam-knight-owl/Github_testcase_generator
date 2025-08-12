import { useAuth } from "../contexts/AuthContext";

export default function LandingPage() {
  const { user, loading } = useAuth();

  function handleSignIn() {
    if (!loading) {
      if (user) {
        // Already signed in → go home
        window.location.href = "/home";
      } else {
        // Not signed in → go to GitHub OAuth
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`;
      }
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl">TestCase Generator</h1>
      <button onClick={handleSignIn} className="mt-6 bg-black text-white px-4 py-2 rounded">
        Sign in with GitHub
      </button>
    </div>
  );
}
