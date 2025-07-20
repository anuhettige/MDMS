import React from "react";
import { X, Eye, EyeOff } from "lucide-react";

// ChangePasswordModal component: Displays a modal for users to change their password

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  // If the modal is not open, do not render it

  if (!isOpen) return null;
  return (
    // Fullscreen overlay with semi-transparent black background

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal box container */}

      <div className="bg-white rounded-xl w-full max-w-md p-6">
        {/* Modal header with title and close button */}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            {/* Close icon */}

            <X size={20} />
          </button>
        </div>

        {/* Password change form */}

        <form className="space-y-4">
          {/* Current Password Input */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <div className="relative">
              {/* Password input field */}

              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter current password"
              />

              {/* Eye icon for toggle visibility (functionality not yet implemented) */}

              <button className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                <Eye size={20} />
              </button>
            </div>
          </div>

          {/* New Password Input */}

          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter new password"
              />
              <button className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                <Eye size={20} />
              </button>
            </div>
          </div>

          {/* Confirm New Password Input */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Confirm new password"
              />
              <button className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                <Eye size={20} />
              </button>
            </div>
          </div>

          {/* Action buttons: Cancel and Update Password */}

          <div className="flex justify-end space-x-3 mt-6">
            {/* Cancel button closes the modal */}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>

            {/* Submit button (not connected to form logic yet) */}

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
