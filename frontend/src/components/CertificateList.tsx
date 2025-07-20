import React from "react";
import { FileText, MoreVertical, Download, Share2 } from "lucide-react";

interface Document {
  name: string;
}

export const CertificateList: React.FC<{
  documents: Document[];
  isDarkMode?: boolean;
}> = ({ documents, isDarkMode = false }) => {
  // Classes for light/dark mode
  const headerClass = isDarkMode
    ? "border-b border-gray-700"
    : "border-b border-gray-300";
  const rowHover = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const dropdownBg = isDarkMode
    ? "bg-gray-800 border border-gray-700"
    : "bg-white border border-gray-100";
  const dropdownHover = isDarkMode
    ? "hover:bg-gray-700 text-white"
    : "hover:bg-gray-50 text-gray-900";
  const iconBg = isDarkMode ? "bg-blue-900" : "bg-blue-50";
  const iconColor = isDarkMode ? "text-blue-400" : "text-blue-500";
  const moreIconColor = isDarkMode ? "text-gray-400" : "text-gray-500";
  const btnHoverBg = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";

  return (
    <div>
      <table className="w-full">
        <thead>
          <tr className={headerClass}>
            <th className={`text-left py-3 px-4 ${textPrimary}`}>Name</th>
            <th className={`text-left py-3 px-4 ${textPrimary}`}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {documents.map((doc, index) => (
            <tr key={index} className={rowHover}>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded ${iconBg}`}>
                    <FileText size={20} className={iconColor} />
                  </div>
                  <span className={`font-medium ${textPrimary}`}>
                    {doc.name}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="relative group inline-block">
                  <button className={`p-1 rounded ${btnHoverBg}`}>
                    <MoreVertical size={20} className={moreIconColor} />
                  </button>
                  <div
                    className={`absolute right-0 mt-1 invisible group-hover:visible min-w-[160px] rounded-lg shadow-lg py-2 z-10 ${dropdownBg}`}
                  >
                    <button
                      className={`w-full px-4 py-2 text-left flex items-center space-x-2 ${dropdownHover}`}
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </button>
                    <button
                      className={`w-full px-4 py-2 text-left flex items-center space-x-2 ${dropdownHover}`}
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
