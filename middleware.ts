import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "th"],
  defaultLocale: "en",
});

export const config = {
  // ⬅️ ต้องครอบคลุม root path "/"
  matcher: ["/((?!_next|.*\\..*).*)"],
};
