import React, { useEffect, useState } from "react";
import { FileText, BadgeCheck, Settings, Mail, Phone } from "lucide-react";

interface NavCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const Dashboard: React.FC = () => {
  // State to track dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if <html> has 'dark' class for tailwind dark mode
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Optional: listen to class changes (if your app toggles dark mode dynamically)
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Conditional classes based on detected mode
  const bgClass = isDarkMode ? "bg-gray-900" : "bg-gray-50";
  const cardBgClass = isDarkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-800";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-600";
  const cardShadow = isDarkMode ? "shadow-lg shadow-black/50" : "shadow";

  return (
    <div className={`flex-1 p-6 min-h-screen ${bgClass}`}>
      {/* Profile Section */}
      <div
        className={`${cardBgClass} p-6 rounded-xl ${cardShadow} mb-8 flex flex-col md:flex-row items-center md:items-start gap-6`}
      >
        <img
          src="anu.jpg"
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-indigo-300"
        />
        <div>
          <h2 className={`text-2xl font-bold ${textPrimary}`}>Anu Hettige</h2>
          <p className={`flex items-center gap-2 mt-1 ${textSecondary}`}>
            <Mail size={16} /> anu.mpma@slpa.lk
          </p>
          <p className={`flex items-center gap-2 mt-1 ${textSecondary}`}>
            <Phone size={16} /> +94 77 123 4567
          </p>
          <p className={`mt-3 text-sm ${textSecondary}`}>
            Welcome back! Here's your current status and quick access.
          </p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NavCard
          icon={<FileText className="text-indigo-600" size={32} />}
          title="My Documents"
          description="Manage and access your uploaded files"
          isDarkMode={isDarkMode}
        />
        <NavCard
          icon={<BadgeCheck className="text-green-600" size={32} />}
          title="My Certificates"
          description="View and download your certificates"
          isDarkMode={isDarkMode}
        />
        <NavCard
          icon={<Settings className="text-gray-600" size={32} />}
          title="Settings"
          description="Update your profile, password and preferences"
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

const NavCard: React.FC<NavCardProps & { isDarkMode: boolean }> = ({
  icon,
  title,
  description,
  isDarkMode,
}) => {
  const cardBgClass = isDarkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-800";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-500";
  const cardShadow = isDarkMode ? "shadow-lg shadow-black/50" : "shadow-md";

  return (
    <div
      className={`${cardBgClass} p-6 rounded-xl ${cardShadow} hover:shadow-lg transition cursor-pointer`}
    >
      <div className="flex items-center gap-4 mb-4">
        {icon}
        <h3 className={`text-lg font-semibold ${textPrimary}`}>{title}</h3>
      </div>
      <p className={`text-sm ${textSecondary}`}>{description}</p>
    </div>
  );
};
