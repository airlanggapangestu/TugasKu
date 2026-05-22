import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getStrength = (pass) => {
    if (!pass) return { level: 0, text: "" };
    if (pass.length < 8) return { level: 1, text: "Too weak" };
    return { level: 2, text: "Fair strength" };
  };

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Semua field harus diisi");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
        }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.error || "Registrasi gagal");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-4 sm:p-8 antialiased font-['Inter']">
      <div className="w-full max-w-[440px] bg-[var(--bg-surface)] rounded-xl border border-[#33353a] p-5 sm:p-8 flex flex-col relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--primary)]"></div>

        {/* Header */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-[#0c0e13] border border-[var(--border)] flex items-center justify-center mb-3 sm:mb-4 shadow-inner">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-[#5865f2]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h1 className="font-['Inter'] text-[22px] sm:text-[24px]/[32px] font-semibold tracking-[-0.01em] text-[var(--text)] mb-1">
            Create an account
          </h1>
          <p className="font-['Inter'] text-[13px] sm:text-[14px]/[20px] text-[var(--text-secondary)] text-center">
            Join Tugasku to elevate your focus.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-[var(--danger-bg)] border border-[#ffb4ab] text-[#ffdad6] px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
          {/* Full Name */}
          <div>
            <label
              className="block font-['Inter'] text-[12px]/[16px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1 ml-1"
              htmlFor="fullname"
            >
              Full Name
            </label>
            <input
              className="w-full bg-[#0c0e13] border border-[var(--border)] rounded-lg px-4 py-[10px] text-[var(--text)] font-['Inter'] text-[14px]/[20px] focus:outline-none focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] transition-colors placeholder:text-[var(--text-muted)]"
              id="fullname"
              placeholder="e.g. Jane Doe"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="block font-['Inter'] text-[12px]/[16px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1 ml-1"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="w-full bg-[#0c0e13] border border-[var(--border)] rounded-lg px-4 py-[10px] text-[var(--text)] font-['Inter'] text-[14px]/[20px] focus:outline-none focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] transition-colors placeholder:text-[var(--text-muted)]"
              id="email"
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block font-['Inter'] text-[12px]/[16px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1 ml-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <input
                className="w-full bg-[#0c0e13] border border-[var(--border)] rounded-lg pl-4 pr-[48px] py-[10px] text-[var(--text)] font-['Inter'] text-[14px]/[20px] focus:outline-none focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] transition-colors placeholder:text-[var(--text-muted)]"
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors h-full px-2 outline-none rounded focus-visible:ring-2 focus-visible:ring-[#5865f2]"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            <div className="px-1">
              <div className="flex gap-[4px] h-1.5 w-full mt-2">
                <div
                  className={`flex-1 rounded-full transition-colors ${strength.level >= 1 ? "bg-[#73dc8d]" : "bg-[var(--bg-hover)]"}`}
                ></div>
                <div
                  className={`flex-1 rounded-full transition-colors ${strength.level >= 2 ? "bg-[#ffb959]" : "bg-[var(--bg-hover)]"}`}
                ></div>
                <div className="flex-1 rounded-full bg-[var(--bg-hover)]"></div>
                <div className="flex-1 rounded-full bg-[var(--bg-hover)]"></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span
                  className={`font-['Inter'] text-[10px] ${strength.level === 1 ? "text-[var(--danger)]" : strength.level >= 2 ? "text-[var(--warning)]" : "text-transparent"}`}
                >
                  {strength.text || "\u00A0"}
                </span>
                <span className="font-['Inter'] text-[10px] text-[var(--text-secondary)]">
                  8+ characters
                </span>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="block font-['Inter'] text-[12px]/[16px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1 ml-1"
              htmlFor="confirm_password"
            >
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <input
                className="w-full bg-[#0c0e13] border border-[var(--border)] rounded-lg pl-4 pr-[48px] py-[10px] text-[var(--text)] font-['Inter'] text-[14px]/[20px] focus:outline-none focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] transition-colors placeholder:text-[var(--text-muted)]"
                id="confirm_password"
                placeholder="••••••••"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors h-full px-2 outline-none rounded focus-visible:ring-2 focus-visible:ring-[#5865f2]"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] rounded-lg py-3 px-4 font-['Inter'] text-[14px]/[20px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-200 mt-2 flex justify-center items-center gap-2 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1d2024] focus-visible:ring-[#5865f2]"
          >
            {loading ? "Creating..." : "Create Account"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center border-t border-[#33353a] pt-3 sm:pt-4">
          <p className="font-['Inter'] text-[13px] sm:text-[14px]/[20px] text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[var(--primary-text)] hover:text-[#e0e0ff] transition-colors font-bold ml-1"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
