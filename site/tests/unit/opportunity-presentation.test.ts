import {expect, test} from "bun:test";
import {getCountries} from "@/lib/opportunity-presentation";

test("extracts every unique country from a multi-location value", () => {
  expect(getCountries("Madrid, Spain; Lisbon, Portugal; Porto, Portugal")).toEqual([
    "Spain",
    "Portugal",
  ]);
});
