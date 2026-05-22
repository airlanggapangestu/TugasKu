import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2,
  RotateCcw,
  Trash2,
  ChevronDown,
  Search,
  XCircle,
} from "lucide-react";
import { useLayout } from "../context/LayoutContext";

export default function DoneTasks() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { setTopbarLeftContent } = useLayout();

  // Fetch tasks
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, [token, navigate]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/get_done_tasks.php?token=${token}`);
      const data = await res.json();
      if (data.success) setTasks(data.tasks);
    } catch (err) {
      console.log("Gagal fetch done tasks");
    }
  };

  // Pasang search bar di topbar
  useEffect(() => {
    setTopbarLeftContent(
      <div className="relative w-full max-w-[200px] sm:w-64">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <input
          className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-full py-2 pl-10 pr-10 text-[14px] text-[var(--text)] focus:outline-none focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] transition-colors placeholder:text-[var(--text-muted)]"
          placeholder="Search completed..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--danger)]"
          >
            <XCircle size={16} />
          </button>
        )}
      </div>,
    );
    return () => setTopbarLeftContent(null);
  }, [searchQuery, setTopbarLeftContent]);

  const handleRestore = async (taskId) => {
    try {
      const res = await fetch(`/api/restore_task.php?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId }),
      });
      const data = await res.json();
      if (data.success) fetchTasks();
    } catch {
      console.log("Gagal restore task");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/delete_task.php?token=${token}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: confirmDelete }),
      });
      const data = await res.json();
      if (data.success) {
        fetchTasks();
        setConfirmDelete(null);
      }
    } catch {
      console.log("Gagal delete task");
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter lokal
  const filteredTasks = tasks.filter((task) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(q) ||
      (task.category_name && task.category_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header tanpa search */}
      <div className="mb-8">
        <h1 className="text-[26px] sm:text-[32px] font-bold text-[var(--text)] mb-2">
          Done Tasks
        </h1>
        <p className="text-[14px] sm:text-[16px] text-[var(--text-secondary)]">
          Archive of your completed work.
        </p>
      </div>

      {/* Archive List */}
      <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--border)] bg-[var(--bg-surface-high)] font-bold text-[12px] text-[var(--text-secondary)] uppercase tracking-wider">
          <div className="col-span-8 md:col-span-5">Task</div>
          <div className="col-span-3 hidden md:block">Category</div>
          <div className="col-span-2 hidden md:block text-center">Priority</div>
          <div className="col-span-4 md:col-span-2 text-right">Finished</div>
        </div>

        <div className="flex flex-col">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              <CheckCircle2 size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-[16px]">
                {searchQuery
                  ? "No tasks match your search"
                  : "No completed tasks yet"}
              </p>
              {!searchQuery && (
                <Link
                  to="/active-tasks"
                  className="text-[var(--primary-text)] hover:underline text-[14px] mt-2 inline-block"
                >
                  Go to Active Tasks
                </Link>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group grid grid-cols-12 gap-4 p-4 items-center border-b border-[var(--border)] hover:bg-[var(--bg-hover)] transition-colors duration-200 relative"
              >
                <div className="col-span-8 md:col-span-5 flex items-center gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-[var(--success)] opacity-50 shrink-0"
                  />
                  <span className="text-[14px] text-[var(--text-secondary)] line-through truncate">
                    {task.title}
                  </span>
                </div>
                <div className="col-span-3 hidden md:flex items-center">
                  {task.category_name && (
                    <span className="px-2 py-1 rounded bg-[var(--bg-surface-high)] border border-[var(--border)] text-[var(--text-secondary)] text-[12px] font-medium opacity-70">
                      {task.category_name}
                    </span>
                  )}
                </div>
                <div className="col-span-2 hidden md:flex justify-center items-center">
                  <span
                    className="px-2 py-1 rounded text-[12px] font-bold opacity-60"
                    style={{
                      backgroundColor: getPriorityColor(task.priority) + "20",
                      color: getPriorityColor(task.priority),
                    }}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="col-span-4 md:col-span-2 flex justify-end items-center gap-3">
                  <span className="text-[12px] font-medium text-[var(--text-secondary)] opacity-70 whitespace-nowrap">
                    {formatDate(task.completed_at)}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRestore(task.id)}
                      title="Restore"
                      className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--primary-text)] bg-[var(--bg-surface-high)] hover:bg-[var(--bg-hover)] rounded border border-[var(--border)] transition-colors"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(task.id)}
                      title="Delete"
                      className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--danger)] bg-[var(--bg-surface-high)] hover:bg-[var(--danger-bg)]/20 rounded border border-[var(--border)] transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {filteredTasks.length > 10 && (
        <div className="mt-6 flex justify-center">
          <button className="px-4 py-2 text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--primary-text)] transition-colors flex items-center gap-2">
            <ChevronDown size={16} />
            Load Older Tasks
          </button>
        </div>
      )}

      {/* Modal konfirmasi delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-[var(--bg-surface)] rounded-xl shadow-2xl border border-[var(--border)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--danger-bg)]/10 flex items-center justify-center">
                <Trash2 size={20} className="text-[var(--danger)]" />
              </div>
              <h3 className="text-[16px] font-semibold text-[var(--text)]">
                Delete Task
              </h3>
            </div>
            <p className="text-[14px] text-[var(--text-secondary)] mb-6">
              Are you sure you want to permanently delete this task? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-lg bg-[var(--bg-hover)] text-[var(--text)] font-bold text-[12px] hover:bg-[var(--border)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-lg bg-[var(--danger)] text-[#111318] font-bold text-[12px] hover:opacity-90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
