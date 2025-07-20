import React from "react";
import { X, Check } from "lucide-react";

// DocumentFilters component renders a filter modal for document filters (File Type, Date Modified, and Size)

export const DocumentFilters = ({ isOpen, onClose }) => {
  // If the filter modal is not open (isOpen is false), return null to prevent rendering

  if (!isOpen) return null;
  return (
    // The container for the filter modal, absolutely positioned with shadow and rounded corners

    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border p-4 z-10">
      <div className="flex justify-between items-center mb-4">
        {/* Modal Title and Close Button */}

        <h3 className="font-semibold">Filters</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          {/* Close button (X icon) */}

          <X size={16} />
        </button>
      </div>

      {/* Filter options: File Type, Date Modified, and Size */}

      <div className="space-y-4">
        {/* File Type Filter */}

        <div>
          <h4 className="text-sm font-medium mb-2">File Type</h4>
          <div className="space-y-2">
            {/* Mapping through file types to create checkbox filters */}

            {["PDF", "Word", "Excel", "PowerPoint", "Images"].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                {/* Checkbox for each file type */}

                <input type="checkbox" className="rounded text-blue-600" />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Modified Filter */}

        <div>
          <h4 className="text-sm font-medium mb-2">Date Modified</h4>
          <select className="w-full p-2 border rounded">
            {/* Dropdown options for date ranges */}

            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Custom range</option>
          </select>
        </div>

        {/* Size Filter */}

        <div>
          <h4 className="text-sm font-medium mb-2">Size</h4>
          <div className="space-y-2">
            {/* Mapping through file size options to create checkbox filters */}

            {["0-1 MB", "1-10 MB", "10-100 MB", "100+ MB"].map((size) => (
              <label key={size} className="flex items-center space-x-2">
                {/* Checkbox for each file size */}

                <input type="checkbox" className="rounded text-blue-600" />
                <span className="text-sm">{size}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons for clearing filters and applying selected filters */}

        <div className="pt-4 border-t flex justify-end space-x-3">
          {/* Clear All Button */}

          <button className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
            Clear All
          </button>

          {/* Apply Filters Button */}

          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
