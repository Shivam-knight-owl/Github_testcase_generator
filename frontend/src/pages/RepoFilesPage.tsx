import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAppState } from "../contexts/AppStateContext";

export default function RepoFilesPage() {
  const { repo } = useParams<{ repo: string }>();
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedFiles, setSelectedFiles } = useAppState();
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

  if (loading) return <div>Loading files...</div>;
  return (
    <div className="p-6">
      <h2 className="text-xl">Files in {repo}</h2>
      <div className="mt-4">
        {files.map(f => (
          <div key={f} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isSelected(f)}
              onChange={() => toggle(f)}
            />
            <span className="font-mono">{f}</span>
          </div>
        ))}
      </div>
      <button onClick={onGenerate} className="mt-4 bg-green-600 text-white px-3 py-2 rounded">
        Generate Summaries ({selectedFiles.filter(f => f.repo === repo).length} selected)
      </button>
    </div>
  );
}