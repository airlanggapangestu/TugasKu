import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle2,
  TrendingUp,
  Folder,
  Megaphone,
  Code2,
  Palette,
  Home,
  Landmark,
  Calendar,
  Clock,
  Edit3,
  Trash2,
  Filter,
  ChevronDown,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { useLayout } from "../context/LayoutContext";

export default function ActiveTasks() {
  const [tasks, setTasks] = useState([]);
  const [totalActive, setTotalActive] = useState(0);
  const [totalDone, setTotalDone] = useState(0);
  const [totalAll, setTotalAll] = useState(0);
  const [percent, setPercent] = useState(0);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(null);
  const [categories, setCategories] = useState([]);

  // Detail / Edit Modal
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "Med",
    category_id: "",
    due_date: "",
  });

  // Delete confirmation
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { setTopbarLeftContent } = useLayout();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Fetch tasks
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks();
    fetchCategories();
  }, [token, navigate]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/get_active_tasks.php?token=${token}`);
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks);
        setTotalActive(data.total_active);
        setTotalDone(data.total_done);
        setTotalAll(data.total_all);
        setPercent(data.percent);
      }
    } catch (err) {
      console.log("Gagal fetch tasks");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/get_categories.php?token=${token}`);
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch {}
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
          placeholder="Search tasks..."
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

  // Filter tasks (real-time)
  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description &&
            task.description.toLowerCase().includes(query)) ||
          (task.category_name &&
            task.category_name.toLowerCase().includes(query)),
      );
    }
    if (priorityFilter) {
      result = result.filter((task) => task.priority === priorityFilter);
    }
    if (categoryFilter) {
      result = result.filter((task) => task.category_id == categoryFilter);
    }
    return result;
  }, [tasks, searchQuery, priorityFilter, categoryFilter]);

  // Buka modal dari parameter URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const taskId = params.get("task_id");
    if (taskId && tasks.length > 0) {
      const task = tasks.find((t) => t.id == taskId);
      if (task) {
        setSelectedTask(task);
        setIsEditing(false);
      }
    }
  }, [location.search, tasks]);

  // ---------- Aksi Cepat ----------
  const handleComplete = async (taskId) => {
    try {
      const res = await fetch(`/api/complete_task.php?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchTasks();
        setSelectedTask(null);
      }
    } catch {}
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
        setSelectedTask(null);
      }
    } catch {}
  };

  // ---------- Modal: buka detail ----------
  const openDetail = (task) => {
    setSelectedTask(task);
    setIsEditing(false);
  };

  const startEdit = () => {
    if (selectedTask) {
      setEditForm({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        priority: selectedTask.priority || "Med",
        category_id: selectedTask.category_id || "",
        due_date: selectedTask.due_date || "",
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!editForm.title.trim()) return;
    try {
      const res = await fetch(`/api/update_task.php?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: selectedTask.id,
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          priority: editForm.priority,
          category_id: editForm.category_id || null,
          due_date: editForm.due_date || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchTasks();
        setSelectedTask((prev) => ({
          ...prev,
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          priority: editForm.priority,
          category_id: editForm.category_id || null,
          category_name: editForm.category_id
            ? categories.find((c) => c.id == editForm.category_id)?.name ||
              prev.category_name
            : null,
          due_date: editForm.due_date || null,
        }));
        setIsEditing(false);
      }
    } catch {}
  };

  // ---------- Helper ----------
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

  const getDueInfo = (dueDate) => {
    if (!dueDate)
      return {
        text: "No due date",
        color: "text-[var(--text-secondary)]",
        icon: Calendar,
      };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0)
      return { text: "Due Today", color: "text-[var(--danger)]", icon: Clock };
    if (diffDays < 0)
      return {
        text: `${Math.abs(diffDays)} days overdue`,
        color: "text-[var(--danger)]",
        icon: Clock,
      };
    if (diffDays === 1)
      return {
        text: "Tomorrow",
        color: "text-[var(--text-secondary)]",
        icon: Calendar,
      };
    return {
      text: `${diffDays} days left`,
      color: "text-[var(--text-secondary)]",
      icon: Calendar,
    };
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case "megaphone":
        return Megaphone;
      case "code":
        return Code2;
      case "palette":
        return Palette;
      case "home":
        return Home;
      case "landmark":
        return Landmark;
      default:
        return Folder;
    }
  };

  return (
    <>
      {/* Header tanpa search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-[26px] sm:text-[32px] font-bold text-[var(--text)]">
              Active Tasks
            </h2>
            <span className="bg-[var(--bg-hover)] text-[var(--text-secondary)] px-2.5 py-0.5 rounded-full text-[12px] font-bold">
              {filteredTasks.length}
            </span>
          </div>
          <p className="text-[14px] sm:text-[16px] text-[var(--text-secondary)]">
            Focus on what matters next.
          </p>
        </div>

        {/* Filter Priority & Category */}
        <div className="flex items-center gap-3">
          {/* Filter Priority */}
          <div className="relative">
            <button
              onClick={() =>
                setShowFilterDropdown(
                  showFilterDropdown === "priority" ? null : "priority",
                )
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] transition-colors ${
                priorityFilter
                  ? "bg-[var(--primary)]/20 border border-[var(--primary)]/50 text-[var(--primary-text)]"
                  : "bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              <Filter size={18} />
              {priorityFilter
                ? `Priority: ${priorityFilter}`
                : "Filter by Priority"}
              <ChevronDown size={18} />
            </button>
            {showFilterDropdown === "priority" && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowFilterDropdown(null)}
                />
                <div className="absolute top-full mt-1 right-0 w-40 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg z-20">
                  <button
                    onClick={() => {
                      setPriorityFilter("");
                      setShowFilterDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-t-lg"
                  >
                    All Priorities
                  </button>
                  <button
                    onClick={() => {
                      setPriorityFilter("High");
                      setShowFilterDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-[12px] text-[#ffb4ab] hover:bg-[var(--bg-hover)] flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span>{" "}
                    High
                  </button>
                  <button
                    onClick={() => {
                      setPriorityFilter("Med");
                      setShowFilterDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-[12px] text-[#ffb959] hover:bg-[var(--bg-hover)] flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#ffb959]"></span>{" "}
                    Med
                  </button>
                  <button
                    onClick={() => {
                      setPriorityFilter("Low");
                      setShowFilterDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-[12px] text-[#8f8fa0] hover:bg-[var(--bg-hover)] flex items-center gap-2 rounded-b-lg"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#8f8fa0]"></span>{" "}
                    Low
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Filter Category */}
          <div className="relative">
            <button
              onClick={() =>
                setShowFilterDropdown(
                  showFilterDropdown === "category" ? null : "category",
                )
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] transition-colors ${
                categoryFilter
                  ? "bg-[var(--primary)]/20 border border-[var(--primary)]/50 text-[var(--primary-text)]"
                  : "bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              <Folder size={18} />
              {categoryFilter
                ? `Category: ${categories.find((c) => c.id == categoryFilter)?.name || "None"}`
                : "Filter by Category"}
              <ChevronDown size={18} />
            </button>
            {showFilterDropdown === "category" && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowFilterDropdown(null)}
                />
                <div className="absolute top-full mt-1 right-0 w-48 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto custom-scrollbar">
                  <button
                    onClick={() => {
                      setCategoryFilter("");
                      setShowFilterDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-t-lg"
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoryFilter(cat.id);
                        setShowFilterDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-[12px] text-[var(--text)] hover:bg-[var(--bg-hover)] flex items-center gap-2"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      ></span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress Widget */}
      <div className="bg-[var(--bg-surface-low)] border border-[var(--border)] rounded-xl p-4 sm:p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-full bg-[var(--success)]/10 flex items-center justify-center text-[var(--success)]">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[12px] font-medium text-[var(--text-secondary)] uppercase tracking-wider">
              Sprint Progress
            </p>
            <p className="text-[20px] font-semibold text-[var(--text)]">
              {totalDone} of {totalAll} tasks completed ({percent}%)
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/3 bg-[var(--bg-hover)] rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#5865f2] h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-secondary)]">
            <ClipboardList size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-[16px]">
              {searchQuery || priorityFilter || categoryFilter
                ? "No tasks match your filter"
                : "No active tasks"}
            </p>
            {searchQuery || priorityFilter || categoryFilter ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPriorityFilter("");
                  setCategoryFilter("");
                }}
                className="text-[var(--primary-text)] hover:underline text-[14px] mt-2 inline-block"
              >
                Clear filters
              </button>
            ) : (
              <Link
                to="/create-task"
                className="text-[var(--primary-text)] hover:underline text-[14px] mt-2 inline-block"
              >
                + Create your first task
              </Link>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const dueInfo = getDueInfo(task.due_date);
            const CategoryIcon = getCategoryIcon(
              task.category_icon || "folder",
            );

            return (
              <div
                key={task.id}
                className="group relative bg-[var(--bg-surface-high)] rounded-xl border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors flex items-center p-4 gap-4 overflow-hidden cursor-pointer"
                onClick={() => openDetail(task)}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                ></div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] text-[var(--text)] truncate group-hover:text-[var(--primary-text)] transition-colors">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-[12px] font-medium">
                    {task.category_name && (
                      <>
                        <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                          <CategoryIcon size={14} />
                          {task.category_name}
                        </span>
                        <span className="text-[var(--border)]">•</span>
                      </>
                    )}
                    <span
                      className="px-2 py-0.5 rounded text-[12px] font-bold"
                      style={{
                        backgroundColor: getPriorityColor(task.priority) + "20",
                        color: getPriorityColor(task.priority),
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right hidden sm:block">
                  <p
                    className={`text-[12px] font-medium flex items-center gap-1 ${dueInfo.color}`}
                  >
                    <dueInfo.icon size={14} />
                    {dueInfo.text}
                  </p>
                </div>

                {/* Tombol aksi cepat */}
                <div
                  className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="p-2 rounded-lg hover:bg-[var(--success)]/10 text-[var(--text-secondary)] hover:text-[var(--success)] transition-colors"
                    title="Mark as done"
                  >
                    <CheckCircle2 size={20} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(task.id)}
                    className="p-2 rounded-lg hover:bg-[var(--danger-bg)]/20 text-[var(--text-secondary)] hover:text-[var(--danger)] transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========== MODAL DETAIL / EDIT ========== */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setSelectedTask(null);
              setIsEditing(false);
            }}
          />
          <div className="relative z-10 w-full max-w-lg bg-[var(--bg-surface)] rounded-xl shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between p-6 pb-4">
              <h3 className="text-[18px] font-semibold text-[var(--text)]">
                Task Detail
              </h3>
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setIsEditing(false);
                }}
                className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 pb-6 space-y-4">
              {!isEditing ? (
                <>
                  <div>
                    <h4 className="text-[20px] font-bold text-[var(--text)]">
                      {selectedTask.title}
                    </h4>
                  </div>
                  {selectedTask.description && (
                    <div>
                      <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-1">
                        Description
                      </p>
                      <p className="text-[14px] text-[var(--text-secondary)] whitespace-pre-wrap">
                        {selectedTask.description}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-1">
                        Priority
                      </p>
                      <span
                        className="px-2 py-0.5 rounded text-[12px] font-bold inline-block"
                        style={{
                          backgroundColor:
                            getPriorityColor(selectedTask.priority) + "20",
                          color: getPriorityColor(selectedTask.priority),
                        }}
                      >
                        {selectedTask.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-1">
                        Category
                      </p>
                      <span className="text-[14px] text-[var(--text)]">
                        {selectedTask.category_name || "None"}
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-1">
                        Due Date
                      </p>
                      <span className="text-[14px] text-[var(--text)]">
                        {selectedTask.due_date || "Not set"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
                    <button
                      onClick={startEdit}
                      className="flex-1 bg-[var(--bg-hover)] text-[var(--text)] font-bold text-[12px] py-2.5 rounded-lg hover:bg-[var(--border)] transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit3 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleComplete(selectedTask.id)}
                      className="flex-1 bg-[var(--success)]/20 text-[var(--success)] font-bold text-[12px] py-2.5 rounded-lg hover:bg-[var(--success)]/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Complete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(selectedTask.id)}
                      className="flex-1 bg-[var(--danger-bg)]/20 text-[var(--danger)] font-bold text-[12px] py-2.5 rounded-lg hover:bg-[var(--danger-bg)]/40 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-1">
                      Title
                    </label>
                    <input
                      className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[14px] text-[var(--text)] focus:outline-none focus:border-[#5865f2]"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[14px] text-[var(--text)] focus:outline-none focus:border-[#5865f2] resize-none h-24"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-1">
                        Priority
                      </label>
                      <div className="flex gap-1">
                        {["Low", "Med", "High"].map((p) => (
                          <button
                            key={p}
                            onClick={() =>
                              setEditForm({ ...editForm, priority: p })
                            }
                            className={`px-3 py-1.5 rounded text-[11px] font-bold transition-colors ${
                              editForm.priority === p
                                ? p === "High"
                                  ? "bg-[#ffb4ab]/20 text-[#ffb4ab]"
                                  : "bg-[var(--bg-hover)] text-[var(--text)]"
                                : "bg-[var(--bg-input)] text-[var(--text-secondary)]"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-1">
                        Category
                      </label>
                      <select
                        className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px] text-[var(--text)] focus:outline-none focus:border-[#5865f2]"
                        value={editForm.category_id}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            category_id: e.target.value,
                          })
                        }
                      >
                        <option value="">None</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-[13px] text-[var(--text)] focus:outline-none focus:border-[#5865f2]"
                        value={editForm.due_date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, due_date: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-[var(--bg-hover)] text-[var(--text)] font-bold text-[12px] py-2.5 rounded-lg hover:bg-[var(--border)] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-[#5865f2] text-white font-bold text-[12px] py-2.5 rounded-lg hover:bg-[#3f4cda] transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL KONFIRMASI DELETE ========== */}
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

      {/* Custom scrollbar style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #454655; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #5865f2; }
      `}</style>
    </>
  );
}
