import {
  Blocks,
  Diamond,
  Wallet,
  Zap,
  Timer,
  ChevronsUp,
  Heart,
  Shield,
  Swords,
} from "lucide-react";
import { ReactNode } from "react";

export const OperatorFactionImage: Record<string, string> = {
  "Lungmen Guard Department":
    "bg-[url('/assets/faction/Lungmen Guard Department.webp')]",
  Blacksteel: "bg-[url('/assets/faction/blacksteel.png')]",
};

export const labelMap: Record<string, { label: string; icon: ReactNode }> = {
  aspd: {
    label: "ASPD",
    icon: <ChevronsUp size={16} className="text-red-300" />,
  },
  hp: {
    label: "Health",
    icon: <Heart size={16} className="text-red-400" />,
  },
  maxHp: {
    label: "Health",
    icon: <Heart size={16} className="text-red-400" />,
  },
  atk: {
    label: "Attack",
    icon: <Swords size={16} className="text-orange-400" />,
  },
  def: {
    label: "Defense",
    icon: <Shield size={16} className="text-blue-400" />,
  },
  magicResistance: {
    label: "Magic Res",
    icon: <Diamond size={16} className="text-purple-400" />,
  },
  cost: {
    label: "DP Cost",
    icon: <Wallet size={16} className="text-yellow-400" />,
  },
  blockCnt: {
    label: "Block",
    icon: <Blocks size={16} className="text-green-400" />,
  },
  baseAttackTime: {
    label: "Atk Interval",
    icon: <Zap size={16} className="text-pink-400" />,
  },
  respawnTime: {
    label: "Redeploy",
    icon: <Timer size={16} className="text-gray-400" />,
  },
};
