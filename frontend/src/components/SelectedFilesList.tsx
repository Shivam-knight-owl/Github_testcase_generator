
export default function SelectedFilesList({
  selectedFiles,
  loading,
  onGenerateSummaries,
}: {
  selectedFiles: { repo: string; path: string }[];
  loading: boolean;
  onGenerateSummaries: () => void;
}) {
  return (
    <div className="mb-6 border border-yellow-300 bg-yellow-50 rounded p-4 text-yellow-900">
      <div className="mb-2 font-semibold">
        You have selected the following files (max 5 allowed):
      </div>
      <ul className="mb-2 list-disc list-inside text-sm">
        {selectedFiles.map(f => (
          <li key={f.repo + f.path}>
            <span className="font-mono">{f.path}</span> <span className="text-gray-500">({f.repo})</span>
          </li>
        ))}
      </ul>
      {selectedFiles.length > 5 && (
        <div className="text-red-600 mb-2">You can select up to 5 files only.</div>
      )}
      <button
        onClick={onGenerateSummaries}
        disabled={selectedFiles.length === 0 || selectedFiles.length > 5 || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Generating Summaries..." : "Generate Summaries"}
      </button>
    </div>
  );
}
