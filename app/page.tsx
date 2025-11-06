import { Header } from "@/components/site/header"
import { Hero } from "@/components/site/hero"
import { Services } from "@/components/site/services"
import { About } from "@/components/site/about"
import { Projects } from "@/components/site/projects"
import { Contact } from "@/components/site/contact"
import { SiteFooter } from "@/components/site/footer"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Projects />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
