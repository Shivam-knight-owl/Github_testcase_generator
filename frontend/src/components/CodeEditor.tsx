import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

export default function CodeEditor({ code }: { code: string }) {
  // Always wrap code in a code block (typescript by default)
  let codeBlock = code?.trim() || "";
  // Remove any leading/trailing triple backticks to avoid double code blocks
  codeBlock = codeBlock.replace(/^```[\w]*\n?/, "").replace(/```$/, "");
  codeBlock = `\`\`\`typescript\n${codeBlock}\n\`\`\``;

  return (
    <div className="border rounded overflow-hidden">
      <Editor
        initialValue={codeBlock}
        previewStyle="tab"
        height="600px"
        initialEditType="markdown"
        useCommandShortcut={true}
        toolbarItems={[
          ['code', 'codeblock'],
        ]}
        // @ts-ignore
        initialTab="preview"
        hideModeSwitch={true}
        readOnly={true}
      />
    </div>
  );
}
