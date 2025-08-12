import { useLocation, useNavigate } from "react-router-dom";
import CodeEditor from "../components/CodeEditor.tsx";
import { useAppState } from "../contexts/AppStateContext";

export default function EditorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { testCodeMap } = useAppState();
  const { testCode, fileName } = location.state || {};

  // Prefer testCode from context if available
  const codeToShow = fileName && testCodeMap[fileName.replace(/\.test\.[^/.]+$/, "")] 
    ? testCodeMap[fileName.replace(/\.test\.[^/.]+$/, "")]
    : testCode;

  if (!codeToShow) {
    return (
      <div className="p-6">
        <div className="mb-4">No test code generated yet.</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl mb-3">
        Generated Test Code{" "}
        {fileName && <span className="text-gray-500 text-base">({fileName})</span>}
      </h2>
      <CodeEditor code={codeToShow} />
      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Back
      </button>
    </div>
  );
}