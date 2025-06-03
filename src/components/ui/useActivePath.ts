import { usePathname } from "next/navigation";

export function useActivePath(path: string): boolean {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const normalizedPath = path.replace(/\/$/, "") || "/";
  return pathname === normalizedPath;
}
