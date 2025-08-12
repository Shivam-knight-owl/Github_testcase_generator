import { useNavigate, useLocation } from "react-router-dom";

export default function SummaryList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { filePath } = location.state || {};

  const summaries = [
    "Test case for API response",
    "Test case for form validation",
  ]; // mock

  return (
    <div className="space-y-4">
      {summaries.map((summary, idx) => (
        <div
          key={idx}
          className="p-4 bg-white rounded shadow flex justify-between"
        >
          <p>{summary}</p>
          <button
            onClick={() =>
              navigate("/test-case", { state: { summary, filePath } })
            }
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Generate
          </button>
        </div>
      ))}
    </div>
  );
}
