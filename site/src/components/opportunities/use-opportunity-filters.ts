import {useMemo, useState} from "react";
import {ALL_FILTER_VALUE, getCountry} from "@/lib/opportunity-presentation";
import type {Internship} from "@/types/internship";

export function useOpportunityFilters(internships: Internship[]) {
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState(ALL_FILTER_VALUE);
  const [location, setLocation] = useState(ALL_FILTER_VALUE);
  const [category, setCategory] = useState(ALL_FILTER_VALUE);

  const options = useMemo(
    () => ({
      companies: [...new Set(internships.map((item) => item.company))].sort(),
      locations: [...new Set(internships.map((item) => getCountry(item.location)))].sort(),
      categories: [...new Set(internships.map((item) => item.category))].sort(),
    }),
    [internships]
  );

  const filteredInternships = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return internships.filter((internship) => {
      const searchableText =
        `${internship.company} ${internship.title} ${internship.category} ${internship.location}`.toLowerCase();

      return (
        (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
        (company === ALL_FILTER_VALUE || internship.company === company) &&
        (location === ALL_FILTER_VALUE || getCountry(internship.location) === location) &&
        (category === ALL_FILTER_VALUE || internship.category === category)
      );
    });
  }, [category, company, internships, location, query]);

  function clearFilters() {
    setQuery("");
    setCompany(ALL_FILTER_VALUE);
    setLocation(ALL_FILTER_VALUE);
    setCategory(ALL_FILTER_VALUE);
  }

  return {
    filters: {query, company, location, category},
    setters: {setQuery, setCompany, setLocation, setCategory},
    options,
    filteredInternships,
    hasActiveFilters:
      query !== "" ||
      company !== ALL_FILTER_VALUE ||
      location !== ALL_FILTER_VALUE ||
      category !== ALL_FILTER_VALUE,
    clearFilters,
  };
}
