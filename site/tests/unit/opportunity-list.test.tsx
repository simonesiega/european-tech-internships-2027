import {expect, test} from "bun:test";
import {renderToStaticMarkup} from "react-dom/server";
import {OpportunityList} from "@/components/opportunities/opportunity-list";

const noOp = () => undefined;

test("renders an actionable message only when filters hide every opportunity", () => {
  const emptyDirectory = renderToStaticMarkup(
    <OpportunityList opportunities={[]} hasActiveFilters={false} onReset={noOp} />
  );
  expect(emptyDirectory).toContain("No open opportunities");
  expect(emptyDirectory).toContain("The directory currently has no open roles.");
  expect(emptyDirectory).not.toContain("Reset filters");

  const emptyFilterResult = renderToStaticMarkup(
    <OpportunityList opportunities={[]} hasActiveFilters onReset={noOp} />
  );
  expect(emptyFilterResult).toContain("No opportunities found");
  expect(emptyFilterResult).toContain("Try changing or clearing your filters.");
  expect(emptyFilterResult).toContain("Reset filters");
});
