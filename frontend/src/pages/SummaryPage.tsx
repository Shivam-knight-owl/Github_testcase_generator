import { useState, useEffect, useRef } from "react";
import api from "../api";
import { useAppState } from "../contexts/AppStateContext";
import { useNavigate } from "react-router-dom";
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

export default function SummaryPage() {
  const { selectedFiles, summaries, setSummaries, testCodeMap, setTestCodeMap } = useAppState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const navigate = useNavigate();

  // Only clear summaries if selectedFiles do not match summaries
  useEffect(() => {
    // Get all filePaths from selectedFiles and summaries
    const selectedPaths = selectedFiles.map(f => f.path).sort();
    const summaryPaths = summaries.map(s => s.filePath).sort();

    // If the selected files match the summaries, keep them
    const isSame =
      selectedPaths.length === summaryPaths.length &&
      selectedPaths.every((v, i) => v === summaryPaths[i]);

    if (isSame && summaries.length > 0) {
      setHasGenerated(true);
    } else {
      setSummaries([]);
      setHasGenerated(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFiles]);

  const generateSummaries = async () => {
    setLoading(true);
    setError("");
    try {
      const filesWithContent = await Promise.all(
        selectedFiles.map(async ({ repo, path }) => {
          const res = await api.get("/repos/file-content", {
            params: { repo, filePath: path },
            withCredentials: true
          });
          return {
            filePath: path,
            fileContent: (res.data as { fileContent: string }).fileContent
          };
        })
      );

      const res = await api.post("/generate-test-summaries", {
        files: filesWithContent
      }, {
        withCredentials: true
      });

      const data = res.data as { summaries?: { filePath: string; fileContent: string; summary: string }[] };
      setSummaries(data.summaries || []);
      setHasGenerated(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate summaries");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTestCode = async (summary: { filePath: string; fileContent: string; summary: string }) => {
    if (testCodeMap[summary.filePath]) {
      navigate("/editor", {
        state: {
          testCode: testCodeMap[summary.filePath],
          fileName: summary.filePath.replace(/\.[^/.]+$/, ".test$&")
        }
      });
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/generate-test-code", {
        filePath: summary.filePath,
        fileContent: summary.fileContent
      }, {
        withCredentials: true
      });

      const data = res.data as { testCode: string };
      setTestCodeMap(prev => ({ ...prev, [summary.filePath]: data.testCode }));

      navigate("/editor", {
        state: {
          testCode: data.testCode,
          fileName: summary.filePath.replace(/\.[^/.]+$/, ".test$&")
        }
      });
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to generate test code");
    } finally {
      setLoading(false);
    }
  };

  // Add refs for each summary editor
  const summaryEditors = useRef<{ [key: string]: any }>({});

  if (selectedFiles.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 mb-4">No files selected.</p>
        <button
          onClick={() => navigate("/repos")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Select Files
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test Case Summaries</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Back to Files
        </button>
      </div>

      {/* Show selected files before generating */}
      {!hasGenerated && (
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
            onClick={generateSummaries}
            disabled={selectedFiles.length === 0 || selectedFiles.length > 5 || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Generating Summaries..." : "Generate Summaries"}
          </button>
        </div>
      )}

      {loading && summaries.length === 0 && hasGenerated && (
        <div className="text-center py-8">
          <div className="text-gray-600">Generating test summaries...</div>
        </div>
      )}

      {hasGenerated && summaries.length > 0 && (
        <div className="space-y-6">
          {summaries.map((summary, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {summary.filePath}
                </h3>
                <button
                  onClick={() => handleGenerateTestCode(summary)}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {loading ? "Generating..." : "Generate Test Code"}
                </button>
              </div>
              <div className="prose prose-sm max-w-none">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Test Cases:</h4>
                {/* Toast UI Editor for summary (markdown mode) */}
                <Editor
                  key={summary.filePath + "-summary"}
                  initialValue={summary.summary}
                  previewStyle="tab"
                  height="220px"
                  initialEditType="markdown"
                  useCommandShortcut={true}
                  ref={el => { summaryEditors.current[summary.filePath] = el; }}
                  toolbarItems={[
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol', 'task'],
                  ]}
                  // Show write tab by default
                  initialValueType="markdown"
                  // @ts-ignore
                  initialEditType="markdown"
                  // @ts-ignore
                  initialTab="write"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasGenerated && summaries.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No summaries generated yet.
        </div>
      )}
    </div>
  );
}