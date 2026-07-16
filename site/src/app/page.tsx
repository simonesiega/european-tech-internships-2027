import {SiteFooter} from "@/components/layout/site-footer";
import {SiteHeader} from "@/components/layout/site-header";
import {OpportunityDirectory} from "@/components/opportunities/opportunity-directory";
import {getDirectoryData} from "@/lib/internships";

export const dynamic = "force-dynamic";

export default function Home() {
  const {internships, lastUpdatedAt} = getDirectoryData();

  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <OpportunityDirectory internships={internships} />
      </main>
      <SiteFooter lastUpdatedAt={lastUpdatedAt} />
    </div>
  );
}
