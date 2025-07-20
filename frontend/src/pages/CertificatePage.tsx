import React from "react";
import { FileText, Download, Share2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const CertificatePage: React.FC = () => {
  const { userId, token, userType, username } = useAuth();

  const documents = [
    {
      name: "Download Certificate",
      downloadUrl: `http://localhost:8080/api/student/${userId}/certificate`,
    },
    {
      name: "Download Transcript",
      downloadUrl: `http://localhost:8080/api/student/${userId}/transcript`,
    },
  ];

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Certificates
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {documents.map((doc, index) => (
          <DocumentCard
            key={index}
            name={doc.name}
            downloadUrl={doc.downloadUrl}
            user={{ userId, token, userType, username }}
          />
        ))}
      </div>
    </div>
  );
};

// ✅ DocumentCard with large icon and improved UI
const DocumentCard: React.FC<{
  name: string;
  downloadUrl: string;
  user: { userId: string; token: string; userType: string; username: string };
}> = ({ name, downloadUrl, user }) => {
  const handleDownload = () => {
    fetch(downloadUrl, { method: "GET" })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to download");
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name.toLowerCase().includes("transcript")
          ? "transcript.pdf"
          : "certificate.pdf";
        a.click();
        window.URL.revokeObjectURL(url);

        console.log("Downloaded by:", user);
      })
      .catch((err) => {
        console.error("Download error:", err);
        alert("Failed to download the PDF.");
      });
  };

  return (
    <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-shadow group">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900">
          <FileText size={48} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {name}
        </h3>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
          >
            <Download size={16} />
            Download
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 text-sm transition-colors">
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};
