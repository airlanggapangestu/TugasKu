import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  AlertTriangle,
  Folder,
  Plus,
  Megaphone,
  Code2,
  Palette,
  Home,
  Landmark,
} from "lucide-react";

const CATEGORY_ICONS = {
  megaphone: Megaphone,
  code: Code2,
  palette: Palette,
  home: Home,
  landmark: Landmark,
  folder: Folder,
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    active: 0,
    done: 0,
    total: 0,
    efficiency: 0,
    open_issues: 0,
  });
  const [topPriorities, setTopPriorities] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [recentCategories, setRecentCategories] = useState([]);
  const [chartView, setChartView] = useState("week");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchDashboard();
  }, [token, navigate]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`/api/get_dashboard.php?token=${token}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setTopPriorities(data.top_priorities);
        setChartData(data.chart_data);
        setRecentCategories(data.recent_categories);
      }
    } catch (err) {
      console.log("Gagal fetch dashboard");
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

  const getDueText = (dueDate) => {
    if (!dueDate) return "No date";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return dueDate;
  };

  const maxChartValue = useMemo(() => {
    if (chartData.length === 0) return 1;
    return Math.max(...chartData.map((d) => d.count), 1);
  }, [chartData]);

  const displayChartData = useMemo(() => {
    if (chartView === "week") return chartData;
    if (chartData.length < 7) return chartData;
    const grouped = [];
    for (let i = 0; i < chartData.length; i += 2) {
      const group = chartData.slice(i, i + 2);
      grouped.push({
        day: group[0].day + (group[1] ? "/" + group[1].day : ""),
        count: group.reduce((sum, d) => sum + d.count, 0),
      });
    }
    return grouped;
  }, [chartData, chartView]);

  if (!user && !token) return null;

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-[26px] sm:text-[32px] font-bold leading-tight sm:leading-[40px] -tracking-[0.02em] text-[var(--text)] mb-2">
          Good morning, {user?.full_name || "Alex"}.
        </h2>
        <p className="text-[14px] sm:text-[16px] leading-[24px] text-[var(--text-secondary)]">
          Here is the status of your tasks today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Chart Card - desain awal */}
        <div className="lg:col-span-8 bg-[var(--bg-surface-high)] rounded-xl border border-white/5 p-4 sm:p-6 flex flex-col relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-3xl group-hover:bg-[var(--primary)]/20 transition-all duration-700 pointer-events-none" />
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 relative z-10">
            <div>
              <h3 className="text-[18px] sm:text-[20px] font-semibold text-[var(--text)]">
                Task Completion Rate
              </h3>
              <p className="text-[11px] sm:text-[12px] font-medium text-[var(--text-secondary)] mt-1">
                Last 7 days performance
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-input)] rounded-lg p-1 border border-white/5 self-start">
              <button
                onClick={() => setChartView("week")}
                className={`px-3 py-1 rounded text-[12px] font-medium transition-colors ${chartView === "week" ? "bg-[var(--bg-hover)] text-[var(--text)]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"}`}
              >
                Week
              </button>
              <button
                onClick={() => setChartView("month")}
                className={`px-3 py-1 rounded text-[12px] font-medium transition-colors ${chartView === "month" ? "bg-[var(--bg-hover)] text-[var(--text)]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"}`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Bar Chart - tinggi awal */}
          <div className="flex-1 flex items-end h-[160px] sm:h-[200px] relative z-10 mt-2 overflow-x-auto">
            {displayChartData.length === 0 || maxChartValue === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)] text-[14px]">
                No completed tasks yet
              </div>
            ) : (
              <div className="w-full min-w-[300px] flex justify-between items-end h-full pt-8 gap-2">
                {displayChartData.map((bar, idx) => {
                  const heightPercent = (bar.count / maxChartValue) * 100;
                  const isHighest =
                    bar.count === maxChartValue && bar.count > 0;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1 flex-1 min-w-[20px]"
                    >
                      <span className="text-[11px] text-[var(--text-secondary)] group-hover/card:opacity-100 transition-opacity hidden sm:block">
                        {bar.count}
                      </span>
                      <div className="w-full max-w-[28px] sm:max-w-[36px] relative group/bar cursor-pointer">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--bg-surface)] text-[var(--text)] text-[10px] px-2 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {bar.count} tasks
                        </div>
                        <div
                          className={`w-full rounded-t-md transition-all duration-500 ease-out ${isHighest ? "bg-gradient-to-t from-[#5865f2] to-[#7c83ff] shadow-[0_0_15px_rgba(88,101,242,0.4)]" : bar.count > 0 ? "bg-[var(--primary)]/40 hover:bg-[var(--primary)]/60" : "bg-[var(--primary)]/10"}`}
                          style={{
                            height: `${Math.max(heightPercent, 4)}%`,
                            minHeight: bar.count > 0 ? "8px" : "4px",
                          }}
                        />
                      </div>
                      <span
                        className={`text-[10px] sm:text-[12px] mt-2 ${isHighest ? "text-[var(--primary-text)] font-bold" : "text-[var(--text-secondary)]"}`}
                      >
                        {bar.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5 text-[10px] text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-[var(--primary)]/40"></div>
              Completed
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-gradient-to-t from-[#5865f2] to-[#7c83ff]"></div>
              Peak
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
          <div className="bg-[var(--bg-surface-high)] rounded-xl border border-white/5 p-4 sm:p-6 flex flex-col items-center justify-center flex-1 relative overflow-hidden">
            <h3 className="text-[18px] sm:text-[20px] font-semibold text-[var(--text)] absolute top-4 left-4 sm:top-6 sm:left-6">
              Efficiency
            </h3>
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mt-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#1d2024"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#5865F2"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * stats.efficiency) / 100}
                  className="drop-shadow-[0_0_8px_rgba(88,101,242,0.5)] transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[20px] sm:text-[24px] font-semibold text-[var(--text)] block">
                  {stats.efficiency}%
                </span>
              </div>
            </div>
            <p className="text-[11px] sm:text-[12px] font-medium text-[var(--text-secondary)] mt-4 text-center">
              {stats.done} of {stats.total} tasks done
            </p>
          </div>
          <div className="bg-gradient-to-br from-[var(--bg-input)] to-[var(--bg)] rounded-xl border border-white/5 p-4 sm:p-6 flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div>
              <p className="text-[11px] sm:text-[12px] font-medium text-[var(--text-secondary)] mb-1">
                Open Issues
              </p>
              <h4 className="text-[26px] sm:text-[32px] font-bold text-[var(--text)]">
                {stats.open_issues}
              </h4>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#ffb4ab]/10 flex items-center justify-center text-[var(--danger)] border border-[#ffb4ab]/20">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>

        {/* Top Priorities */}
        <div className="lg:col-span-7 bg-[var(--bg-surface-high)] rounded-xl border border-white/5 p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-[18px] sm:text-[20px] font-semibold text-[var(--text)]">
              Top Priorities
            </h3>
            <Link
              to="/active-tasks"
              className="text-[var(--primary-text)] hover:text-[#5865f2] text-[11px] sm:text-[12px] font-bold transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {topPriorities.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                <p className="text-[14px]">No active tasks</p>
                <Link
                  to="/create-task"
                  className="text-[var(--primary-text)] hover:underline text-[12px] mt-1 inline-block"
                >
                  + Create task
                </Link>
              </div>
            ) : (
              topPriorities.map((task) => (
                <Link
                  to={`/active-tasks?task_id=${task.id}`}
                  key={task.id}
                  className="group flex items-center gap-3 sm:gap-4 p-3 rounded-lg hover:bg-[var(--bg-hover)] transition-colors border border-transparent hover:border-white/5 relative overflow-hidden bg-[var(--bg-input)] cursor-pointer"
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{
                      backgroundColor: getPriorityColor(task.priority) + "/80",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] sm:text-[14px] text-[var(--text)] truncate">
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                      {task.category_name && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                          {task.category_name}
                        </span>
                      )}
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          backgroundColor:
                            getPriorityColor(task.priority) + "20",
                          color: getPriorityColor(task.priority),
                        }}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[11px] sm:text-[12px] text-[var(--text-secondary)] flex items-center gap-1">
                        <Calendar size={14} /> {getDueText(task.due_date)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Folders */}
        <div className="lg:col-span-5 bg-[var(--bg-surface-high)] rounded-xl border border-white/5 p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-[18px] sm:text-[20px] font-semibold text-[var(--text)]">
              Recent Folders
            </h3>
            <Link
              to="/categories"
              className="text-[var(--primary-text)] hover:text-[#5865f2] text-[11px] sm:text-[12px] font-bold transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            {recentCategories.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-[var(--text-secondary)]">
                <p className="text-[14px]">No categories yet</p>
              </div>
            ) : (
              recentCategories.map((cat) => {
                const IconComp = CATEGORY_ICONS[cat.icon] || Folder;
                return (
                  <Link
                    to="/categories"
                    key={cat.id}
                    className="bg-[var(--bg-input)] rounded-lg p-3 sm:p-4 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center transition-colors"
                        style={{
                          backgroundColor: (cat.color || "#5865f2") + "20",
                          color: cat.color || "#5865f2",
                        }}
                      >
                        <IconComp size={18} />
                      </div>
                      <span className="text-[10px] sm:text-[12px] text-[var(--text-secondary)] bg-[var(--bg-hover)] px-2 py-0.5 rounded">
                        {cat.task_count || 0} items
                      </span>
                    </div>
                    <h4 className="text-[13px] sm:text-[14px] text-[var(--text)] font-semibold">
                      {cat.name}
                    </h4>
                    <p className="text-[11px] sm:text-[12px] text-[var(--text-secondary)] mt-1">
                      {cat.active_count || 0} active
                    </p>
                  </Link>
                );
              })
            )}
            <Link
              to="/categories"
              className="bg-[var(--bg-input)] rounded-lg p-3 sm:p-4 border border-dashed border-[var(--border)]/30 hover:border-[#5865f2]/50 transition-colors cursor-pointer flex flex-col items-center justify-center text-center gap-2 group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-secondary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                <Plus size={18} />
              </div>
              <span className="text-[11px] sm:text-[12px] font-bold text-[var(--text-secondary)] group-hover:text-[var(--text)] transition-colors">
                New Folder
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
