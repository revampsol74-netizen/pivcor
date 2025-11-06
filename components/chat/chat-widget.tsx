"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { logger } from "@/lib/logger"
import { toast } from "sonner"

function MessageBubble({
  role,
  text,
  onOptionClick,
}: {
  role: "user" | "assistant" | "system"
  text: string
  onOptionClick?: (option: string) => void
}) {
  const isUser = role === "user"
  
  // Check if this is an options message
  const isOptionsMessage = text.startsWith("OPTIONS:")
  let messageText = text
  let options: string[] = []
  
  if (isOptionsMessage) {
    const parts = text.substring(8).split("|") // Remove "OPTIONS:" prefix
    messageText = parts[0] || ""
    options = parts.slice(1)
  }
  
  return (
    <div
      className={`max-w-[85%] flex flex-col gap-2 ${
        isUser ? "self-end items-end" : "self-start items-start"
      }`}
      role="group"
      aria-label={isUser ? "User message" : "Assistant message"}
    >
      <div
        className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-primary/20 text-foreground border border-border/50 shadow-[0_0_20px_var(--color-ring)]"
            : "bg-background/70 text-foreground border border-border/50"
        }`}
      >
        <span className="block text-pretty">{messageText}</span>
      </div>
      {isOptionsMessage && options.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onOptionClick?.(option)}
              className="text-left px-4 py-2 text-sm rounded-md border border-primary/30 bg-primary/10 hover:bg-primary/20 hover:border-primary/50 transition-colors shadow-sm"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadData, setLeadData] = useState({ name: "", email: "", mobile: "", service: "" })
  const [hasInitiated, setHasInitiated] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [processedLeadIds, setProcessedLeadIds] = useState<Set<string>>(new Set())
  const scrollRef = useRef<HTMLDivElement>(null)
  const leadSubmissionInProgress = useRef(false)

  // WhatsApp number - PIVCOR American phone number
  const WHATSAPP_NUMBER = "+19372302564"
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9+]/g, "")}?text=${encodeURIComponent("Hi! I would like to connect with PIVCOR")}`

  // Generate unique message ID
  const generateMessageId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}-${performance.now().toString(36).substring(2, 9)}`
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    // Generate unique ID using timestamp + random number + performance counter
    const userMessage: Message = {
      id: generateMessageId(),
      role: "user",
      content: text.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body")

      const decoder = new TextDecoder()
      let assistantMessage: Message = {
        id: generateMessageId(),
        role: "assistant",
        content: "",
      }

      setMessages((prev) => [...prev, assistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        assistantMessage.content += chunk

        // Strip LEAD_READY from displayed content (keep it in content for processing)
        const displayContent = assistantMessage.content.replace(/\n\nLEAD_READY:.*$/, "").replace(/LEAD_READY:.*$/, "")

        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { ...assistantMessage, content: displayContent }
          return updated
        })
      }

      // After message is complete, check for LEAD_READY and process it automatically
      const fullContent = assistantMessage.content
      if (fullContent.includes("LEAD_READY:") && !leadSubmissionInProgress.current) {
        leadSubmissionInProgress.current = true
        const leadReadyMatch = fullContent.match(/LEAD_READY:([^]+)/)
        if (leadReadyMatch && leadReadyMatch[1]) {
          const parts = leadReadyMatch[1].split("|")
          if (parts.length >= 3) {
            const name = parts[0] || ""
            const email = parts[1] || ""
            const service = parts[3] || parts[2] || ""
            
            // Automatically submit the lead in background (silently)
            handleLeadSubmission({ name, email, mobile: "", service, connectionMethod: "Email" })
              .finally(() => {
                leadSubmissionInProgress.current = false
              })
          }
        }
      }
    } catch (error) {
      logger.error("[Chat] Error:", error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Don't auto-send greeting - show suggestion button instead

  const handleLeadSubmission = async (leadInfo: { name: string; email: string; mobile: string; service: string; connectionMethod: string }) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadInfo.name,
          email: leadInfo.email,
          service: leadInfo.service,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        console.log("✅ Lead submitted successfully to contact@pivcor.com")
        // Silently submit - no toast or extra message needed
        // The confirmation message was already shown in the chatbot response
      } else {
        console.error("❌ Lead submission failed:", data)
        toast.error("Failed to submit. Please try again.")
      }
    } catch (err) {
      logger.error("[PIVCOR] Lead submission error:", err)
      toast.error("Failed to submit. Please try again.")
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleLeadSubmission({ ...leadData, connectionMethod: "Email" })
    setShowLeadForm(false)
    setLeadData({ name: "", email: "", mobile: "", service: "" })
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[60] size-12 rounded-full border border-border/60 bg-background/80 backdrop-blur hover:bg-background/90 shadow-[0_0_20px_var(--color-ring)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <span className="sr-only">{open ? "Close chat" : "Open chat"}</span>
        <svg
          viewBox="0 0 24 24"
          className="mx-auto size-6"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {open ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
          )}
        </svg>
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          className="fixed bottom-20 right-5 z-[60] w-[90vw] max-w-md h-[70vh] rounded-xl border border-border/60 bg-background/75 backdrop-blur glass shadow-xl flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Chat with PIVCOR Support"
        >
          <header className="flex items-center justify-between px-4 py-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <span
                className="inline-block size-5 bg-primary shadow-[0_0_12px_var(--color-ring)] font-sans my-0 rounded-lg"
                aria-hidden
              />
              <h3 className="text-sm font-semibold text-pretty">Chat Support</h3>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#25D366] hover:bg-[#20BA5A] text-white transition-colors flex items-center gap-1.5 shadow-sm"
                onClick={(e) => {
                  // Optional: track click
                  logger.log("[PIVCOR] WhatsApp button clicked")
                }}
              >
                <svg
                  className="size-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Connect Now
              </a>
              <span className={`text-xs ${isLoading ? "text-muted-foreground" : "text-foreground/70"}`}>
                {isLoading ? "Thinking…" : "Online"}
              </span>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {/* Show "HI" suggestion when chat is empty */}
            {messages.length === 0 && (
              <div className="flex justify-center items-center py-4">
                <button
                  onClick={() => {
                    setHasInitiated(true)
                    sendMessage("Hi")
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-md border border-primary/30 bg-primary/10 hover:bg-primary/20 hover:border-primary/50 transition-colors shadow-sm"
                >
                  HI
                </button>
              </div>
            )}
            
            {messages
              .filter((m) => {
                // Hide the initial greeting trigger message
                if (m.role === "user" && (m.content.toLowerCase() === "hello" || m.content.toLowerCase() === "hi") && messages.indexOf(m) === 0) {
                  return false
                }
                // Hide LEAD_READY messages from user
                if (m.role === "assistant" && m.content.startsWith("LEAD_READY:")) {
                  return false
                }
                return true
              })
              .map((m) => (
                <MessageBubble
                  key={m.id}
                  role={m.role}
                  text={m.content}
                  onOptionClick={(option) => {
                    sendMessage(option)
                  }}
                />
              ))}

            {showLeadForm && (
              <form
                onSubmit={handleLeadSubmit}
                className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg space-y-2"
              >
                <p className="text-xs font-semibold text-foreground">Complete Your Information</p>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={leadData.name}
                  onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                  className="w-full rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={leadData.email}
                  onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                  className="w-full rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  required
                />
                <input
                  type="tel"
                  placeholder="Mobile Number (with country code)"
                  value={leadData.mobile}
                  onChange={(e) => setLeadData({ ...leadData, mobile: e.target.value })}
                  className="w-full rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  required
                />
                <input
                  type="text"
                  placeholder="Service Interested In"
                  value={leadData.service}
                  onChange={(e) => setLeadData({ ...leadData, service: e.target.value })}
                  className="w-full rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-md px-2 py-1 text-xs font-medium bg-primary border border-border/60 hover:opacity-90 shadow-[0_0_12px_var(--color-ring)] text-black"
                >
                  Submit & Connect
                </button>
              </form>
            )}
          </div>

          <form
            className="p-3 border-t border-border/60"
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget as HTMLFormElement
              const input = form.elements.namedItem("message") as HTMLInputElement | null
              const value = input?.value?.trim()
              if (!value) return
              sendMessage(value)
              if (input) input.value = ""
            }}
          >
            <div className="flex items-center gap-2">
              <input
                name="message"
                className="w-full rounded-md border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="Ask anything…"
                aria-label="Message input"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="shrink-0 rounded-md px-3 py-2 text-sm font-medium bg-primary border border-border/60 hover:opacity-90 shadow-[0_0_12px_var(--color-ring)] disabled:opacity-50 text-black"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
