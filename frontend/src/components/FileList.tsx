import { useNavigate } from "react-router-dom";

export default function FileList() {
  const navigate = useNavigate();
  const files = ["src/App.js", "src/utils/helper.js"]; // mock data

  return (
    <ul className="bg-white rounded shadow p-4">
      {files.map((file) => (
        <li
          key={file}
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() =>
            navigate("/file-summary", { state: { filePath: file } })
          }
        >
          {file}
        </li>
      ))}
    </ul>
  );
}
