"use client"

import type React from "react"
import { useState } from "react"
import dynamic from "next/dynamic"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => ({ default: mod.Canvas })), { ssr: false })

export function Contact() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const message = formData.get("message") as string

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          company,
          message,
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        throw new Error("Server returned an invalid response")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      toast.success(data.message || "Thanks! We'll be in touch soon.")
      form.reset()
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
      console.error("Contact form error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 relative">
      <div className="absolute inset-0 opacity-[0.55] pointer-events-none">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.15} />
          {/* Aurora/particles */}
          {/* @ts-ignore - dynamic import file is TSX export */}
          {/* Using dynamic import wasn't necessary here as this is light geometry */}
        </Canvas>
      </div>
      <div className="section relative">
        <header className="mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold">Let's Architect Your Ecosystem</h2>
          <p className="mt-2 text-foreground/70">Ready to move past disconnected projects? Tell us your goal, and let's build your core.</p>
        </header>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <label className="text-sm">Name</label>
              <Input name="name" placeholder="Your name" required className="glass" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Email</label>
              <Input name="email" type="email" placeholder="you@example.com" required className="glass" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Company</label>
              <Input name="company" placeholder="Company name" className="glass" />
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Message</label>
            <Textarea name="message" placeholder="Tell us about your project..." className="min-h-40 glass" required />
            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="neon-glow">
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
