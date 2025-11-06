"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => ({ default: mod.Canvas })), { ssr: false })
const Environment = dynamic(() => import("@react-three/drei").then((mod) => ({ default: mod.Environment })), { ssr: false })
const PresentationControls = dynamic(() => import("@react-three/drei").then((mod) => ({ default: mod.PresentationControls })), { ssr: false })

const ChainLink3D = dynamic(() => import("@/components/three/chain-link").then((m) => m.ChainLink3D), { ssr: false })
const NeonNetworkMini = dynamic(() => import("@/components/three/neon-network").then((m) => m.NeonNetwork), {
  ssr: false,
})
const WebApp3D = dynamic(() => import("@/components/three/web-app").then((m) => m.WebApp3D), { ssr: false })
const MobilePhone3D = dynamic(() => import("@/components/three/mobile-phone").then((m) => m.MobilePhone3D), {
  ssr: false,
})
const SaaSGraphs3D = dynamic(() => import("@/components/three/saas-graphs").then((m) => m.SaaSGraphs3D), {
  ssr: false,
})
const CartCoin3D = dynamic(() => import("@/components/three/cart-coin").then((m) => m.CartCoin3D), {
  ssr: false,
})

const services = [
  {
    title: "Digital Ecosystem Strategy",
    desc: "Before we build, we architect. We design the strategic blueprint to connect your web, mobile, data, and blockchain into one seamless system.",
    details:
      "Before we build, we architect. We design the strategic blueprint to connect your web, mobile, data, and blockchain into one seamless system.",
    three: "network" as const,
  },
  {
    title: "Web App Development",
    desc: "High-performance, scalable web applications built for a global audience. We specialize in complex, data-driven platforms.",
    details:
      "High-performance, scalable web applications built for a global audience. We specialize in complex, data-driven platforms.",
    three: "web" as const,
  },
  {
    title: "Mobile App Development",
    desc: "Native iOS & Android applications that deliver a flawless user experience and integrate perfectly with your digital core.",
    details:
      "Native iOS & Android applications that deliver a flawless user experience and integrate perfectly with your digital core.",
    three: "mobile" as const,
  },
  {
    title: "Blockchain & Web3 Solutions",
    desc: "From smart contracts and dApps to supply chain transparency, we are your expert partner in building trusted, decentralized solutions.",
    details:
      "From smart contracts and dApps to supply chain transparency, we are your expert partner in building trusted, decentralized solutions.",
    three: "chain" as const,
  },
  {
    title: "AI Automations & SaaS",
    desc: "We build custom SaaS platforms and integrate intelligent AI agents to automate workflows, reduce costs, and scale your operations.",
    details:
      "We build custom SaaS platforms and integrate intelligent AI agents to automate workflows, reduce costs, and scale your operations.",
    three: "saas" as const,
  },
  {
    title: "Headless E-Commerce",
    desc: "We build high-speed, custom e-commerce *platforms* that are not just stores, but scalable ecosystems.",
    details:
      "We build high-speed, custom e-commerce *platforms* that are not just stores, but scalable ecosystems.",
    three: "ecommerce" as const,
  },
]

export function Services() {
  const [expandedService, setExpandedService] = useState<string | null>(null)

  return (
    <section id="services" className="py-20">
      <div className="section">
        <header className="mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold">Services</h2>
          <p className="mt-2 text-foreground/70">Click any service to explore details and interactive 3D models.</p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <article
              key={s.title}
              onClick={() => setExpandedService(expandedService === s.title ? null : s.title)}
              className={`group glass rounded-xl p-6 border border-border/60 transition-all cursor-pointer ${
                expandedService === s.title
                  ? "lg:col-span-2 shadow-[0_0_32px_color-mix(in_oklab,var(--color-ring),transparent_40%)]"
                  : "hover:-translate-y-0.5 hover:shadow-[0_0_24px_color-mix(in_oklab,var(--color-ring),transparent_60%)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{s.title}</h3>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block size-2.5 rounded-full bg-primary shadow-[0_0_12px_var(--color-ring)]"
                    aria-hidden
                  />
                  <ChevronDown
                    className={`size-4 transition-transform duration-300 ${
                      expandedService === s.title ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{s.desc}</p>

              {expandedService === s.title && (
                <div className="mt-4 pt-4 border-t border-border/40 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-sm text-foreground/70 leading-relaxed mb-4">{s.details}</p>
                </div>
              )}

              {s.three && (
                <div className="mt-4 relative h-36 rounded-lg overflow-hidden border border-border/60">
                  <Canvas className="canvas-overlay" dpr={[1, 1.75]} camera={{ position: [0, 0, 6], fov: 50 }}>
                    <ambientLight intensity={0.25} />
                    <pointLight position={[4, 4, 6]} intensity={2} color={"#00ffff"} />
                    <PresentationControls
                      global={false}
                      polar={[-0.3, 0.3]}
                      azimuth={[-0.5, 0.5]}
                      config={{ mass: 1, tension: 120, friction: 18 }}
                      snap
                    >
                      {s.three === "chain" && <ChainLink3D />}
                      {s.three === "network" && <NeonNetworkMini density={24} radius={2.2} speed={0.6} />}
                      {s.three === "web" && <WebApp3D />}
                      {s.three === "mobile" && <MobilePhone3D />}
                      {s.three === "saas" && <SaaSGraphs3D />}
                      {s.three === "ecommerce" && <CartCoin3D />}
                    </PresentationControls>
                    <Environment preset="city" />
                  </Canvas>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
