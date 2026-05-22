import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LogoutModal from "../LogoutModal";
import { useLayout } from "../../context/LayoutContext";

export default function Layout() {
  const { showLogoutModal, setShowLogoutModal, handleLogout } = useLayout();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-['Inter']">
      <Sidebar />
      <Topbar />

      <main className="lg:ml-[240px] pt-16 pb-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-[var(--bg)]">
        <Outlet />
      </main>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
