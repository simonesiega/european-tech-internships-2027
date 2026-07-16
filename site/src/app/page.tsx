import {SiteFooter} from "@/components/layout/site-footer";
import {SiteHeader} from "@/components/layout/site-header";
import {OpportunityDirectory} from "@/components/opportunities/opportunity-directory";
import {getDirectoryLastUpdatedAt, getOpenInternships} from "@/lib/internships";

export const dynamic = "force-dynamic";

export default function Home() {
  const openInternships = getOpenInternships();
  const lastUpdatedAt = getDirectoryLastUpdatedAt();

  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <OpportunityDirectory internships={openInternships} />
      </main>
      <SiteFooter lastUpdatedAt={lastUpdatedAt} />
    </div>
  );
}
