import createNextIntlPlugin from "next-intl/plugin";
import { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./src/messages/en.json",
  },
});

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "arknights.wiki.gg",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
};

export default withNextIntl(config);
