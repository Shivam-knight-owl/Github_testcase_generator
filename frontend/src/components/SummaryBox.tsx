import { Editor } from '@toast-ui/react-editor';

export default function SummaryBox({
  summary,
  loading,
  onGenerateTestCode,
  editorTheme,
  themeVersion,
  summaryRef,
}: {
  summary: { filePath: string; fileContent: string; summary: string };
  loading: boolean;
  onGenerateTestCode: () => void;
  editorTheme: "dark" | "light";
  themeVersion: number;
  summaryRef: any;
}) {
  // Clean the summary content by removing backticks and extra formatting
  const cleanSummary = summary.summary
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`([^`]+)`/g, '$1') // Remove inline code backticks
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
    .trim();

  return (
    <div className="bg-transparent">
      <style>
        {`
          .toastui-editor-contents p,
          .toastui-editor-contents li,
          .toastui-editor-contents div,
          .toastui-editor .ProseMirror {
            font-size: 14px !important;
            line-height: 1.6 !important;
            font-family: 'Inter', sans-serif !important;
          }
          
          .toastui-editor-contents h1,
          .toastui-editor-contents h2,
          .toastui-editor-contents h3,
          .toastui-editor-contents h4 {
            font-size: 16px !important;
            font-weight: 600 !important;
            margin: 12px 0 6px 0 !important;
          }
          
          @media (min-width: 640px) {
            .toastui-editor-contents p,
            .toastui-editor-contents li,
            .toastui-editor-contents div,
            .toastui-editor .ProseMirror {
              font-size: 16px !important;
            }
            
            .toastui-editor-contents h1,
            .toastui-editor-contents h2,
            .toastui-editor-contents h3,
            .toastui-editor-contents h4 {
              font-size: 18px !important;
              margin: 16px 0 8px 0 !important;
            }
          }
        `}
      </style>
      <Editor
        key={summary.filePath + "-summary-" + editorTheme + "-" + themeVersion}
        initialValue={cleanSummary}
        previewStyle="tab"
        height="250px"
        initialEditType="markdown"
        useCommandShortcut={true}
        ref={summaryRef}
        toolbarItems={[
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task'],
        ]}
        initialValueType="markdown"
        // @ts-ignore
        initialEditType="markdown"
        // @ts-ignore
        initialTab="write"
        theme={editorTheme}
      />
    </div>
  );
}

