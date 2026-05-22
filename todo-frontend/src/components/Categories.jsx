import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderPlus,
  Megaphone,
  Code2,
  Palette,
  Home,
  Landmark,
  Folder,
  Trash2,
  MoreVertical,
  XCircle,
  Search,
} from "lucide-react";
import { useLayout } from "../context/LayoutContext";

const COLORS = [
  "#5865f2",
  "#ffb959",
  "#73dc8d",
  "#ffb4ab",
  "#8f8fa0",
  "#f43f5e",
  "#06b6d4",
  "#f59e0b",
];
const ICONS = [
  { name: "folder", icon: Folder },
  { name: "megaphone", icon: Megaphone },
  { name: "code", icon: Code2 },
  { name: "palette", icon: Palette },
  { name: "home", icon: Home },
  { name: "landmark", icon: Landmark },
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#5865f2");
  const [newIcon, setNewIcon] = useState("folder");
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { setTopbarLeftContent } = useLayout();

  // Pasang search di topbar
  useEffect(() => {
    setTopbarLeftContent(
      <div className="relative w-full max-w-[200px] sm:w-64">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
        />
        <input
          className="w-full bg-[var(--bg-input)] border border-[var(--border)]/20 rounded-full py-2 pl-10 pr-10 text-[14px] text-[var(--text)] focus:outline-none focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] transition-colors placeholder:text-[var(--text-muted)]"
          placeholder="Search categories..."
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

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCategories();
  }, [token, navigate]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/get_categories_full.php?token=${token}`);
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch {
      console.log("Gagal fetch categories");
    }
  };

  // Filter lokal berdasarkan search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreate = async () => {
    setError("");
    if (!newName.trim()) {
      setError("Nama kategori harus diisi");
      return;
    }
    try {
      const res = await fetch(`/api/create_category.php?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          color: newColor,
          icon: newIcon,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setNewName("");
        setNewColor("#5865f2");
        setNewIcon("folder");
        fetchCategories();
      } else {
        setError(data.error);
      }
    } catch {
      setError("Gagal membuat kategori");
    }
  };

  const handleDelete = async (categoryId) => {
    if (!confirm("Hapus kategori ini? Task akan jadi uncategorized.")) return;
    try {
      const res = await fetch(`/api/delete_category.php?token=${token}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_id: categoryId }),
      });
      const data = await res.json();
      if (data.success) {
        setOpenMenuId(null);
        fetchCategories();
      }
    } catch {
      console.log("Gagal hapus kategori");
    }
  };

  const getIconComponent = (iconName) => {
    const found = ICONS.find((i) => i.name === iconName);
    return found ? found.icon : Folder;
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[26px] sm:text-[32px] font-bold text-[var(--text)]">
          Categories
        </h2>
        <p className="text-[14px] sm:text-[16px] text-[var(--text-secondary)] max-w-2xl">
          Organize your tasks into dedicated workspaces.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Create New Category Card */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="group flex flex-col items-center justify-center h-[180px] bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface)] rounded-xl border border-dashed border-[var(--border)] hover:border-[#5865f2]/50 transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
        >
          <div className="w-12 h-12 rounded-full bg-[var(--bg-hover)] group-hover:bg-[var(--primary)]/20 flex items-center justify-center mb-4 transition-colors">
            <FolderPlus
              size={28}
              className="text-[var(--text-secondary)] group-hover:text-[var(--primary-text)] transition-colors"
            />
          </div>
          <span className="font-bold text-[12px] text-[var(--text-secondary)] group-hover:text-[var(--primary-text)] transition-colors">
            Create New Category
          </span>
        </button>

        {/* Category Cards */}
        {filteredCategories.map((cat) => {
          const IconComp = getIconComponent(cat.icon || "folder");
          return (
            <div
              key={cat.id}
              className="relative group flex flex-col h-[180px] bg-[var(--bg-surface-low)] rounded-xl border border-white/5 hover:border-white/10 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden cursor-pointer"
              onClick={() => navigate(`/active-tasks?category=${cat.id}`)}
            >
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ backgroundColor: cat.color || "#5865f2" }}
              ></div>
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-auto">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-hover)] flex items-center justify-center">
                    <IconComp
                      size={24}
                      style={{ color: cat.color || "#5865f2" }}
                    />
                  </div>

                  {/* Menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === cat.id ? null : cat.id);
                      }}
                      className="text-[var(--text-secondary)] hover:text-[var(--text)] opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {openMenuId === cat.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                          }}
                        />
                        <div className="absolute right-0 top-8 w-32 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(cat.id);
                            }}
                            className="w-full text-left px-4 py-2 text-[12px] text-[var(--danger)] hover:bg-[var(--bg-hover)] rounded-lg flex items-center gap-2"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-[20px] font-semibold text-[var(--text)] mb-1">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                      {cat.task_count || 0} Tasks
                    </span>
                    {cat.active_count > 0 && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[#454655]"></span>
                        <span
                          className="text-[12px] font-medium"
                          style={{ color: cat.color || "#5865f2" }}
                        >
                          {cat.active_count} Active
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-[var(--bg-input)] rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.5)] border border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-semibold text-[var(--text)]">
                Create New Category
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--danger)]"
              >
                <XCircle size={20} />
              </button>
            </div>

            {error && (
              <div className="bg-[var(--danger-bg)]/20 border border-[#ffb4ab] text-[var(--danger)] px-3 py-2 rounded-lg text-[12px] mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[var(--text-secondary)] mb-1.5">
                  Category Name
                </label>
                <input
                  className="w-full bg-[var(--bg-surface-high)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[14px] text-[var(--text)] focus:outline-none focus:border-[#5865f2]"
                  placeholder="e.g. Marketing"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[var(--text-secondary)] mb-1.5">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newColor === color
                          ? "border-white scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[var(--text-secondary)] mb-1.5">
                  Icon
                </label>
                <div className="flex gap-2 flex-wrap">
                  {ICONS.map(({ name, icon: IconComp }) => (
                    <button
                      key={name}
                      onClick={() => setNewIcon(name)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        newIcon === name
                          ? "bg-[var(--primary)]/20 border border-[#5865f2]"
                          : "bg-[var(--bg-surface-high)] border border-[var(--border)]"
                      }`}
                    >
                      <IconComp
                        size={18}
                        className={
                          newIcon === name
                            ? "text-[var(--primary-text)]"
                            : "text-[var(--text-secondary)]"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreate}
                className="w-full bg-[var(--primary)] text-white font-bold text-[12px] py-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors mt-2"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
