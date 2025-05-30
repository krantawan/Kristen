import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export function useActivePath(path: string): boolean {
  const pathname = usePathname();
  const locale = useLocale();

  const localizedPath = path === "/" ? `/${locale}` : `/${locale}${path}`;
  return pathname === localizedPath;
}
