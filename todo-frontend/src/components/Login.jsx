import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.error || "Login gagal");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-4 sm:p-6 antialiased font-['Inter'] text-[14px]/[20px] relative overflow-hidden">
      {/* Ambient Background - responsive blur size */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
      >
        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] sm:w-[50vw] sm:h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[var(--primary)]/5 blur-[80px] sm:blur-[120px]"></div>
        <div className="absolute top-[70%] -right-[10%] w-[50vw] h-[50vw] sm:w-[40vw] sm:h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[var(--primary)]/[0.03] blur-[80px] sm:blur-[100px]"></div>
      </div>

      {/* Login Card */}
      <main className="w-full max-w-[420px] bg-[var(--bg-surface)] rounded-xl custom-shadow-modal border border-white/5 relative z-10 flex flex-col">
        {/* Header */}
        <header className="pt-10 sm:pt-12 px-5 sm:px-6 pb-4 flex flex-col items-center text-center gap-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--bg-hover)] rounded-xl flex items-center justify-center mb-2 shadow-sm border border-white/10">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-[#5865f2]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h1 className="font-['Inter'] text-[22px] sm:text-[24px]/[32px] font-semibold tracking-[-0.01em] text-[var(--text)]">
            Welcome back
          </h1>
          <p className="font-['Inter'] text-[13px] sm:text-[14px]/[20px] text-[var(--text-secondary)]">
            We're so excited to see you again!
          </p>
        </header>

        {/* Content */}
        <div className="px-5 sm:px-6 pb-10 sm:pb-12 flex flex-col gap-5 sm:gap-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-[var(--danger-bg)] border border-[#ffb4ab] text-[#ffdad6] px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label
                className="font-['Inter'] text-[12px]/[16px] font-bold text-[var(--text-secondary)] uppercase tracking-wider"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="bg-[var(--bg-surface-low)] border border-[var(--border)] rounded-lg px-4 py-3 sm:py-3 font-['Inter'] text-[14px]/[20px] text-[var(--text)] focus:outline-none focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] transition-colors placeholder:text-[var(--text-muted)]"
                id="email"
                name="email"
                placeholder="name@company.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label
                className="font-['Inter'] text-[12px]/[16px] font-bold text-[var(--text-secondary)] uppercase tracking-wider"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  className="w-full bg-[var(--bg-surface-low)] border border-[var(--border)] rounded-lg pl-4 pr-[48px] py-3 font-['Inter'] text-[14px]/[20px] text-[var(--text)] focus:outline-none focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] transition-colors placeholder:text-[var(--text-muted)]"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  aria-label="Toggle password visibility"
                  className="absolute right-3 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors h-full px-2 outline-none rounded focus-visible:ring-2 focus-visible:ring-[#5865f2]"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4 rounded-[4px] border border-[var(--border)] bg-[var(--bg-surface-low)] group-hover:border-[#8f8fa0] transition-colors">
                  <input
                    className="absolute opacity-0 w-full h-full cursor-pointer peer"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <Check
                    size={14}
                    className="text-[#5865f2] opacity-0 peer-checked:opacity-100 transition-opacity"
                    strokeWidth={4}
                  />
                </div>
                <span className="font-['Inter'] text-[13px] sm:text-[14px]/[20px] text-[var(--text-secondary)] group-hover:text-[var(--text)] transition-colors">
                  Remember me
                </span>
              </label>
              <a
                className="font-['Inter'] text-[13px] sm:text-[14px]/[20px] text-[#5865f2] hover:text-[var(--primary-text)] hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#5865f2] rounded px-1 -mr-1"
                href="#"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              className="w-full bg-[var(--primary)] text-white font-['Inter'] text-[12px]/[16px] font-bold py-[14px] rounded-lg mt-2 flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[var(--primary-hover)] hover:shadow-[inset_0_0_12px_rgba(255,255,255,0.15)] active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1d2024] focus-visible:ring-[#5865f2]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex-1 h-px bg-[#454655]/50"></div>
            <span className="font-['Inter'] text-[11px] sm:text-[12px]/[16px] font-medium text-[var(--text-secondary)] uppercase tracking-wider whitespace-nowrap">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-[#454655]/50"></div>
          </div>

          {/* Social Logins */}
          <div className="flex flex-col gap-2">
            <button
              className="w-full bg-[var(--bg-hover)] hover:bg-[var(--bg-hover)] text-[var(--text)] font-['Inter'] text-[13px] sm:text-[14px]/[20px] py-3 rounded-lg flex items-center justify-center gap-3 sm:gap-4 transition-colors border border-transparent hover:border-white/5 outline-none focus-visible:ring-2 focus-visible:ring-[#8f8fa0] active:scale-[0.98]"
              type="button"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
            <button
              className="w-full bg-[var(--bg-hover)] hover:bg-[var(--bg-hover)] text-[var(--text)] font-['Inter'] text-[13px] sm:text-[14px]/[20px] py-3 rounded-lg flex items-center justify-center gap-3 sm:gap-4 transition-colors border border-transparent hover:border-white/5 outline-none focus-visible:ring-2 focus-visible:ring-[#8f8fa0] active:scale-[0.98]"
              type="button"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                  fillRule="evenodd"
                />
              </svg>
              Sign in with GitHub
            </button>
          </div>

          {/* Footer Text */}
          <div className="mt-1 text-center">
            <span className="font-['Inter'] text-[13px] sm:text-[14px]/[20px] text-[var(--text-secondary)]">
              Don't have an account?{" "}
            </span>
            <Link
              to="/register"
              className="font-['Inter'] text-[13px] sm:text-[14px]/[20px] text-[#5865f2] hover:text-[var(--primary-text)] hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#5865f2] rounded px-1 -mr-1"
            >
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
