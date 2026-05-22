import { Menu, X } from "lucide-react";
import NotificationDropdown from "../NotificationDropdown";
import { useLayout } from "../../context/LayoutContext";

export default function Topbar() {
  const { sidebarOpen, setSidebarOpen, topbarLeftContent } = useLayout();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-240px)] h-16 bg-[var(--bg)] shadow-sm z-20 flex justify-between items-center px-4 sm:px-6 lg:px-8 border-b border-[var(--border)]/10">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          className="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors shrink-0"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Konten kiri yang diisi oleh halaman (misal search bar) */}
        <div className="flex-1 min-w-0">{topbarLeftContent}</div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-4">
        <NotificationDropdown />
        <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--bg-hover)] border border-[var(--border)]/20 cursor-pointer">
          <img
            src={`https://ui-avatars.com/api/?name=${user?.full_name || "User"}&background=5865f2&color=fff&bold=true`}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
