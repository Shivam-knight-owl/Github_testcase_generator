import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage.tsx";
import RepoFilesPage from "./pages/RepoFilesPage.tsx";
import SummariesPage from "./pages/SummaryPage.tsx";
import EditorPage from "./pages/EditorPage.tsx";
import { useAuth } from "./contexts/AuthContext";

function Protected({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Protected><HomePage /></Protected>} />
        <Route path="/repo/:repo" element={<Protected><RepoFilesPage /></Protected>} />
        <Route path="/summaries" element={<Protected><SummariesPage /></Protected>} />
        <Route path="/editor" element={<Protected><EditorPage /></Protected>} />
      </Routes>
    </BrowserRouter>
  );
}
