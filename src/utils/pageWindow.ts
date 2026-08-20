// Builds the list of page numbers to show, collapsing long runs into "…".
// e.g. pageWindow(5, 10) -> [1, "…", 4, 5, 6, "…", 10]
export function pageWindow(current: number, total: number): (number | "…")[] {
  const pages: (number | "…")[] = [];
  const add = (n: number) => pages.push(n);
  const addGap = () => pages.push("…");

  add(1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) addGap();
  for (let i = start; i <= end; i++) add(i);
  if (end < total - 1) addGap();
  if (total > 1) add(total);
  return pages;
}
