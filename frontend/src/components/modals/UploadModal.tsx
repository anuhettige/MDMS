// UploadModal.tsx - Enhanced version with dark mode support
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { X, Upload, File, CheckCircle, AlertCircle } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  userId: string;
  onUploadComplete?: () => void;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  currentPath,
  userId,
  onUploadComplete,
}) => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dark mode detection (same as DocumentsPage)
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  if (!isOpen) return null;

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newUploads: UploadProgress[] = Array.from(files).map((file) => ({
      file,
      progress: 0,
      status: "pending",
    }));

    setUploads((prev) => [...prev, ...newUploads]);
  };

  const uploadFile = async (uploadItem: UploadProgress, index: number) => {
    const { file } = uploadItem;

    // Update status to uploading
    setUploads((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, status: "uploading" as const } : item
      )
    );

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadPath = currentPath
        ? `${currentPath}/${file.name}`
        : file.name;
      const uploadUrl = `http://localhost:8080/api/files/upload/${userId}/${uploadPath}`;

      await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploads((prev) =>
              prev.map((item, i) =>
                i === index ? { ...item, progress } : item
              )
            );
          }
        },
      });

      // Mark as completed
      setUploads((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, status: "completed" as const, progress: 100 }
            : item
        )
      );
    } catch (error) {
      console.error("Upload failed:", error);
      setUploads((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                status: "error" as const,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : item
        )
      );
    }
  };

  const startUploads = async () => {
    const pendingUploads = uploads
      .map((upload, index) => ({ upload, index }))
      .filter(({ upload }) => upload.status === "pending");

    if (pendingUploads.length === 0) return;

    // Upload files in parallel (you can make this sequential if needed)
    const uploadPromises = pendingUploads.map(({ upload, index }) =>
      uploadFile(upload, index)
    );

    await Promise.allSettled(uploadPromises);

    // Call the completion callback after all uploads
    if (onUploadComplete) {
      console.log("All uploads completed, calling onUploadComplete");
      onUploadComplete();
    }
  };

  const handleClose = () => {
    // Check if there are ongoing uploads
    const hasOngoingUploads = uploads.some(
      (upload) => upload.status === "uploading"
    );

    if (hasOngoingUploads) {
      if (
        !window.confirm(
          "There are ongoing uploads. Are you sure you want to close?"
        )
      ) {
        return;
      }
    }

    // Reset uploads and close
    setUploads([]);
    onClose();
  };

  const removeUpload = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const allCompleted =
    uploads.length > 0 &&
    uploads.every(
      (upload) => upload.status === "completed" || upload.status === "error"
    );

  const hasErrors = uploads.some((upload) => upload.status === "error");
  const completedCount = uploads.filter(
    (upload) => upload.status === "completed"
  ).length;

  // Dynamic classes based on theme
  const modalBg = isDarkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-600";
  const textTertiary = isDarkMode ? "text-gray-500" : "text-gray-500";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const uploadAreaBg = isDarkMode ? "bg-gray-700" : "bg-gray-50";
  const uploadAreaBorder = isDarkMode ? "border-gray-600" : "border-gray-300";
  const uploadAreaHover = isDarkMode
    ? "hover:border-gray-500"
    : "hover:border-gray-400";
  const dragActiveBg = isDarkMode ? "bg-blue-900/20" : "bg-blue-50";
  const dragActiveBorder = isDarkMode ? "border-blue-500" : "border-blue-400";
  const buttonText = isDarkMode
    ? "text-gray-400 hover:text-gray-200"
    : "text-gray-400 hover:text-gray-600";
  const linkText = isDarkMode
    ? "text-blue-400 hover:text-blue-300"
    : "text-blue-600 hover:text-blue-700";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${modalBg} rounded-xl shadow-xl w-full max-w-md mx-4`}>
        <div
          className={`flex items-center justify-between p-6 border-b ${borderColor}`}
        >
          <h2 className={`text-xl font-semibold ${textPrimary}`}>
            Upload Files
          </h2>
          <button
            onClick={handleClose}
            className={`${buttonText} transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? `${dragActiveBorder} ${dragActiveBg}`
                : `${uploadAreaBorder} ${uploadAreaHover}`
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className={`mx-auto mb-4 ${textSecondary}`} size={48} />
            <p className={`${textSecondary} mb-2`}>
              Drag and drop files here, or{" "}
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`${linkText} underline`}
              >
                browse
              </button>
            </p>
            <p className={`text-sm ${textTertiary}`}>
              {currentPath
                ? `Uploading to: ${currentPath}`
                : "Uploading to root folder"}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          {/* Upload List */}
          {uploads.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-medium ${textPrimary}`}>
                  Files to Upload ({uploads.length})
                </h3>
                {allCompleted && (
                  <span
                    className={`text-sm ${
                      hasErrors ? "text-orange-600" : "text-green-600"
                    }`}
                  >
                    {completedCount} of {uploads.length} completed
                    {hasErrors &&
                      ` (${uploads.length - completedCount} failed)`}
                  </span>
                )}
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {uploads.map((upload, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${uploadAreaBg}`}
                  >
                    <File
                      size={20}
                      className={`${textTertiary} flex-shrink-0`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${textPrimary} truncate`}
                      >
                        {upload.file.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`flex-1 rounded-full h-2 ${
                            isDarkMode ? "bg-gray-600" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className={`h-2 rounded-full transition-all ${
                              upload.status === "completed"
                                ? "bg-green-500"
                                : upload.status === "error"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${upload.progress}%` }}
                          />
                        </div>
                        <span className={`text-xs ${textTertiary} w-10`}>
                          {upload.progress}%
                        </span>
                      </div>
                      {upload.error && (
                        <p className="text-xs text-red-600 mt-1">
                          {upload.error}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      {upload.status === "completed" && (
                        <CheckCircle size={20} className="text-green-500" />
                      )}
                      {upload.status === "error" && (
                        <AlertCircle size={20} className="text-red-500" />
                      )}
                      {upload.status === "pending" && (
                        <button
                          onClick={() => removeUpload(index)}
                          className={`${textSecondary} hover:text-red-500 transition-colors`}
                          title="Remove"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-between p-6 border-t ${borderColor}`}
        >
          <button
            onClick={handleClose}
            className={`px-4 py-2 ${textSecondary} hover:${textPrimary} transition-colors`}
          >
            {allCompleted ? "Close" : "Cancel"}
          </button>

          <div className="flex space-x-3">
            {uploads.length > 0 && !allCompleted && (
              <button
                onClick={() => setUploads([])}
                className={`px-4 py-2 ${textSecondary} hover:${textPrimary} transition-colors`}
              >
                Clear All
              </button>
            )}

            <button
              onClick={startUploads}
              disabled={
                uploads.length === 0 ||
                uploads.every((u) => u.status !== "pending")
              }
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploads.some((u) => u.status === "uploading")
                ? "Uploading..."
                : "Upload Files"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
