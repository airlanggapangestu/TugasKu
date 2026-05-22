import { useState, useEffect, useRef } from "react";
import { Bell, Clock, AlertTriangle, Calendar, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    total: 0,
    overdue: [],
    today: [],
    tomorrow: [],
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/get_notifications.php?token=${token}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data);
      }
    } catch {}
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ffb4ab";
      case "Med":
        return "#ffb959";
      case "Low":
        return "#8f8fa0";
      default:
        return "#8f8fa0";
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `${Math.abs(diff)} days overdue`;
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return date;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative text-[var(--text-secondary)] hover:text-[var(--primary-text)] transition-colors p-1 cursor-pointer"
      >
        <Bell size={20} />
        {notifications.total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#ffb4ab] text-black text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-[0_0_6px_rgba(255,180,171,0.4)]">
            {notifications.total > 9 ? "9+" : notifications.total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 border-b border-[var(--border)]/50 flex items-center justify-between bg-[var(--bg-surface)]">
            <h3 className="font-semibold text-[13px] text-[var(--text)] flex items-center gap-2">
              <Bell size={15} />
              Notifications
              {notifications.total > 0 && (
                <span className="bg-[var(--primary)] text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                  {notifications.total}
                </span>
              )}
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors p-1 rounded hover:bg-[var(--bg-hover)]"
            >
              <X size={14} />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
            {notifications.total === 0 ? (
              <div className="p-8 text-center text-[var(--text-secondary)] text-[13px] flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-hover)] flex items-center justify-center mb-3">
                  <Bell size={24} className="opacity-40" />
                </div>
                <p className="text-[var(--text)] font-medium">All caught up!</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  No pending deadlines 🎉
                </p>
              </div>
            ) : (
              <div className="py-1">
                {/* Overdue */}
                {notifications.overdue.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[10px] font-bold text-[var(--danger)] uppercase tracking-wider flex items-center gap-1.5 bg-[#ffb4ab]/5">
                      <AlertTriangle size={11} /> Overdue
                    </div>
                    {notifications.overdue.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => {
                          navigate("/active-tasks");
                          setOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors flex items-start gap-3 border-b border-[var(--border)]/20 last:border-0"
                      >
                        <span
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0 shadow-[0_0_6px_currentColor]"
                          style={{
                            backgroundColor: getPriorityColor(task.priority),
                            color: getPriorityColor(task.priority),
                          }}
                        ></span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-[var(--text)] truncate leading-tight">
                            {task.title}
                          </p>
                          <p className="text-[11px] text-[var(--danger)] mt-1 flex items-center gap-1">
                            <Clock size={10} /> {formatDate(task.due_date)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Today */}
                {notifications.today.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[10px] font-bold text-[var(--warning)] uppercase tracking-wider flex items-center gap-1.5 bg-[#ffb959]/5">
                      <Calendar size={11} /> Due Today
                    </div>
                    {notifications.today.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => {
                          navigate("/active-tasks");
                          setOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors flex items-start gap-3 border-b border-[var(--border)]/20 last:border-0"
                      >
                        <span
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0 shadow-[0_0_6px_currentColor]"
                          style={{
                            backgroundColor: getPriorityColor(task.priority),
                            color: getPriorityColor(task.priority),
                          }}
                        ></span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-[var(--text)] truncate leading-tight">
                            {task.title}
                          </p>
                          <p className="text-[11px] text-[var(--warning)] mt-1 flex items-center gap-1">
                            <Clock size={10} /> Today
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Tomorrow */}
                {notifications.tomorrow.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[10px] font-bold text-[var(--success)] uppercase tracking-wider flex items-center gap-1.5 bg-[#73dc8d]/5">
                      <Calendar size={11} /> Due Tomorrow
                    </div>
                    {notifications.tomorrow.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => {
                          navigate("/active-tasks");
                          setOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors flex items-start gap-3 border-b border-[var(--border)]/20 last:border-0"
                      >
                        <span
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0 shadow-[0_0_6px_currentColor]"
                          style={{
                            backgroundColor: getPriorityColor(task.priority),
                            color: getPriorityColor(task.priority),
                          }}
                        ></span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-[var(--text)] truncate leading-tight">
                            {task.title}
                          </p>
                          <p className="text-[11px] text-[var(--success)] mt-1 flex items-center gap-1">
                            <Clock size={10} /> Tomorrow
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
