import React from "react";
import { Bell, X } from "lucide-react";

// The NotificationsDropdown component displays a dropdown list of notifications
// It shows when the 'isOpen' prop is true and can be closed by calling the 'onClose' prop function.

export const NotificationsDropdown = ({ isOpen, onClose }) => {
  // Prevent the component from rendering when isOpen is false
  if (!isOpen) return null;

  // Example notifications array that could come from an API or state
  const notifications = [
    {
      id: 1,
      title: "New document shared",
      description: 'Alex shared "Q4 Report" with you',
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Comment on document",
      description: 'Sarah commented on "Project Proposal"',
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "System update",
      description: "System maintenance scheduled for tonight",
      time: "2 hours ago",
      unread: false,
    },
  ];

  return (
    // Dropdown container styled with absolute positioning, background, and shadow
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border z-50">
      {/* Header section with a title and a close button */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {/* Notifications title */}
          <h3 className="font-semibold">Notifications</h3>
          {/* Close button to close the dropdown */}
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Close notifications"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable area for notifications */}
      <div className="max-h-[400px] overflow-y-auto">
        {/* Map over the notifications array and render each notification */}

        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              notification.unread ? "bg-blue-50/50" : ""
            }`}
          >
            {/* Notification item containing an icon, title, description, and time */}

            <div className="flex gap-3">
              <div
                className={`mt-1 ${
                  notification.unread ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <Bell size={16} />
              </div>
              <div>
                {/* Title and description of the notification */}

                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-gray-600 text-sm">
                  {notification.description}
                </p>

                {/* Timestamp of the notification */}
                <p className="text-gray-400 text-xs mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder button at the bottom to redirect to a full notifications page */}
      <div className="p-4 border-t text-center">
        <button className="text-sm text-gray-600 hover:text-gray-900">
          View all notifications
        </button>
      </div>
    </div>
  );
};
