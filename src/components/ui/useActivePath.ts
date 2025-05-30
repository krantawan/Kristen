import { usePathname } from "next/navigation";

export function useActivePath(path: string): boolean {
  const pathname = usePathname() || "/";
  return path === "/" ? pathname === "/" : pathname.startsWith(path);
}
