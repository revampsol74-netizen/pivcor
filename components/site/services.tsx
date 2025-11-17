"use client";

import ServicesEcosystem3D from "@/components/services/ServicesEcosystem3D";

export default function Services() {
  return (
    <section className="w-full bg-[#050509] py-28">
      <div className="max-w-6xl mx-auto px-6 space-y-14">
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Solutions Ecosystem
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            A connected digital ecosystem for modern brands.
          </h2>

          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed tracking-wide">
            The core, orbiting pillars, and solution rings all respond to scroll and movement —
            visualizing how Pivcor unifies customer experience, intelligent automation, and
            future-proof infrastructure.
          </p>
        </div>

        <ServicesEcosystem3D />
      </div>
    </section>
  );
}
