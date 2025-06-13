"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function BackgroundRotator() {
  const pathname = usePathname();

  useEffect(() => {
    const images = ["/web-ui/bg-01.jpg", "/web-ui/bg-02.jpg"];

    function changeBackground() {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      const isDarkMode = document.documentElement.classList.contains("dark");

      const gradient = isDarkMode
        ? "linear-gradient(to top, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)"
        : "linear-gradient(to top, rgba(255,255,255,0.8) 70%, rgba(255,255,255,0) 100%)"; // light gradient

      document.body.style.backgroundImage = `${gradient}, url("${randomImage}")`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center top";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundAttachment = "fixed";
      document.body.style.transition = "background-image 1s ease-in-out";
    }

    // Initial run
    changeBackground();

    // Rotate every 10s
    const interval = setInterval(changeBackground, 10000);

    // 🔥 Listen for dark/light class change
    const observer = new MutationObserver(() => {
      changeBackground();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [pathname]); // No need to listen to `theme` anymore

  return null;
}
