// Simple seeded shuffle so a "random" feed (Home's Daily Discover preview,
// the Discover page's base order) looks different per seed but stable
// across re-renders. Shared by Home.tsx and Discover.tsx.
export function shuffled<T>(arr: T[], seed: number): T[] {
  const list = [...arr];
  let s = seed + 1;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const a = list[i]!;
    const b = list[j]!;
    list[i] = b;
    list[j] = a;
  }
  return list;
}
