import React from "react";
import {
  LayoutDashboard,
  Files,
  Settings,
  FolderOpen,
  Calendar,
  Award,
} from "lucide-react";

export const Sidebar = ({ isOpen, onNavigate, currentPage }) => {
  return (
    <div
      className={`
        fixed lg:relative
        h-screen bg-gray-900 text-white
        transition-all duration-3 ease-in-out
        ${isOpen ? "w-64" : "w-0 lg:w-20"}
        overflow-hidden
      `}
    >
      <div className={`p-6 ${!isOpen && "lg:p-4"}`}>
        {/* Adjust padding for collapsed state */}
        <div className="mb-8 flex items-center justify-center">
          <img
            src="mahapola.jpg"
            alt="Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <h1 className={`text-base font-bold ml-3 ${!isOpen && "lg:hidden"}`}>
            Mahapola Ports & Maritime Academy
          </h1>
        </div>
        <nav className="space-y-2">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text="Dashboard"
            active={currentPage === "dashboard"}
            isOpen={isOpen}
            onClick={() => onNavigate("dashboard")}
          />
          <SidebarItem
            icon={<Files size={20} />}
            text="Documents"
            active={currentPage === "documents"}
            isOpen={isOpen}
            onClick={() => onNavigate("documents")}
          />
          <SidebarItem
            icon={<Award size={20} />}
            text="Certificates"
            active={currentPage === "certificates"}
            isOpen={isOpen}
            onClick={() => onNavigate("certificates")}
          />
          <SidebarItem
            icon={<Settings size={20} />}
            text="Settings"
            active={currentPage === "settings"}
            isOpen={isOpen}
            onClick={() => onNavigate("settings")}
          />
        </nav>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, active = false, isOpen, onClick }) => {
  // Determine the icon size based on the sidebar state
  const iconSize = isOpen ? 20 : 18;

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center
        p-3 rounded-lg cursor-pointer transition-colors
        ${active ? "bg-blue-600" : "hover:bg-gray-800"}
        ${!isOpen && "lg:justify-center"}
      `}
    >
      {/* Clone the icon element and dynamically set the size */}
      {React.cloneElement(icon, { size: iconSize })}
      <span className={`ml-3 ${!isOpen && "lg:hidden"}`}>{text}</span>
    </div>
  );
};
