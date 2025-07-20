import React, { useEffect, useState } from "react";
import {
  User,
  Shield,
  Palette,
  ChevronRight,
  Moon,
  Sun,
  Laptop,
  X,
  Eye,
  EyeOff,
  Save,
  Edit3,
} from "lucide-react";

// Theme Hook with localStorage persistence
const useTheme = () => {
  const [theme, setThemeState] = useState<"light" | "dark" | "system">(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return "system";
  });

  // Apply theme to document root
  const applyTheme = (themeToApply: "light" | "dark") => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(themeToApply);
  };

  const updateTheme = (newTheme: "light" | "dark" | "system") => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      applyTheme(systemPrefersDark ? "dark" : "light");
    } else {
      applyTheme(newTheme);
    }
  };

  // Listen to system theme changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e: MediaQueryListEvent) => {
      applyTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);

    // Initial apply
    applyTheme(mediaQuery.matches ? "dark" : "light");

    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  // On mount, apply theme
  useEffect(() => {
    if (theme === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      applyTheme(systemPrefersDark ? "dark" : "light");
    } else {
      applyTheme(theme);
    }
  }, []);

  return { theme, setTheme: updateTheme };
};

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme();

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    username: "",
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    username: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  const userId = "3"; // Hardcoded user id, replace with your auth logic

  // Fetch user data on mount
  useEffect(() => {
    fetch(`http://localhost:8080/api/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then((data) => {
        setUserData({
          fullName: data.student.fullName,
          email: data.username + "@example.com", // Or your logic to get email
          username: data.username,
        });
        setProfileForm({
          fullName: data.student.fullName,
          email: data.username + "@example.com",
          username: data.username,
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load user data");
      });
  }, [userId]);

  const handleSystem = () => {
    setTheme("system");
  };

  const handleProfileUpdate = async () => {
    if (!profileForm.fullName.trim()) {
      alert("Full name is required!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: {
            fullName: profileForm.fullName,
            nameWithInitials: "T.A. Hettige", // Replace with your logic if needed
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      const updatedUser = await response.json();

      setUserData((prev) => ({
        ...prev,
        fullName: updatedUser.student.fullName,
      }));
      setProfileForm((prev) => ({
        ...prev,
        fullName: updatedUser.student.fullName,
      }));
      alert("Profile updated successfully!");
      setShowProfileModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: passwordForm.newPassword,
        }),
      });

      if (!response.ok) throw new Error("Failed to update password");
      alert("Password updated successfully!");
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
            <SettingsSection
              title="Profile Settings"
              icon={<User size={20} />}
              description="Manage your account information"
            >
              <div className="flex items-center space-x-4 p-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face"
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-indigo-200"
                />
                <div className="flex-1">
                  <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={userData.fullName}
                        readOnly
                        className="flex-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => {
                          setProfileForm({
                            fullName: userData.fullName,
                            email: userData.email,
                            username: userData.username,
                          });
                          setShowProfileModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="email"
                        value={userData.email}
                        readOnly
                        className="flex-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={userData.username}
                      readOnly
                      className="flex-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Security"
              icon={<Shield size={20} />}
              description="Manage your security preferences"
            >
              <div className="space-y-4 p-4">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span>Change Password</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              </div>
            </SettingsSection>
          </div>
        </div>

        {/* THEME SETTINGS */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Palette size={20} />
              <span>Theme</span>
            </h2>
            <div className="space-y-3">
              {/* Light */}
              <button
                onClick={() => setTheme("light")}
                className={`w-full flex items-center justify-between p-3 rounded transition-colors ${
                  theme === "light"
                    ? "bg-blue-100 border border-blue-300 dark:bg-blue-900 dark:border-blue-600"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Sun size={20} />
                  <span>Light</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    theme === "light"
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-400"
                  }`}
                />
              </button>

              {/* Dark */}
              <button
                onClick={() => setTheme("dark")}
                className={`w-full flex items-center justify-between p-3 rounded transition-colors ${
                  theme === "dark"
                    ? "bg-blue-100 border border-blue-300 dark:bg-blue-900 dark:border-blue-600"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Moon size={20} />
                  <span>Dark</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    theme === "dark"
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-400"
                  }`}
                />
              </button>

              {/* System */}
              <button
                onClick={handleSystem}
                className={`w-full flex items-center justify-between p-3 rounded transition-colors ${
                  theme === "system"
                    ? "bg-blue-100 border border-blue-300 dark:bg-blue-900 dark:border-blue-600"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Laptop
                    size={20}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <span>System Default</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    theme === "system"
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-400"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        current: !showPasswords.current,
                      })
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.current ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        new: !showPasswords.new,
                      })
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.new ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        confirm: !showPasswords.confirm,
                      })
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Save size={16} />
                  <span>{loading ? "Saving..." : "Save"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, fullName: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-600 dark:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={profileForm.username}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-600 dark:text-gray-400"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProfileUpdate}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Save size={16} />
                  <span>{loading ? "Saving..." : "Save"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsSection = ({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <section className="p-6">
      <div className="flex items-center space-x-3 mb-4 text-indigo-600 dark:text-indigo-400">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {description}
      </p>
      {children}
    </section>
  );
};
