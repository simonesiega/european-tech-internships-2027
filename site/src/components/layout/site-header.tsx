import {ThemeToggle} from "@/components/theme/theme-toggle";

export function SiteHeader() {
  return (
    <div className="header-fixed">
      <header className="site-header">
        <div className="site-header-content">
          <p className="brand">Internships ’27</p>
          <div className="header-actions">
            <a
              className="header-link add-internship-link"
              href="https://github.com/simonesiega/european-tech-internships-2027/issues/new?template=add-internship.yml"
              target="_blank"
              rel="noreferrer"
            >
              <span className="full-link-label">Add an internship</span>
              <span className="compact-link-label">Add</span>
            </a>
            <a
              className="header-link github-link"
              href="https://github.com/simonesiega/european-tech-internships-2027"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <svg aria-hidden="true" viewBox="0 0 16 16">
                <path d="M5 11 11 5M6 5h5v5" />
              </svg>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>
    </div>
  );
}
