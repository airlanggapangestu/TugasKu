import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  SignalLow,
  SignalMedium,
  SignalHigh,
  FolderKanban,
  ChevronDown,
  Calendar,
  X,
} from "lucide-react";

export default function CreateTask() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Med");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const dateInputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/get_categories.php?token=${token}`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch {
        console.log("Gagal fetch categories");
      }
    };
    fetchCategories();
  }, [token, navigate]);

  // Buka date picker saat tombol diklik
  const openDatePicker = () => {
    if (dateInputRef.current) {
      // Coba showPicker() untuk browser modern, fallback ke click()
      if (typeof dateInputRef.current.showPicker === "function") {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.click();
      }
    }
  };

  const handleSave = async () => {
    setError("");
    if (!title.trim()) {
      setError("Judul task harus diisi");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/create_task.php?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          category_id: categoryId || null,
          due_date: dueDate || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/active-tasks");
        }, 1500);
      } else {
        setError(data.error || "Gagal membuat task");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = (id) => {
    return categories.find((cat) => cat.id == id);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col font-['Inter'] antialiased">
      {/* HEADER */}
      <header className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-[#1d2024] shrink-0 bg-[var(--bg)]">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors font-bold text-[12px] group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-[var(--text-secondary)] hover:text-[var(--text)] font-medium text-[11px] sm:text-[12px] transition-colors px-3 sm:px-4 py-2 rounded-lg hover:bg-[var(--bg-hover)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[var(--primary)] text-white font-bold text-[11px] sm:text-[12px] px-4 sm:px-6 py-2 rounded-lg shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] hover:shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)] hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Check size={16} />
            {loading ? "Saving..." : "Save Task"}
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 lg:py-12">
        <div className="max-w-[800px] mx-auto flex flex-col gap-4 sm:gap-6">
          {success && (
            <div className="bg-[#00813e]/20 border border-[#73dc8d] text-[var(--success)] px-4 py-3 rounded-lg text-sm">
              ✅ Task berhasil dibuat! Mengarahkan ke Active Tasks...
            </div>
          )}
          {error && (
            <div className="bg-[var(--danger-bg)] border border-[#ffb4ab] text-[#ffdad6] px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="relative group">
            <input
              className="w-full bg-transparent border-none text-[24px] sm:text-[28px] lg:text-[32px] font-bold leading-tight sm:leading-snug lg:leading-[40px] text-[var(--text)] placeholder:text-[var(--text-secondary)]/40 focus:outline-none p-0 block"
              placeholder="Enter task title..."
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="absolute right-0 -bottom-5 text-[11px] sm:text-[12px] font-medium text-[var(--text-secondary)] opacity-0 group-focus-within:opacity-100 transition-opacity">
              {title.length} / 120
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-2">
            {/* Priority - label selalu tampil */}
            <div className="flex items-center gap-1 sm:gap-2 bg-[var(--bg-surface)] rounded-lg p-1">
              <span className="font-bold text-[10px] text-[var(--text-secondary)] uppercase tracking-wider pl-2 pr-1">
                Priority
              </span>
              {[
                { label: "Low", value: "Low", icon: SignalLow },
                { label: "Med", value: "Med", icon: SignalMedium },
                { label: "High", value: "High", icon: SignalHigh },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setPriority(item.value)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-md flex items-center gap-1 text-[11px] sm:text-[12px] font-medium transition-colors ${
                    priority === item.value
                      ? item.value === "High"
                        ? "bg-[#ffb4ab]/20 text-[var(--danger)] font-bold shadow-sm"
                        : "bg-[var(--bg-hover)] text-[var(--text)] font-bold"
                      : "text-[var(--text)] hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  <item.icon size={14} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] transition-colors rounded-lg px-3 sm:px-4 py-2 text-[var(--text)] text-[11px] sm:text-[12px] font-medium"
              >
                <FolderKanban
                  size={16}
                  className="text-[var(--text-secondary)]"
                />
                {categoryId
                  ? getCategoryById(categoryId)?.name || "Pilih Kategori"
                  : "Select Category"}
                <ChevronDown
                  size={16}
                  className="text-[var(--text-secondary)] ml-1 sm:ml-2"
                />
              </button>

              {showCategoryDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowCategoryDropdown(false)}
                  />
                  <div className="absolute top-full mt-1 left-0 w-48 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto custom-scrollbar">
                    <button
                      onClick={() => {
                        setCategoryId("");
                        setShowCategoryDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-t-lg"
                    >
                      No Category
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCategoryId(cat.id);
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-[12px] text-[var(--text)] hover:bg-[var(--bg-hover)] flex items-center gap-2"
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        ></span>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Due Date - tanpa tumpang tindih */}
            <div className="flex items-center gap-2">
              <input
                ref={dateInputRef}
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="sr-only"
              />
              <button
                onClick={openDatePicker}
                className="flex items-center gap-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] transition-colors rounded-lg px-3 sm:px-4 py-2 text-[var(--text)] text-[11px] sm:text-[12px] font-medium"
              >
                <Calendar
                  size={16}
                  className="text-[var(--text-secondary)] shrink-0"
                />
                {dueDate ? dueDate : "Set Due Date"}
              </button>
              {dueDate && (
                <button
                  onClick={() => setDueDate("")}
                  className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors p-1 shrink-0"
                  title="Hapus tanggal"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Description Textarea - polos tanpa toolbar */}
          <div className="mt-2 bg-[var(--bg-surface-low)] rounded-xl border border-[#1d2024] overflow-hidden focus-within:border-[#5865f2] focus-within:ring-1 focus-within:ring-[#5865f2] transition-all shadow-sm">
            <textarea
              className="w-full h-[250px] sm:h-[350px] lg:h-[400px] bg-transparent border-none text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-[var(--text)] p-4 sm:p-6 resize-none placeholder:text-[var(--text-secondary)]/50 focus:outline-none block"
              placeholder="Add a detailed description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
