import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [repos, setRepos] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  interface Repo {
    name: string;
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/github/repos");
        const data = res.data as { repos: Repo[] };
        setRepos(data.repos);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading repos...</div>;
  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Your Repositories</h2>
      <ul>
        {repos.map((r) => (
          <li key={r.name} className="py-2">
            <Link to={`/repo/${r.name}`} className="text-blue-600">{r.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
