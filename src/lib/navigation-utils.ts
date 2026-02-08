/** Check if a nav link is active based on the current pathname */
export function isNavActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}
