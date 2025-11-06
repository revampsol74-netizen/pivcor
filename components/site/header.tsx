"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Home", href: "/", hash: "#home" },
  { label: "Services", href: "/", hash: "#services" },
  { label: "About", href: "/", hash: "#about" },
  { label: "Projects", href: "/", hash: "#projects" },
  { label: "Contact", href: "/", hash: "#contact" },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isWorkPage = pathname === "/work"

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="section h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center h-full">
          <span className="text-2xl md:text-3xl font-black text-[#FF0000] tracking-wider uppercase" style={{ fontStretch: 'condensed', letterSpacing: '0.1em' }}>
            PIVCOR
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.hash}
              href={isWorkPage ? `${item.href}${item.hash}` : item.hash}
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            asChild
            className="neon-glow pulse-glow hover:scale-105 transition-transform"
            title="Book a Free Consultation"
          >
            <Link href={isWorkPage ? "/#contact" : "#contact"}>Book a Free Consultation</Link>
          </Button>
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center size-9 rounded-md border border-border hover:bg-accent/10 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="text-foreground">
            <path fill="currentColor" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/50">
          <nav className="section py-4 grid gap-2" aria-label="Mobile">
            {navItems.map((item) => (
              <Link
                key={item.hash}
                href={isWorkPage ? `${item.href}${item.hash}` : item.hash}
                className="py-2 text-sm text-foreground/80 hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button className="neon-glow" asChild>
              <Link href={isWorkPage ? "/#contact" : "#contact"}>Book a Free Consultation</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
