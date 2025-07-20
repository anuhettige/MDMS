// DocumentsPage.tsx - Enhanced version with interactive delete modal
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  FileText,
  Folder as FolderIcon,
  MoreVertical,
  Upload,
  Grid,
  List,
  RefreshCw,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import { UploadModal } from "../components/modals/UploadModal";
import { DocumentList } from "../components/DocumentList";
import { useAuth } from "../context/AuthContext";

interface FileInfo {
  name: string;
  type: string;
  size: number;
  lastModified: string | null;
  folder: boolean;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isFolder: boolean;
  isDeleting: boolean;
}

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isFolder,
  isDeleting,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertTriangle
                size={20}
                className="text-red-600 dark:text-red-400"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete {isFolder ? "Folder" : "File"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            disabled={isDeleting}
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Are you sure you want to delete the {isFolder ? "folder" : "file"}:
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 border-l-4 border-red-500">
            <div className="flex items-center space-x-2">
              {isFolder ? (
                <FolderIcon size={16} className="text-yellow-500" />
              ) : (
                <FileText size={16} className="text-blue-500" />
              )}
              <span className="font-medium text-gray-900 dark:text-white truncate">
                {itemName}
              </span>
            </div>
          </div>
          {isFolder && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              ⚠️ This will delete the folder and all its contents permanently.
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition disabled:opacity-50 flex items-center space-x-2"
          >
            {isDeleting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const DocumentsPage = () => {
  const [documents, setDocuments] = useState<FileInfo[]>([]);
  const [view, setView] = useState("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    name: string;
    isFolder: boolean;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { userId } = useAuth();

  // Enhanced fetchFiles function with better error handling and loading states
  const fetchFiles = useCallback(
    async (forceRefresh = false) => {
      if (!userId) return;

      setIsLoading(true);
      try {
        // Add timestamp to prevent caching issues
        const timestamp = forceRefresh ? `&t=${Date.now()}` : "";
        const params = new URLSearchParams();

        if (currentPath) {
          params.append("folder", currentPath);
        }

        if (forceRefresh) {
          params.append("t", Date.now().toString());
        }

        const url = `http://localhost:8080/api/files/list/${userId}`;
        const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;

        console.log("Fetching files from:", fullUrl);

        const response = await axios.get(fullUrl, {
          // Add headers to prevent caching
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        const visibleDocs = response.data.filter(
          (doc: FileInfo) => !doc.name.endsWith(".placeholder")
        );

        console.log("Fetched documents:", visibleDocs);
        setDocuments(visibleDocs);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
        // You might want to show a toast notification here
      } finally {
        setIsLoading(false);
      }
    },
    [userId, currentPath]
  );

  // Initial load
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Dark mode detection
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

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return alert("Enter folder name");
    try {
      const trimmedFolder = newFolderName.trim();
      const path = currentPath
        ? `${currentPath}/${trimmedFolder}/.placeholder`
        : `${trimmedFolder}/.placeholder`;

      const emptyFile = new File([""], ".placeholder");
      const formData = new FormData();
      formData.append("file", emptyFile);

      await axios.post(
        `http://localhost:8080/api/files/upload/${userId}/${path}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setShowNewFolderInput(false);
      setNewFolderName("");

      // Force refresh after creating folder
      await fetchFiles(true);
    } catch (e) {
      console.error("Failed to create folder:", e);
      alert("Failed to create folder");
    }
  };

  // Open delete modal
  const handleDeleteClick = (name: string, isFolder: boolean) => {
    setItemToDelete({ name, isFolder });
    setShowDeleteModal(true);
  };

  // Confirm delete action
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const { name, isFolder } = itemToDelete;
      const path = currentPath ? `${currentPath}/${name}` : name;
      const endpoint = isFolder
        ? `http://localhost:8080/api/files/delete-folder/${userId}/${path}`
        : `http://localhost:8080/api/files/delete/${userId}/${path}`;

      await axios.delete(endpoint);

      // Close modal and reset state
      setShowDeleteModal(false);
      setItemToDelete(null);

      // Force refresh after deletion
      await fetchFiles(true);
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  // Close delete modal
  const handleDeleteCancel = () => {
    if (isDeleting) return; // Prevent closing while deleting
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // Enhanced upload complete handler
  const handleUploadComplete = async () => {
    console.log("Upload completed, refreshing file list...");
    // Wait a bit for the server to process the upload
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Force refresh the file list
    await fetchFiles(true);
  };

  const pageBg = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-gray-50 text-gray-900";
  const containerBg = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-100";

  const pathParts = currentPath ? currentPath.split("/") : [];

  const onBreadcrumbClick = (index: number) => {
    if (index === -1) setCurrentPath("");
    else setCurrentPath(pathParts.slice(0, index + 1).join("/"));
  };

  const onBackClick = () => {
    if (!currentPath) return;
    const parts = currentPath.split("/");
    parts.pop();
    setCurrentPath(parts.join("/"));
  };

  const sortedDocs = [...documents].sort((a, b) => {
    if (a.folder && !b.folder) return -1;
    if (!a.folder && b.folder) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className={`flex-1 p-6 overflow-auto min-h-screen ${pageBg}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Documents</h1>
        <div className="flex space-x-3 items-center">
          {/* Manual refresh button */}
          <button
            onClick={() => fetchFiles(true)}
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            title="Refresh files"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={() => setShowNewFolderInput(true)}
            className="text-white text-sm font-medium px-3 py-1 rounded bg-green-600 hover:bg-green-700 transition"
            style={{ minWidth: 110, height: 34 }}
          >
            + New Folder
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition text-sm font-medium"
            style={{ minHeight: 34 }}
          >
            <Upload size={18} />
            <span>Upload Files</span>
          </button>
        </div>
      </div>

      {showNewFolderInput && (
        <div className="mb-4 flex space-x-2 items-center">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="border rounded px-3 py-2 text-sm flex-1 bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ minHeight: 34 }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleCreateFolder();
              }
            }}
          />
          <button
            onClick={handleCreateFolder}
            className="px-3 py-2 rounded text-white text-sm font-medium bg-blue-600 hover:bg-blue-700 transition min-w-[90px]"
          >
            Create
          </button>
          <button
            onClick={() => {
              setShowNewFolderInput(false);
              setNewFolderName("");
            }}
            className="px-3 py-2 rounded border text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-100 transition min-w-[90px]"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="mb-4 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        {currentPath && (
          <button
            onClick={onBackClick}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back
          </button>
        )}
        <nav className="flex items-center space-x-1 select-none">
          <button
            onClick={() => onBreadcrumbClick(-1)}
            className={`hover:underline ${
              currentPath === ""
                ? "font-semibold text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Documents
          </button>
          {pathParts.map((part, idx) => (
            <span key={idx} className="flex items-center space-x-1">
              <span className="text-gray-400 dark:text-gray-600">/</span>
              <button
                onClick={() => onBreadcrumbClick(idx)}
                className={`hover:underline ${
                  idx === pathParts.length - 1
                    ? "font-semibold text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {part}
              </button>
            </span>
          ))}
        </nav>
      </div>

      <div className={`${containerBg} rounded-xl shadow-sm border p-6`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition ${
                view === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition ${
                view === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <Grid size={20} />
            </button>
          </div>

          {isLoading && (
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <RefreshCw size={16} className="animate-spin" />
              <span>Loading...</span>
            </div>
          )}
        </div>

        {sortedDocs.length === 0 && !isLoading ? (
          <div className="text-center py-12 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No files or folders found</p>
            <p className="text-sm">Upload some files to get started</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDocs.map((doc, index) => (
              <DocumentCard
                key={`${doc.name}-${index}`}
                name={doc.name}
                size={doc.size}
                date={doc.lastModified}
                isFolder={doc.folder}
                isDarkMode={isDarkMode}
                onFolderClick={(folderName) =>
                  setCurrentPath((prevPath) =>
                    prevPath ? `${prevPath}/${folderName}` : folderName
                  )
                }
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <DocumentList
            documents={sortedDocs}
            isDarkMode={isDarkMode}
            onDelete={handleDeleteClick}
            onFolderClick={(folderName) => {
              setCurrentPath((prev) =>
                prev ? `${prev}/${folderName}` : folderName
              );
            }}
            currentPath={currentPath}
            userId={userId}
          />
        )}
      </div>

      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        currentPath={currentPath}
        userId={userId}
        onUploadComplete={handleUploadComplete}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete?.name || ""}
        isFolder={itemToDelete?.isFolder || false}
        isDeleting={isDeleting}
      />
    </div>
  );
};

// DocumentCard component with updated delete handler
const DocumentCard = ({
  name,
  size,
  date,
  isFolder,
  isDarkMode,
  onFolderClick,
  onDelete,
}: {
  name: string;
  size: number;
  date: string | null;
  isFolder: boolean;
  isDarkMode: boolean;
  onFolderClick?: (folderName: string) => void;
  onDelete?: (name: string, isFolder: boolean) => void;
}) => {
  const cardBgClass = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-100";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-500";
  const hoverBg = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const folderName = name.replace(/\/$/, "");

  const handleClick = () => {
    if (isFolder && onFolderClick) onFolderClick(folderName);
  };

  return (
    <div
      onClick={handleClick}
      className={`${cardBgClass} p-4 rounded-lg border ${hoverBg} transition-shadow group ${
        isFolder ? "cursor-pointer" : ""
      } relative`}
      style={{ minHeight: 120 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded bg-blue-50">
          {isFolder ? (
            <FolderIcon size={24} className="text-yellow-500" />
          ) : (
            <FileText size={24} className="text-blue-500" />
          )}
        </div>
        <div className="relative flex items-center space-x-1">
          <button className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100">
            <MoreVertical size={20} className="text-gray-500" />
          </button>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(name, isFolder);
              }}
              className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 text-red-600"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      <h3
        className={`${textPrimary} font-medium mb-1 truncate`}
        title={name}
        style={{ fontSize: 16 }}
      >
        {name}
      </h3>
      {!isFolder && (
        <div className="flex items-center justify-between text-sm">
          <span className={textSecondary}>{formatFileSize(size)}</span>
          <span className={textSecondary}>
            {date ? new Date(date).toLocaleDateString() : "Unknown"}
          </span>
        </div>
      )}
    </div>
  );
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  else return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
