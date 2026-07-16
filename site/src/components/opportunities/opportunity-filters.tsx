import type {RefObject} from "react";
import {Search, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ALL_FILTER_VALUE, formatCategory} from "@/lib/opportunity-presentation";

type OpportunityFiltersProps = {
  searchInputRef: RefObject<HTMLInputElement | null>;
  filters: {query: string; company: string; location: string; category: string};
  options: {companies: string[]; locations: string[]; categories: string[]};
  hasActiveFilters: boolean;
  onQueryChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClear: () => void;
};

type FilterSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function FilterSelect({label, value, options, onChange}: FilterSelectProps) {
  return (
    <label className="filter-control">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value={ALL_FILTER_VALUE}>All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {label === "Category" ? formatCategory(option) : option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function OpportunityFilters({
  searchInputRef,
  filters,
  options,
  hasActiveFilters,
  onQueryChange,
  onCompanyChange,
  onLocationChange,
  onCategoryChange,
  onClear,
}: OpportunityFiltersProps) {
  return (
    <div className="filter-card" aria-label="Opportunity filters">
      <label className="filter-control search-control">
        <span>Search</span>
        <div className="search-input-wrapper">
          <Search aria-hidden="true" />
          <Input
            ref={searchInputRef}
            type="search"
            value={filters.query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search company, role, or location..."
          />
        </div>
      </label>

      <FilterSelect
        label="Company"
        value={filters.company}
        options={options.companies}
        onChange={onCompanyChange}
      />
      <FilterSelect
        label="Location"
        value={filters.location}
        options={options.locations}
        onChange={onLocationChange}
      />
      <FilterSelect
        label="Category"
        value={filters.category}
        options={options.categories}
        onChange={onCategoryChange}
      />

      {hasActiveFilters ? (
        <Button variant="outline" className="reset-filters-button" onClick={onClear}>
          <X aria-hidden="true" />
          Reset
        </Button>
      ) : (
        <span className="reset-filters-placeholder" aria-hidden="true" />
      )}
    </div>
  );
}
