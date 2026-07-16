import {formatPublishedDate} from "@/lib/opportunity-presentation";

const repositoryUrl = "https://github.com/simonesiega/european-tech-internships-2027";

type SiteFooterProps = {
  lastUpdatedAt: string | null;
};

export function SiteFooter({lastUpdatedAt}: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-summary">
        <strong>Internships ’27</strong>
        <span>Discover open 2027 tech internships across Europe.</span>
      </div>

      <div className="footer-meta">
        <nav className="footer-links" aria-label="Project links">
          <a
            href={`${repositoryUrl}/issues/new?template=add-internship.yml`}
            target="_blank"
            rel="noreferrer"
          >
            Contribute
          </a>
          <span aria-hidden="true">·</span>
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span aria-hidden="true">·</span>
          <a href={`${repositoryUrl}/issues/new`} target="_blank" rel="noreferrer">
            Report an issue
          </a>
        </nav>
        <span>
          Last updated: {lastUpdatedAt ? formatPublishedDate(lastUpdatedAt) : "Not available"}
        </span>
      </div>
    </footer>
  );
}
