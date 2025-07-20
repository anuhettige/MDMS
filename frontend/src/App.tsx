import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { DocumentsPage } from "./pages/DocumentsPage";
import { MediaPage } from "./pages/MediaPage";
import { SettingsPage } from "./pages/SettingsPage";
import { CertificatePage } from "./pages/CertificatePage";
import { LoginPage } from "./pages/LogingPage";

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [userId, setUserId] = useState<number | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);

  // New dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or system preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) return saved === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Apply/remove 'dark' class on <html> when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  const handleLoginSuccess = (id: number, token: string) => {
    setUserId(id);
    setAccessToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", id.toString());
    setCurrentPage("dashboard");
  };

  const renderPage = () => {
    if (!user) {
      return <LoginPage onLoginSuccess={(username) => setUser(username)} />;
    }

    switch (currentPage) {
      case "documents":
        return <DocumentsPage />;
      case "media":
        return <MediaPage />;
      case "settings":
        return <SettingsPage />;
      case "certificates":
        return <CertificatePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {user && (
        <div
          className={`fixed lg:sticky top-0 z-40 h-screen transition-all duration-300 ease-in-out ${
            sidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onNavigate={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}
      <div className="flex-1 flex flex-col">
        {user && (
          <Header
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode((d) => !d)}
          />
        )}
        <main className="flex-1 overflow-auto">{renderPage()}</main>
      </div>
    </div>
  );
}
