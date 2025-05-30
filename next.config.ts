import createNextIntlPlugin from "next-intl/plugin";
import { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./src/messages/en.json",
  },
});

const config: NextConfig = {
  images: {
    unoptimized: true,
    domains: ["arknights.wiki.gg"],
  },
};

export default withNextIntl(config);
