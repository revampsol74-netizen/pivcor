"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type Step =
  | "intro"
  | "projectType"
  | "painPoint"
  | "contact"
  | "budget"
  | "urgency"
  | "complete";

type Message = {
  id: string;
  author: "bot" | "user";
  text: string;
};

const PROJECT_TYPES = [
  "Website / Platform",
  "Mobile App",
  "AI / Automation",
  "SaaS / Web App",
  "Web3 / Blockchain",
  "Not sure",
];

const PAIN_POINTS = [
  "No clear plan",
  "Need a better team",
  "Current agency failing",
  "Don’t know where to start",
  "Just exploring",
];

const BUDGETS = ["Starter build", "Scalable build", "Full ecosystem build"];
const URGENCY = ["ASAP", "2–4 weeks", "1 month+", "Just browsing"];

const BUTTON_BASE =
  "w-full rounded-xl border border-white/10 bg-[#151517] px-4 py-3 text-left font-medium text-white/90 transition hover:border-white/30 hover:bg-white/5";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [introText, setIntroText] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "" });
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [leadData, setLeadData] = useState({
    context: "",
    projectType: "",
    painPoint: "",
    name: "",
    email: "",
    budget: "",
    urgency: "",
  });

  const questions = useMemo(
    () => ({
      intro: "Hey, I’m the Pivcor ecosystem guide. What are you building or exploring?",
      projectType: "Which area best describes your build?",
      painPoint: "Where do you feel the biggest friction right now?",
      contact: "Perfect. Who should we send the ecosystem outline to?",
      budget: "How should we think about the build tier?",
      urgency: "How soon are you looking to move?",
      complete: "Thank you — we’ll send your ecosystem outline shortly.",
    }),
    []
  );

  const pushBotMessage = (text: string, delay = 450) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), author: "bot", text }]);
      setIsTyping(false);
    }, delay);
  };

  const pushUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), author: "user", text }]);
  };

  const startConversation = () => {
    if (hasStarted) return;
    setHasStarted(true);
    pushBotMessage(questions.intro, 200);
  };

  useEffect(() => {
    if (open) startConversation();
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleIntroSubmit = () => {
    if (!introText.trim()) return;
    pushUserMessage(introText.trim());
    setLeadData((prev) => ({ ...prev, context: introText.trim() }));
    setIntroText("");
    setStep("projectType");
    pushBotMessage(questions.projectType);
  };

  const handleProjectTypeSelect = (value: string) => {
    pushUserMessage(value);
    setLeadData((prev) => ({ ...prev, projectType: value }));
    setStep("painPoint");
    pushBotMessage(questions.painPoint);
  };

  const handlePainPointSelect = (value: string) => {
    pushUserMessage(value);
    setLeadData((prev) => ({ ...prev, painPoint: value }));
    setStep("contact");
    pushBotMessage(questions.contact);
  };

  const handleContactSubmit = () => {
    const { name, email } = contactForm;
    if (!name.trim() || !email.trim()) {
      toast.error("Please share both your name and email.");
      return;
    }
    pushUserMessage(`${name.trim()} • ${email.trim()}`);
    setLeadData((prev) => ({ ...prev, name: name.trim(), email: email.trim() }));
    setStep("budget");
    pushBotMessage(questions.budget);
  };

  const handleBudgetSelect = (value: string) => {
    pushUserMessage(value);
    setLeadData((prev) => ({ ...prev, budget: value }));
    setStep("urgency");
    pushBotMessage(questions.urgency);
  };

  const sendLead = async (urgencyValue: string) => {
    pushUserMessage(urgencyValue);
    const payload = { ...leadData, urgency: urgencyValue };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      toast.error("Please provide a valid email.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/chatbot-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit");
      }

      setLeadData((prev) => ({ ...prev, urgency: urgencyValue }));
      setStep("complete");
      pushBotMessage(questions.complete, 300);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const renderOptions = (options: string[], onSelect: (value: string) => void) => (
    <div className="space-y-2">
      {options.map((option) => (
        <button key={option} onClick={() => onSelect(option)} className={BUTTON_BASE}>
          {option}
        </button>
      ))}
    </div>
  );

  const renderStepInput = () => {
    if (step === "intro") {
      return (
        <div className="space-y-3">
          <textarea
            value={introText}
            onChange={(e) => setIntroText(e.target.value)}
            placeholder="Tell me about the initiative..."
            className="w-full rounded-xl border border-white/10 bg-[#101012] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/30 focus:outline-none"
            rows={3}
          />
          <button onClick={handleIntroSubmit} className="w-full rounded-xl bg-gradient-to-r from-[#E63C3C] to-[#FF4D4D] px-4 py-3 font-semibold text-white shadow-[0_0_20px_rgba(255,77,77,0.35)] transition hover:brightness-110">
            Continue
          </button>
        </div>
      );
    }

    if (step === "projectType") {
      return renderOptions(PROJECT_TYPES, handleProjectTypeSelect);
    }

    if (step === "painPoint") {
      return renderOptions(PAIN_POINTS, handlePainPointSelect);
    }

    if (step === "contact") {
      return (
        <div className="space-y-3">
          <input
            value={contactForm.name}
            onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Your name"
            className="w-full rounded-xl border border-white/10 bg-[#101012] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/30 focus:outline-none"
          />
          <input
            value={contactForm.email}
            onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="name@company.com"
            className="w-full rounded-xl border border-white/10 bg-[#101012] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/30 focus:outline-none"
          />
          <button
            onClick={handleContactSubmit}
            className="w-full rounded-xl bg-gradient-to-r from-[#E63C3C] to-[#FF4D4D] px-4 py-3 font-semibold text-white shadow-[0_0_20px_rgba(255,77,77,0.35)] transition hover:brightness-110"
          >
            Share Details
          </button>
        </div>
      );
    }

    if (step === "budget") {
      return renderOptions(BUDGETS, handleBudgetSelect);
    }

    if (step === "urgency") {
      return renderOptions(URGENCY, sendLead);
    }

    return null;
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 max-md:bottom-3 max-md:right-3 max-md:left-3">
      {open && (
        <div className="pointer-events-auto w-[360px] rounded-3xl border border-white/10 bg-[#0B0B0F]/95 shadow-[0_20px_120px_rgba(0,0,0,0.6)] backdrop-blur max-md:w-full max-md:rounded-3xl">
          <header className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/60">Pivcor</p>
              <p className="text-base font-semibold text-white">Ecosystem Planner</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/10 p-2 text-white/70 transition hover:border-white/30 hover:text-white"
              aria-label="Close planner"
            >
              ×
            </button>
          </header>

          <div className="flex h-[460px] flex-col">
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.author === "bot"
                      ? "bg-[#141417] text-white shadow-[0_0_25px_rgba(255,255,255,0.05)]"
                      : "ml-auto bg-[#1F1F23] text-white"
                  }`}
                >
                  {message.text}
                </div>
              ))}
              {isTyping && (
                <div className="flex w-fit items-center gap-2 rounded-2xl bg-[#141417] px-4 py-3 text-sm text-white/70">
                  <span className="inline-flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-white/70" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:0.3s]" />
                  </span>
                  typing
                </div>
              )}
            </div>
            <div className="border-t border-white/5 px-5 py-4">{step === "complete" ? <p className="text-sm text-white/80">{questions.complete}</p> : renderStepInput()}</div>
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-[#0B0B0F]/90 px-5 py-3 text-left text-white shadow-[0_0_30px_rgba(255,77,77,0.25)] transition hover:shadow-[0_0_35px_rgba(255,77,77,0.35)] max-md:w-full max-md:justify-between"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">Chat</span>
          <span className="text-base font-semibold">Plan My Ecosystem</span>
        </button>
      )}
    </div>
  );
}
