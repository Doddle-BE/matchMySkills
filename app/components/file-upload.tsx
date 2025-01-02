import { Upload } from "lucide-react";
import React, { useState } from "react";

export function FileUpload({
  newFileIsSelected,
}: {
  newFileIsSelected: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      validateFileSize(e.target);
      newFileIsSelected();
    }
  };

  return (
    <div className="relative border-2 border-dashed border-gray-600/30 rounded-xl p-12 transition-all bg-gray-900/50 backdrop-blur-sm hover:border-indigo-500/50 hover:bg-gray-900/60">
      <div className="flex flex-col items-center text-center">
        {!selectedFile ? (
          <>
            <Upload className="h-12 w-12 text-indigo-400 mb-4" />
            <h3 className="mb-2 text-xl font-medium text-gray-200">
              Drop your job description here
            </h3>
            <p className="mb-4 text-sm text-gray-400">
              Supports DOC, DOCX, PDF, and TXT files
            </p>
          </>
        ) : (
          <div className="flex items-center space-x-2 bg-indigo-500/10 px-4 py-2 rounded-lg">
            <span className="text-indigo-300">{selectedFile.name}</span>
          </div>
        )}

        <input
          type="file"
          name="document"
          accept=".doc,.docx,.pdf,.txt"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {!selectedFile && (
          <span className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className="inline-flex items-center px-6 py-2 border border-indigo-500/30 text-sm font-medium rounded-lg text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors duration-200"
            >
              Select a file
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

function validateFileSize(input: HTMLInputElement) {
  const maxSize = 26214400; // Max size in bytes -- 25MB

  if (input.files && input.files[0]) {
    if (input.files[0].size > maxSize) {
      alert("File is too large. Maximum size is 25MB."); // Add user feedback
      input.value = "";
      return false;
    } else {
      return true;
    }
  }
}
