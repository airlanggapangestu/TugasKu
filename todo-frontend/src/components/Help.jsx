import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog, RefreshCw, Keyboard } from "lucide-react";

export default function Help() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const faqs = [
    {
      icon: UserCog,
      question: "How do I change my Focus Mode settings?",
      answer:
        "Navigate to Settings > Preferences. From there, you can adjust the blur intensity, notification suppression rules, and default timer lengths for your deep work sessions.",
    },
    {
      icon: RefreshCw,
      question: "Are my tasks synced across devices?",
      answer:
        "Yes, TugasKu automatically syncs your data securely to the cloud in real-time. You can seamlessly switch between desktop and mobile without losing your Active Task context.",
    },
    {
      icon: Keyboard,
      question: "What are the keyboard shortcuts?",
      answer: (
        <>
          Press{" "}
          <kbd className="bg-[var(--bg-hover)] px-2 py-0.5 rounded text-[12px] font-mono text-[var(--text)]">
            Cmd/Ctrl + K
          </kbd>{" "}
          to open the command palette anywhere in the app. From there, you can
          quickly create tasks, jump to categories, or toggle Focus Mode.
        </>
      ),
    },
  ];

  if (!token) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[26px] sm:text-[32px] font-bold text-[var(--text)] mb-2">
          How can we help?
        </h1>
        <p className="text-[14px] sm:text-[16px] text-[var(--text-secondary)] max-w-2xl">
          Find answers to common questions below.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-[var(--bg-surface)] rounded-xl p-6 border border-white/5 hover:bg-[var(--bg-surface-high)] transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="bg-[var(--bg)] p-2.5 rounded-lg text-[var(--primary-text)] shrink-0">
                <faq.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[16px] text-[var(--text)] mb-1.5">
                  {faq.question}
                </h3>
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-[var(--text-muted)] text-[12px]">
        Need more help? Contact us at{" "}
        <span className="text-[var(--primary-text)]">support@TugasKu.com</span>
      </div>
    </div>
  );
}
