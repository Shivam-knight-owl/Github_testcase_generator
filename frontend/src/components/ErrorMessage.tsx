
export default function ErrorMessage({ error, onBack }: { error: string; onBack: () => void }) {
  return (
    <div className="p-6">
      <div className="text-red-500 mb-4">Error: {error}</div>
      <button
        onClick={onBack}
        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
      >
        Back
      </button>
    </div>
  );
}
