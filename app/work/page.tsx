import { Header } from "@/components/site/header"
import { WorkShowcase } from "@/components/site/work-showcase"
import { SiteFooter } from "@/components/site/footer"

export const metadata = {
  title: "Our Blueprints | PIVCOR",
  description: "We don't just build projects; we architect systems. Explore our case studies and project breakdowns.",
}

export default function WorkPage() {
  return (
    <>
      <Header />
      <main>
        <WorkShowcase />
      </main>
      <SiteFooter />
    </>
  )
}
