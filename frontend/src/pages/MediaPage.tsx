import React, { useState } from "react";
import {
  Image,
  Film,
  Upload,
  Grid,
  List,
  Filter,
  Search,
  MoreVertical,
} from "lucide-react";
import { UploadModal } from "../components/modals/UploadModal";
export const MediaPage = () => {
  const [view, setView] = useState("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [mediaType, setMediaType] = useState("all");
  const media = [
    {
      type: "image",
      url: "https://source.unsplash.com/random/800x600?1",
      name: "Project Screenshot",
      size: "2.4 MB",
      date: "2 days ago",
    },
    {
      type: "video",
      url: "https://source.unsplash.com/random/800x600?2",
      name: "Product Demo",
      size: "15.8 MB",
      date: "5 days ago",
    },
    {
      type: "image",
      url: "https://source.unsplash.com/random/800x600?3",
      name: "Team Photo",
      size: "1.2 MB",
      date: "1 week ago",
    },
    {
      type: "image",
      url: "https://source.unsplash.com/random/800x600?4",
      name: "Office Space",
      size: "3.5 MB",
      date: "3 days ago",
    },
    {
      type: "video",
      url: "https://source.unsplash.com/random/800x600?5",
      name: "Tutorial Video",
      size: "2.8 MB",
      date: "4 days ago",
    },
    {
      type: "image",
      url: "https://source.unsplash.com/random/800x600?6",
      name: "Event Coverage",
      size: "1.8 MB",
      date: "2 weeks ago",
    },
    {
      type: "image",
      url: "https://source.unsplash.com/random/800x600?7",
      name: "Marketing Asset",
      size: "2.1 MB",
      date: "1 month ago",
    },
    {
      type: "video",
      url: "https://source.unsplash.com/random/800x600?8",
      name: "Client Presentation",
      size: "3.2 MB",
      date: "6 days ago",
    },
  ];
  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Media Library</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Upload size={20} />
          <span>Upload Media</span>
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search media..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setMediaType("all")}
                className={`px-4 py-2 rounded-lg ${
                  mediaType === "all"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                All Media
              </button>
              <button
                onClick={() => setMediaType("images")}
                className={`px-4 py-2 rounded-lg ${
                  mediaType === "images"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Images
              </button>
              <button
                onClick={() => setMediaType("videos")}
                className={`px-4 py-2 rounded-lg ${
                  mediaType === "videos"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Videos
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg ${
                view === "list" ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <List size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg ${
                view === "grid" ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <Grid size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
        {view === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item, index) => (
              <MediaCard key={index} {...item} />
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {media.map((item, index) => (
              <MediaListItem key={index} {...item} />
            ))}
          </div>
        )}
      </div>
      <UploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
    </div>
  );
};
const MediaCard = ({ type, url, name }) => {
  return (
    <div className="group relative rounded-lg overflow-hidden">
      <img src={url} alt={name} className="w-full h-48 object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all">
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {type === "video" ? (
            <Film className="text-white" size={24} />
          ) : (
            <Image className="text-white" size={24} />
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
        <p className="text-white text-sm truncate">{name}</p>
      </div>
    </div>
  );
};
const MediaListItem = ({ type, url, name, size, date }) => {
  return (
    <div className="flex items-center space-x-4 py-4 hover:bg-gray-50 px-4">
      <div className="w-16 h-16 relative rounded overflow-hidden">
        <img src={url} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          {type === "video" ? (
            <Film className="text-white" size={20} />
          ) : (
            <Image className="text-white" size={20} />
          )}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-gray-500">{size}</p>
      </div>
      <div className="text-sm text-gray-500">{date}</div>
      <button className="p-2 hover:bg-gray-100 rounded-full">
        <MoreVertical size={20} className="text-gray-500" />
      </button>
    </div>
  );
};
