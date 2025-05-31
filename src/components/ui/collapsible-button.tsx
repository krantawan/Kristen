"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleButtonProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export function CollapsibleButton({
  title,
  children,
  className,
  defaultOpen = false,
}: CollapsibleButtonProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [maxHeight, setMaxHeight] = React.useState("0px");
  const [fadeVisible, setFadeVisible] = React.useState(defaultOpen);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const contentId = React.useId();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const updateHeight = React.useCallback(() => {
    requestAnimationFrame(() => {
      if (contentRef.current) {
        const h = contentRef.current.scrollHeight;
        setMaxHeight(`${h}px`);
      }
    });
  }, []);

  React.useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setFadeVisible(true);
      updateHeight();
    } else {
      setMaxHeight("0px");
      timeoutRef.current = setTimeout(() => {
        setFadeVisible(false);
      }, 300);
    }
  }, [isOpen, updateHeight]);

  React.useEffect(() => {
    if (isOpen) {
      updateHeight();
    }
  }, [children, isOpen, updateHeight]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "w-full bg-[#222] text-white border-t-2 border-[#BEC93B]",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between px-4 py-2 font-medium transition-colors hover:bg-[#1a1a1a]",
          isOpen && "bg-[#1a1a1a]"
        )}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span
          className={cn(
            "text-2xl font-black tracking-tight font-roboto",
            isOpen ? "text-[#BEC93B]" : ""
          )}
        >
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform duration-200",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>

      <div
        id={contentId}
        ref={contentRef}
        style={{
          maxHeight,
          opacity: fadeVisible ? 1 : 0,
          transition: "max-height 0.3s ease, opacity 0.3s ease",
        }}
        className="overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
}
