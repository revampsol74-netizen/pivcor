"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"

export function WorkShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const demos = [
    {
      title: "AI-Powered Chatbot Solution",
      description: "A custom-built AI chatbot designed to automate high-level customer support, qualify leads 24/7, and integrate directly into an existing client's data ecosystem.",
      videoId: "0TnFNqsjn9s",
      videoDuration: "",
    },
    {
      title: "Crypto Exchange & Blockchain Integration",
      description: "Full-stack architecture and development of a high-frequency crypto exchange platform, including custom smart contracts and a secure, cold-storage wallet backend.",
      videoId: "N8c8dtWP04E",
      videoDuration: "",
    },
    {
      title: "High-Impact Scroll-Motion Landing Page",
      description: "A high-impact, scroll-motion web experience for a global brand launch. This project focused on maximum user engagement, a 98+ performance score, and a unified brand message.",
      videoId: "HpbLsEiSd8s",
      videoDuration: "",
    },
    {
      title: "AI Content Generation SaaS",
      description: "A custom SaaS (Software as a Service) platform built with AI integration, allowing marketing teams to generate, refine, and deploy on-brand content at scale.",
      videoId: "wDLPCzgrgiw",
      videoDuration: "",
    },
    {
      title: "Mindspace: A Multi-Tenant SaaS Platform",
      description: "A complex, multi-tenant SaaS application for project management and team productivity, built on a scalable cloud architecture to support thousands of concurrent users.",
      videoId: "wDLPCzgrgiw",
      videoDuration: "",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Subtle diagonal pattern background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              currentColor 20px,
              currentColor 21px
            )`,
          }}
        />
      </div>

      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ring/5 rounded-full blur-3xl" />
      </div>

      <div className="section relative py-20 md:py-32">
        {/* Page Header */}
        <div className="mb-16 md:mb-24 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Our Blueprints
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
            We don't just build projects; we architect systems. Here are the case studies and project breakdowns of our core service areas.
          </p>
        </div>

        <div className="space-y-32 md:space-y-40">
          {demos.map((demo, index) => {
            const isEven = index % 2 === 0
            const isHovered = hoveredIndex === index

            return (
              <div
                key={demo.title}
                className="group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
                    !isEven ? "md:grid-flow-dense" : ""
                  }`}
                >
                  {/* Laptop Graphic with Video */}
                  <div
                    className={`relative transition-all duration-500 ${
                      isEven ? "md:order-1" : "md:order-2"
                    } ${isHovered ? "scale-[1.02]" : "scale-100"}`}
                  >
                    {/* Glow effect on hover */}
                    <div
                      className={`absolute inset-0 bg-primary/10 rounded-3xl blur-2xl transition-opacity duration-500 ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {/* Laptop Frame */}
                    <div className="relative mx-auto max-w-full">
                      {/* Laptop Container */}
                      <div className="relative">
                        {/* Laptop Screen */}
                        <div className="relative bg-gradient-to-b from-foreground/25 via-foreground/15 to-foreground/10 rounded-t-3xl p-2 md:p-3 shadow-2xl border border-border/50 transition-all duration-300 group-hover:border-primary/30">
                          {/* Screen Bezel */}
                          <div className="bg-background rounded-t-xl overflow-hidden border border-background/50">
                            {/* Screen with Video */}
                            <div className="relative bg-black aspect-video rounded overflow-hidden border border-black/80">
                              {/* Video Container */}
                              <div className="relative w-full h-full">
                                <iframe
                                  src={`https://www.youtube.com/embed/${demo.videoId}?rel=0&modestbranding=1&showinfo=0`}
                                  title={demo.description}
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                                {/* Overlay gradient for polish */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                              </div>
                            </div>
                          </div>
                          {/* Camera Notch */}
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-28 h-2 bg-foreground/40 rounded-full blur-sm" />
                        </div>

                        {/* Laptop Base/Keyboard Area */}
                        <div className="relative h-3 md:h-4 bg-gradient-to-b from-foreground/20 via-foreground/10 to-foreground/5 rounded-b-3xl -mt-1 mx-3 md:mx-6 shadow-xl">
                          {/* Trackpad indicator */}
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-foreground/15 rounded-full" />
                          {/* Keyboard area lines */}
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-foreground/10 rounded-full" />
                          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-foreground/10 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content with Buttons */}
                  <div
                    className={`space-y-6 transition-all duration-500 ${
                      isEven ? "md:order-2" : "md:order-1"
                    } ${isHovered ? "translate-x-1" : "translate-x-0"}`}
                  >
                    <div>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 transition-colors group-hover:text-primary/90">
                        {demo.title}
                      </h2>
                      <p className="text-base md:text-lg text-foreground/60 leading-relaxed">
                        {demo.description}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <div className="flex flex-wrap gap-4 pt-2">
                      <a
                        href="/#contact"
                        className="group/btn relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 neon-glow"
                      >
                        <span>Discuss Your Project</span>
                        <ExternalLink className="w-4 h-4 opacity-70 group-hover/btn:opacity-100 transition-opacity" />
                      </a>
                    </div>

                    {/* Decorative accent line */}
                    <div className="pt-4">
                      <div className="w-16 h-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action Section */}
        <div className="mt-32 md:mt-40 text-center">
          <div className="inline-flex flex-col items-center gap-6 p-8 md:p-12 rounded-2xl border border-border/50 glass max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold">
              Ready to Build Your App?
            </h3>
            <p className="text-foreground/70 text-lg">
              Let's discuss how we can bring your vision to life
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold neon-glow hover:scale-105 transition-transform duration-300"
            >
              Get Started
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
