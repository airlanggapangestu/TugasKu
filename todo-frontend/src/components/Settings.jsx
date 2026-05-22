import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useLayout } from "../context/LayoutContext";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, toggleTheme } = useLayout();

  // Profile
  const [fullName, setFullName] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFullName(parsed.full_name || "");
    }
  }, [token, navigate]);

  const handleUpdateProfile = async () => {
    setProfileMsg("");
    setProfileError("");
    if (!fullName.trim()) {
      setProfileError("Nama harus diisi");
      return;
    }
    try {
      const res = await fetch(`/api/update_profile.php?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setProfileMsg("Profil berhasil diupdate!");
        setTimeout(() => setProfileMsg(""), 3000);
      } else {
        setProfileError(data.error);
      }
    } catch {
      setProfileError("Gagal terhubung ke server");
    }
  };

  const handleChangePassword = async () => {
    setPasswordMsg("");
    setPasswordError("");
    if (!currentPassword || !newPassword) {
      setPasswordError("Semua field harus diisi");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password baru minimal 8 karakter");
      return;
    }
    try {
      const res = await fetch(`/api/change_password.php?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordMsg(data.message);
        setCurrentPassword("");
        setNewPassword("");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }, 2000);
      } else {
        setPasswordError(data.error);
      }
    } catch {
      setPasswordError("Gagal terhubung ke server");
    }
  };

  if (!user && !token) return null;

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "appearance", label: "Appearance" },
  ];

  return (
    <div className="max-w-[800px] mx-auto">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-[var(--border)]/20 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-[12px] font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab.id
                ? "text-[var(--primary-text)] font-bold"
                : "text-[var(--text-secondary)] hover:text-[var(--text)]"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--primary)]" />
            )}
          </button>
        ))}
      </div>

      {/* PROFILE */}
      {activeTab === "profile" && (
        <div className="bg-[var(--bg-surface-low)] border border-[var(--border)]/10 rounded-xl p-6 md:p-8">
          <h3 className="text-[20px] font-semibold text-[var(--text)] mb-6">
            Public Profile
          </h3>
          {profileMsg && (
            <div className="bg-[#73dc8d]/10 border border-[#73dc8d] text-[var(--success)] px-4 py-3 rounded-lg text-sm mb-4">
              {profileMsg}
            </div>
          )}
          {profileError && (
            <div className="bg-[var(--danger-bg)]/20 border border-[#ffb4ab] text-[var(--danger)] px-4 py-3 rounded-lg text-sm mb-4">
              {profileError}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#282a2f] border border-[var(--border)]/20">
                <img
                  src={`https://ui-avatars.com/api/?name=${fullName || "User"}&size=128&background=5865f2&color=fff&bold=true`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[12px] text-[var(--text-secondary)] text-center">
                Avatar otomatis berdasarkan nama
              </span>
            </div>
            <div className="flex-1 w-full space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[var(--text)] mb-1.5">
                  Display Name
                </label>
                <input
                  className="w-full bg-[var(--bg-surface-high)] border border-[var(--border)]/30 rounded-lg px-4 py-2.5 text-[14px] text-[var(--text)] focus:outline-none focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] transition-colors"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[var(--text)] mb-1.5">
                  Email Address
                </label>
                <input
                  className="w-full bg-[var(--bg-surface-high)] border border-[var(--border)]/30 rounded-lg px-4 py-2.5 text-[14px] text-[var(--text-secondary)] focus:outline-none"
                  value={user?.email || ""}
                  readOnly
                />
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  Email tidak dapat diubah.
                </p>
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleUpdateProfile}
                  className="bg-[var(--primary)] text-white font-bold text-[12px] px-6 py-2.5 rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY */}
      {activeTab === "security" && (
        <div className="bg-[var(--bg-surface-low)] border border-[var(--border)]/10 rounded-xl p-6 md:p-8">
          <h3 className="text-[20px] font-semibold text-[var(--text)] mb-2">
            Change Password
          </h3>
          <p className="text-[14px] text-[var(--text-secondary)] mb-6">
            Ensure your account is using a long, random password to stay secure.
          </p>
          {passwordMsg && (
            <div className="bg-[#73dc8d]/10 border border-[#73dc8d] text-[var(--success)] px-4 py-3 rounded-lg text-sm mb-4">
              {passwordMsg}
            </div>
          )}
          {passwordError && (
            <div className="bg-[var(--danger-bg)]/20 border border-[#ffb4ab] text-[var(--danger)] px-4 py-3 rounded-lg text-sm mb-4">
              {passwordError}
            </div>
          )}

          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-[var(--text)] mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                className="w-full bg-[var(--bg-surface-high)] border border-[var(--border)]/30 rounded-lg px-4 py-2.5 text-[14px] text-[var(--text)] focus:outline-none focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] transition-colors"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[var(--text)] mb-1.5">
                New Password
              </label>
              <input
                type="password"
                className="w-full bg-[var(--bg-surface-high)] border border-[var(--border)]/30 rounded-lg px-4 py-2.5 text-[14px] text-[var(--text)] focus:outline-none focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] transition-colors"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
              />
            </div>
            <div className="pt-4">
              <button
                onClick={handleChangePassword}
                className="bg-[var(--bg-hover)] text-[var(--text)] font-bold text-[12px] px-6 py-2.5 rounded-lg hover:bg-[#454655] border border-[var(--border)]/30 transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPEARANCE */}
      {activeTab === "appearance" && (
        <div className="bg-[var(--bg-surface-low)] border border-[var(--border)]/10 rounded-xl p-6 md:p-8">
          <h3 className="text-[20px] font-semibold text-[var(--text)] mb-2">
            Theme Preferences
          </h3>
          <p className="text-[14px] text-[var(--text-secondary)] mb-8">
            Customize the look and feel of your workspace.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            {/* Dark Theme */}
            <label
              className="cursor-pointer"
              onClick={() => toggleTheme("dark")}
            >
              <div
                className={`rounded-xl border-2 transition-all overflow-hidden relative ${theme === "dark" ? "border-[#5865f2]" : "border-transparent hover:border-[var(--border)]/50"}`}
              >
                <div className="w-full h-32 bg-[#313338] rounded-lg border border-[#1E1F22] flex flex-col p-3 gap-2">
                  <div className="w-full h-4 bg-[var(--bg-input)] rounded flex items-center px-2 gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
                    <div className="w-12 h-1.5 bg-[#454655] rounded-full"></div>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <div className="w-1/4 h-full bg-[#2B2D31] rounded"></div>
                    <div className="w-3/4 h-full bg-[#313338] rounded border border-[#1E1F22] p-2 flex flex-col gap-2">
                      <div className="w-3/4 h-2 bg-[#454655] rounded"></div>
                      <div className="w-1/2 h-2 bg-[#454655] rounded"></div>
                    </div>
                  </div>
                </div>
                {theme === "dark" && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center">
                    <Check size={14} />
                  </div>
                )}
              </div>
              <div className="mt-3 text-center">
                <span className="text-[12px] font-bold text-[var(--text)] block mb-1">
                  Focus Dark
                </span>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Default, high contrast
                </span>
              </div>
            </label>

            {/* Light Theme */}
            <label
              className="cursor-pointer"
              onClick={() => toggleTheme("light")}
            >
              <div
                className={`rounded-xl border-2 transition-all overflow-hidden relative ${theme === "light" ? "border-[#5865f2]" : "border-transparent hover:border-[var(--border)]/50"}`}
              >
                <div className="w-full h-32 bg-[#F2F3F5] rounded-lg border border-[#E3E5E8] flex flex-col p-3 gap-2">
                  <div className="w-full h-4 bg-[#FFFFFF] rounded flex items-center px-2 gap-2 border border-[#E3E5E8]">
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
                    <div className="w-12 h-1.5 bg-[#D1D5DB] rounded-full"></div>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <div className="w-1/4 h-full bg-[#E3E5E8] rounded"></div>
                    <div className="w-3/4 h-full bg-[#FFFFFF] rounded border border-[#E3E5E8] p-2 flex flex-col gap-2">
                      <div className="w-3/4 h-2 bg-[#D1D5DB] rounded"></div>
                      <div className="w-1/2 h-2 bg-[#D1D5DB] rounded"></div>
                    </div>
                  </div>
                </div>
                {theme === "light" && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center">
                    <Check size={14} />
                  </div>
                )}
              </div>
              <div className="mt-3 text-center">
                <span className="text-[12px] font-bold text-[var(--text)] block mb-1">
                  Clean Light
                </span>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  For bright environments
                </span>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
