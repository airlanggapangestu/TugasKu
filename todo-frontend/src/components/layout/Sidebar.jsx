import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle2,
  FolderKanban,
  HelpCircle,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { useLayout } from "../../context/LayoutContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, setShowLogoutModal } = useLayout();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/active-tasks", icon: ClipboardList, label: "Active Tasks" },
    { to: "/done", icon: CheckCircle2, label: "Done" },
    { to: "/categories", icon: FolderKanban, label: "Categories" },
  ];

  const footerItems = [
    { to: "/help", icon: HelpCircle, label: "Help" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <nav
        className={`fixed h-full w-[240px] left-0 top-0 bg-[var(--bg-surface)] flex flex-col py-6 px-4 gap-4 border-r border-[var(--border)]/10 z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 pb-4 border-b border-[var(--border)]/10">
          <div className="w-8 h-8 rounded overflow-hidden flex items-center justify-center">
            <img
              src="/tugasku.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-[20px] font-semibold text-[var(--primary-text)] leading-tight">
              Tugasku
            </h1>
            <p className="text-[12px] text-[var(--text-secondary)] font-medium">
              Pro Focus
            </p>
          </div>
        </div>

        {/* Create Task */}
        <button
          onClick={() => {
            navigate("/create-task");
            setSidebarOpen(false);
          }}
          className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-[12px] py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[inset_0_1px_10px_rgba(255,255,255,0.1)]"
        >
          <Plus size={18} /> Create Task
        </button>

        {/* Main Nav */}
        <ul className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-[12px] transition-colors ${
                  isActive(item.to)
                    ? "bg-[var(--primary)] text-white font-bold scale-[0.98]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                <item.icon size={20} /> {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer Nav */}
        <ul className="flex flex-col gap-1 pt-4 border-t border-[var(--border)]/10">
          {footerItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-[12px] transition-colors ${
                  isActive(item.to)
                    ? "bg-[var(--primary)] text-white font-bold scale-[0.98]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                <item.icon size={20} /> {item.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                setSidebarOpen(false);
                setShowLogoutModal(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-[var(--danger)] font-medium hover:bg-[var(--bg-hover)] transition-colors rounded-lg text-[12px]"
            >
              <LogOut size={20} /> Logout
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
