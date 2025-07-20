import React from "react";
import {
  FileText,
  Folder as FolderIcon,
  MoreVertical,
  Download,
  Trash,
  Edit2,
  Share2,
} from "lucide-react";

interface FileInfo {
  name: string;
  type: string;
  size: number;
  lastModified: string | null;
  folder: boolean;
}

interface DocumentListProps {
  documents: FileInfo[];
  isDarkMode?: boolean;
  onDelete?: (name: string, isFolder: boolean) => void;
  onFolderClick?: (folderName: string) => void;
  currentPath?: string;
  userId?: string; // Added userId prop
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isDarkMode = false,
  onDelete,
  onFolderClick,
  currentPath,
  userId,
}) => {
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const hoverBg = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    else return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFolderClick = (folderName: string) => {
    if (onFolderClick) {
      onFolderClick(folderName);
    }
  };

  const handleDelete = (
    name: string,
    isFolder: boolean,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(name, isFolder);
    }
  };

  const handleDownload = async (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!userId) {
      alert("User ID is required for download");
      return;
    }

    try {
      // Construct the file path
      const filePath = currentPath ? `${currentPath}/${fileName}` : fileName;

      // Create the download URL
      const downloadUrl = `http://localhost:8080/api/files/download/${userId}/${filePath}`;

      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      link.style.display = "none";

      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file");
    }
  };

  // Sort folders first then files, alphabetically
  const sortedDocuments = [...documents].sort((a, b) => {
    if (a.folder && !b.folder) return -1;
    if (!a.folder && b.folder) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full table-fixed border ${borderColor}`}>
        <thead>
          <tr
            className={`text-sm uppercase ${secondaryText} bg-gray-50 ${
              isDarkMode ? "bg-gray-800" : ""
            }`}
          >
            <th className="px-4 py-3 text-left w-1/3 font-medium">Name</th>
            <th className="px-4 py-3 text-left w-1/6 font-medium">Type</th>
            <th className="px-4 py-3 text-left w-1/6 font-medium">Size</th>
            <th className="px-4 py-3 text-left w-1/4 font-medium">
              Last Modified
            </th>
            <th className="px-4 py-3 text-left w-20 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedDocuments.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className={`px-4 py-8 text-center ${secondaryText}`}
              >
                No files or folders found
              </td>
            </tr>
          ) : (
            sortedDocuments.map((doc, index) => {
              const isFolder = doc.folder;
              const displayName = isFolder
                ? doc.name.replace(/\/$/, "")
                : doc.name;

              return (
                <tr
                  key={`${doc.name}-${index}`}
                  className={`group ${hoverBg} transition-colors ${
                    isFolder ? "cursor-pointer" : ""
                  } border-t ${borderColor}`}
                  onClick={() => {
                    if (isFolder) {
                      handleFolderClick(displayName);
                    }
                  }}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {isFolder ? (
                        <FolderIcon
                          className="text-yellow-500 flex-shrink-0"
                          size={20}
                        />
                      ) : (
                        <FileText
                          className="text-blue-500 flex-shrink-0"
                          size={20}
                        />
                      )}
                      <span
                        className={`${textColor} truncate font-medium`}
                        title={displayName}
                      >
                        {displayName}
                      </span>
                    </div>
                  </td>
                  <td className={`px-4 py-3 ${secondaryText} text-sm`}>
                    {isFolder ? "Folder" : doc.type || "Unknown"}
                  </td>
                  <td className={`px-4 py-3 ${secondaryText} text-sm`}>
                    {isFolder ? "-" : formatFileSize(doc.size)}
                  </td>
                  <td className={`px-4 py-3 ${secondaryText} text-sm`}>
                    {doc.lastModified
                      ? new Date(doc.lastModified).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {!isFolder && (
                        <button
                          onClick={(e) => handleDownload(doc.name, e)}
                          title="Download"
                          className={`p-1 rounded hover:bg-gray-200 ${
                            isDarkMode ? "hover:bg-gray-600" : ""
                          } transition-colors`}
                        >
                          <Download size={14} className={secondaryText} />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(doc.name, isFolder, e)}
                        title={`Delete ${isFolder ? "folder" : "file"}`}
                        className="p-1 rounded hover:bg-red-100 transition-colors"
                      >
                        <Trash size={14} className="text-red-500" />
                      </button>
                      <button
                        title="More options"
                        className={`p-1 rounded hover:bg-gray-200 ${
                          isDarkMode ? "hover:bg-gray-600" : ""
                        } transition-colors`}
                      >
                        <MoreVertical size={14} className={secondaryText} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
