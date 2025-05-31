"use client";

import { Cpu } from "lucide-react";
import { useLocale } from "next-intl";

type StatusType = "ONLINE" | "OFFLINE" | "MAINTENANCE";

type Props = {
  version?: string;
  user?: string;
  status?: StatusType;
  title?: string;
  description?: string;
};

const statusDotColor: Record<StatusType, string> = {
  ONLINE: "bg-green-400",
  OFFLINE: "bg-red-400",
  MAINTENANCE: "bg-yellow-400",
};

const statusTextColor: Record<StatusType, string> = {
  ONLINE: "text-green-400",
  OFFLINE: "text-red-400",
  MAINTENANCE: "text-yellow-400",
};

export default function SystemHeader({
  version = "v1.0",
  user = "DOCTOR",
  status = "ONLINE",
  title = ">> INITIATE RECRUITMENT ANALYSIS",
  description = "Use AI-assisted scan or manual tag selection to identify compatible operators.",
}: Props) {
  const locale = useLocale();
  return (
    <div className="bg-[#1a1a1a] px-4 py-3 shadow-sm">
      <div className="flex justify-between text-xs text-gray-500 font-mono border-b border-[#333] pb-1 mb-2">
        <span className="flex items-center gap-1">
          <Cpu size={12} />
          PRTS-CORE {version}
        </span>
        <span className="flex items-center gap-1">USER: {user}</span>
        <span className="flex items-center gap-2">
          STATUS:
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${statusDotColor[status]}`}
          />
          <span
            className={`font-semibold drop-shadow-[0_0_4px_rgba(34,197,94,0.6)] ${statusTextColor[status]}`}
          >
            {status}
          </span>
        </span>
      </div>

      <h2
        className={`text-lg text-[#FACC15] ${
          locale === "th" ? "" : "font-mono"
        }`}
      >
        {title}
      </h2>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  );
}
