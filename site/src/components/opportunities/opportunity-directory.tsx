"use client";

import {useEffect, useRef} from "react";
import {OpportunityFilters} from "@/components/opportunities/opportunity-filters";
import {OpportunityList} from "@/components/opportunities/opportunity-list";
import {useOpportunityFilters} from "@/components/opportunities/use-opportunity-filters";
import {Badge} from "@/components/ui/badge";
import type {Internship} from "@/types/internship";

type OpportunityDirectoryProps = {
  internships: Internship[];
};

export function OpportunityDirectory({internships}: OpportunityDirectoryProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {filters, setters, options, filteredInternships, hasActiveFilters, clearFilters} =
    useOpportunityFilters(internships);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <section className="opportunities" aria-labelledby="opportunities-title">
      <div className="directory-heading">
        <div>
          <h1 id="opportunities-title">Internship directory</h1>
          <p>Discover open 2027 technology internships across Europe.</p>
        </div>
        <Badge className="directory-count" variant="outline" aria-live="polite">
          <strong>{filteredInternships.length}</strong>
          <span>open {filteredInternships.length === 1 ? "role" : "roles"}</span>
        </Badge>
      </div>

      <OpportunityFilters
        searchInputRef={searchInputRef}
        filters={filters}
        options={options}
        hasActiveFilters={hasActiveFilters}
        onQueryChange={setters.setQuery}
        onCompanyChange={setters.setCompany}
        onLocationChange={setters.setLocation}
        onCategoryChange={setters.setCategory}
        onClear={clearFilters}
      />
      <OpportunityList internships={filteredInternships} onReset={clearFilters} />
    </section>
  );
}
