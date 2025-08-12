import React, { createContext, useContext, useState, useEffect } from "react";

export type FileEntry = { repo: string; path: string };

export type Summary = {
  filePath: string;
  fileContent: string;
  summary: string;
};

type AppStateContextType = {
  selectedFiles: FileEntry[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<FileEntry[]>>;
  summaries: Summary[];
  setSummaries: React.Dispatch<React.SetStateAction<Summary[]>>;
  testCodeMap: Record<string, string>;
  setTestCodeMap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Load from localStorage on mount ---
  const [selectedFiles, setSelectedFiles] = useState<FileEntry[]>(() => {
    const saved = localStorage.getItem("selectedFiles");
    return saved ? JSON.parse(saved) : [];
  });
  const [summaries, setSummaries] = useState<Summary[]>(() => {
    const saved = localStorage.getItem("summaries");
    return saved ? JSON.parse(saved) : [];
  });
  const [testCodeMap, setTestCodeMap] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("testCodeMap");
    return saved ? JSON.parse(saved) : {};
  });

  // --- Save to localStorage on change ---
  useEffect(() => {
    localStorage.setItem("selectedFiles", JSON.stringify(selectedFiles));
  }, [selectedFiles]);
  useEffect(() => {
    localStorage.setItem("summaries", JSON.stringify(summaries));
  }, [summaries]);
  useEffect(() => {
    localStorage.setItem("testCodeMap", JSON.stringify(testCodeMap));
  }, [testCodeMap]);

  return React.createElement(
    AppStateContext.Provider,
    { value: { selectedFiles, setSelectedFiles, summaries, setSummaries, testCodeMap, setTestCodeMap } },
    children
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};