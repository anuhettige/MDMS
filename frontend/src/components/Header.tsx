import React, { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import { ProfileDropdown } from "./dropdowns/ProfileDropdown";

interface HeaderProps {
  onMenuClick: () => void;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  userName = "Anu Hettige",
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center flex-1">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg mr-4"
          aria-label="Toggle menu"
        >
          <Menu size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        {/* Profile dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2"
            aria-label="User profile"
          >
            <img
              src="anu.jpg"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {userName}
            </span>
          </button>

          <ProfileDropdown
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
          />
        </div>
      </div>
    </header>
  );
};
