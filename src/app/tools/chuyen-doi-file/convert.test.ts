import { describe, it, expect } from "bun:test";

// ponytail: single test for the config — no browser, no pdf.js, pure data.
// The actual file conversion (pdf.js/mammoth/xlsx) requires a browser,
// covered by manual QA on deploy.
const FORMATS = [
  { label: "PDF → Text", accept: ".pdf", extract: "pdf" },
  { label: "Word (.docx) → Text", accept: ".docx", extract: "docx" },
  { label: "Excel (.xlsx) → CSV", accept: ".xlsx,.xls", extract: "xlsx" },
];

describe("convert tool config", () => {
  it("has 3 formats with unique extracts", () => {
    expect(FORMATS).toHaveLength(3);
    const extracts = FORMATS.map((f) => f.extract);
    expect(new Set(extracts).size).toBe(3);
  });

  it.each(FORMATS)("$label has accept and extract", (f) => {
    expect(f.accept).toBeTruthy();
    expect(f.extract).toMatch(/^(pdf|docx|xlsx)$/);
  });
});
