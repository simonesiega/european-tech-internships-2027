import {useMemo} from "react";
import {usePathname, useSearchParams} from "next/navigation";
import {ALL_FILTER_VALUE, getCountry} from "@/lib/opportunity-presentation";
import type {Internship} from "@/types/internship";

const FILTER_PARAMETERS = {
  query: "q",
  company: "company",
  location: "country",
  category: "category",
} as const;

type FilterName = keyof typeof FILTER_PARAMETERS;
type HistoryMode = "push" | "replace";

export function useOpportunityFilters(internships: Internship[]) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const options = useMemo(
    () => ({
      companies: [...new Set(internships.map((item) => item.company))].sort(),
      locations: [...new Set(internships.map((item) => getCountry(item.location)))].sort(),
      categories: [...new Set(internships.map((item) => item.category))].sort(),
    }),
    [internships]
  );

  const query = searchParams.get(FILTER_PARAMETERS.query) ?? "";
  const requestedCompany = searchParams.get(FILTER_PARAMETERS.company);
  const requestedLocation = searchParams.get(FILTER_PARAMETERS.location);
  const requestedCategory = searchParams.get(FILTER_PARAMETERS.category);
  const company =
    requestedCompany && options.companies.includes(requestedCompany)
      ? requestedCompany
      : ALL_FILTER_VALUE;
  const location =
    requestedLocation && options.locations.includes(requestedLocation)
      ? requestedLocation
      : ALL_FILTER_VALUE;
  const category =
    requestedCategory && options.categories.includes(requestedCategory)
      ? requestedCategory
      : ALL_FILTER_VALUE;

  const filteredInternships = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return internships.filter((internship) => {
      const searchableText = [
        internship.company,
        internship.title,
        internship.category,
        internship.industries,
        internship.employmentType,
        internship.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
        (company === ALL_FILTER_VALUE || internship.company === company) &&
        (location === ALL_FILTER_VALUE || getCountry(internship.location) === location) &&
        (category === ALL_FILTER_VALUE || internship.category === category)
      );
    });
  }, [category, company, internships, location, query]);

  function setFilter(name: FilterName, value: string, historyMode: HistoryMode) {
    const parameters = new URLSearchParams(searchParams.toString());
    const parameter = FILTER_PARAMETERS[name];

    if (!value || value === ALL_FILTER_VALUE) {
      parameters.delete(parameter);
    } else {
      parameters.set(parameter, value);
    }

    const queryString = parameters.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    window.history[`${historyMode}State`]({}, "", url);
  }

  function clearFilters() {
    const parameters = new URLSearchParams(searchParams.toString());
    Object.values(FILTER_PARAMETERS).forEach((parameter) => parameters.delete(parameter));
    const queryString = parameters.toString();
    window.history.pushState({}, "", queryString ? `${pathname}?${queryString}` : pathname);
  }

  return {
    filters: {query, company, location, category},
    setters: {
      setQuery: (value: string) => setFilter("query", value, "replace"),
      setCompany: (value: string) => setFilter("company", value, "push"),
      setLocation: (value: string) => setFilter("location", value, "push"),
      setCategory: (value: string) => setFilter("category", value, "push"),
    },
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
