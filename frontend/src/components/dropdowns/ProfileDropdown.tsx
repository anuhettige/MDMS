import React from "react";
import { LogOut, Settings, User } from "lucide-react";

// ProfileDropdown component renders a dropdown menu with the user's profile information and options

export const ProfileDropdown = ({ isOpen, onClose, onNavigate }) => {
  // If the dropdown is not open (isOpen is false), return null to prevent rendering

  if (!isOpen) return null;

  return (
    // The dropdown container with absolute positioning, background, rounded corners, and shadow

    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50">
      {/* User Profile Section - Displaying the user's name and email */}

      <div className="p-3 border-b">
        <p className="font-medium">Anu Hettige</p>
        <p className="text-sm text-gray-500">anu.mpma@slpa.lk</p>
      </div>

      {/* Profile Options - Below the profile section */}

      <div className="p-2">
        <button className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-red-600">
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};
