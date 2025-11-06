export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-border/50">
      <div className="section py-8 text-center">
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-foreground/70">
          <a href="#" className="hover:text-foreground">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-foreground">
            Terms of Service
          </a>
          <a href="#" className="hover:text-foreground">
            Careers
          </a>
          <a href="#" className="hover:text-foreground">
            LinkedIn
          </a>
          <a href="#" className="hover:text-foreground">
            Twitter
          </a>
          <a href="#" className="hover:text-foreground">
            GitHub
          </a>
          <a href="#" className="hover:text-foreground">
            Instagram
          </a>
        </nav>
        <div className="mt-6 text-xs text-foreground/60">
          © {new Date().getFullYear()} PIVCOR. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
