import Link from "next/link"

export function Projects() {
  return (
    <section id="projects" className="py-20">
      <div className="section">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold">Our Blueprints</h2>
          <p className="mt-4 text-foreground/80 leading-relaxed text-lg">
            Great systems aren't just coded; they're architected. Explore our strategic case studies and project blueprints for global brands.
          </p>
          <div className="mt-8">
            <Link
              href="/work"
              className="inline-flex items-center rounded-md px-6 py-3 bg-primary text-primary-foreground neon-glow transition-transform hover:scale-[1.02]"
            >
              View Our Case Studies
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
