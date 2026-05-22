import { LogOut } from "lucide-react";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop blur */}
      <div
        className="absolute inset-0 bg-[var(--bg)]/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-[var(--bg-input)] rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-[#ffb4ab]/10 flex items-center justify-center mb-4 border border-[#ffb4ab]/20">
            <LogOut size={32} className="text-[var(--danger)]" />
          </div>

          {/* Content */}
          <h2 className="text-[22px] sm:text-[24px] font-semibold text-[var(--text)] mb-2">
            Log out of Tugasku?
          </h2>
          <p className="text-[14px] text-[var(--text-secondary)] mb-6 max-w-sm">
            Are you sure you want to log out? You will need to sign back in to
            access your active tasks and dashboard.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg bg-[var(--bg-hover)] text-[var(--text)] hover:bg-[#454655] transition-colors font-bold text-[12px]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-4 rounded-lg bg-[#ffb4ab] text-[#111318] hover:bg-[#ffb4ab]/90 hover:shadow-[inset_0_0_8px_rgba(0,0,0,0.2)] transition-all duration-200 font-bold text-[12px]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
