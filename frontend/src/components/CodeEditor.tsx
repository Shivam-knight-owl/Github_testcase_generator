import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import { Editor } from '@toast-ui/react-editor';
import { useState } from "react";

export default function CodeEditor({ code }: { code: string }) {
  // Always wrap code in a code block (typescript by default)
  let codeBlock = code?.trim() || "";
  // Remove any leading/trailing triple backticks to avoid double code blocks
  codeBlock = codeBlock.replace(/^```[\w]*\n?/, "").replace(/```$/, "");
  codeBlock = `\`\`\`typescript\n${codeBlock}\n\`\`\``;

  const [editorTheme, setEditorTheme] = useState<"dark" | "light">(
    () => (localStorage.getItem("toastui-theme") as "dark" | "light") || "dark"
  );
  const [themeVersion, setThemeVersion] = useState(0);

  const toggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditorTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("toastui-theme", next);
      setThemeVersion(v => v + 1); // force re-render
      return next;
    });
  };

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/30 backdrop-blur-lg border border-white/40 shadow-lg hover:bg-white/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {editorTheme === "dark" ? (
              <>
                <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span className="font-['Inter'] text-sm font-medium text-gray-900">Dark</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-['Inter'] text-sm font-medium text-gray-900">Light</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Editor with enhanced styling */}
      <style>
        {`
          .toastui-editor-contents pre,
          .toastui-editor-contents code {
            font-size: 16px !important;
            line-height: 1.6 !important;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Consolas', monospace !important;
          }
          
          .toastui-editor-contents pre {
            padding: 20px !important;
            border-radius: 12px !important;
            margin: 16px 0 !important;
          }
          
          .toastui-editor .ProseMirror {
            padding: 24px !important;
            font-size: 16px !important;
          }
          
          .toastui-editor-toolbar {
            display: none !important;
          }
          
          .toastui-editor-mode-switch {
            display: none !important;
          }
          
          /* Hide all error indicators and squiggles */
          .toastui-editor .ProseMirror .error,
          .toastui-editor-contents .error,
          .CodeMirror-lint-marker,
          .CodeMirror-lint-marker-error,
          .cm-error,
          .hljs-comment.hljs-error,
          .hljs-error,
          [data-testid*="error"],
          .error-line,
          .syntax-error,
          .validation-error {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
          
          /* Remove error underlines and decorations */
          .toastui-editor-contents code[class*="language-"],
          .toastui-editor-contents pre[class*="language-"] {
            text-decoration: none !important;
            border: none !important;
            outline: none !important;
          }
          
          .toastui-editor-contents *[class*="error"],
          .toastui-editor-contents *[data-error],
          .toastui-editor-contents .hljs-built_in,
          .toastui-editor-contents .hljs-keyword {
            text-decoration: none !important;
            border-bottom: none !important;
            text-decoration-line: none !important;
            text-decoration-color: transparent !important;
          }
          
          /* Disable spell check and validation */
          .toastui-editor .ProseMirror {
            -webkit-text-decoration-skip: objects !important;
            text-decoration-skip-ink: auto !important;
            spellcheck: false !important;
          }
          
          /* Hide TypeScript/JavaScript specific error styling */
          .hljs .hljs-comment,
          .hljs .hljs-quote {
            text-decoration: none !important;
            color: #6a737d !important;
          }
        `}
      </style>
      
      <Editor
        key={editorTheme + "-" + themeVersion}
        initialValue={codeBlock}
        previewStyle="tab"
        height="600px"
        initialEditType="markdown"
        useCommandShortcut={true}
        toolbarItems={[]}
        // @ts-ignore
        initialTab="preview"
        hideModeSwitch={true}
        readOnly={true}
        theme={editorTheme}
      />
    </div>
  );
}
