import React from "react";
import type { OperatorDetail } from "@/types/operator";
import { Folder } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function OperatorProfile({
  opDetail,
}: {
  opDetail: OperatorDetail;
}) {
  const story = opDetail.meta_info.storyTextAudio ?? [];

  const findStory = (keys: string[]) =>
    story.find((s) =>
      keys.some((key) =>
        s.storyTitle?.toLowerCase().includes(key.toLowerCase())
      )
    )?.stories?.[0]?.storyText ?? "";

  const storyKeyMap = {
    profile: ["Profile", "個人履歴", "客观履历"],
    basicInfo: ["Basic Info", "基礎情報", "基础档案"],
    physicalExam: ["Physical Exam", "能力測定", "综合体检测试"],

    clinical: ["Clinical Analysis", "健康診断", "临床诊断分析"],
    Archive_File_1: ["Archive File 1", "第一資料", "档案资料一"],
    Archive_File_2: ["Archive File 2", "第二資料", "档案资料二"],
    Archive_File_3: ["Archive File 3", "第三資料", "档案资料三"],
    Archive_File_4: ["Archive File 4", "第四資料", "档案资料四"],
    Archive_File_5: ["Archive File 5", "第五資料", "档案资料五"],
    Promotion_Record: ["Promotion Record", "昇進記録", "晋升记录"],
  };

  const profileText = findStory(storyKeyMap.profile);
  const basicInfoText = findStory(storyKeyMap.basicInfo);
  const physicalExamText = findStory(storyKeyMap.physicalExam);

  const clinicalText = findStory(storyKeyMap.clinical);

  function highlightClinicalText(text: string) {
    const patterns = [
      {
        labels: [
          "Cell-Originium Assimilation",
          "源石融合率",
          "体细胞与源石融合率",
          "อัตราการหลอมรวมกับออริจิเนียม",
        ],
        dynamicClass: (match: string) => {
          const numberMatch = match.match(/(?:】|\])\s*([\d.]+)%?/);
          const percent = numberMatch ? parseFloat(numberMatch[1]) : null;

          if (percent !== null) {
            return percent > 0
              ? "text-rose-400 font-semibold"
              : "text-emerald-400 font-semibold";
          }

          return "text-sky-400 font-semibold";
        },
      },
      {
        labels: [
          "Blood Originium-Crystal Density",
          "血液中源石密度",
          "血液源石结晶密度",
          "ความเข้มข้นของผลึกออริจิเนียมในเลือด",
        ],
        className: "text-cyan-400 font-semibold",
      },
    ];

    const regex = new RegExp(
      `(\\[?【?(?:${patterns
        .flatMap((p) => p.labels)
        .join("|")})】?\\]?[^\\n]*)`,
      "gi"
    );

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    for (const match of text.matchAll(regex)) {
      const fullMatch = match[0];
      const index = match.index ?? 0;

      if (lastIndex < index) {
        parts.push(text.slice(lastIndex, index));
      }

      const matchedLabel = patterns.find((p) =>
        p.labels.some((label) =>
          fullMatch.toLowerCase().includes(label.toLowerCase())
        )
      );

      const className =
        "dynamicClass" in matchedLabel!
          ? matchedLabel?.dynamicClass?.(fullMatch)
          : matchedLabel?.className;

      parts.push(
        <span key={index} className={className}>
          {fullMatch}
        </span>
      );

      lastIndex = index + fullMatch.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  }

  // Archive Files
  const archiveFiles = story
    .filter((s) =>
      ["Archive File", "档案资料", "資料"].some((key) =>
        s.storyTitle?.includes(key)
      )
    )
    .map((s) => {
      const title = s.storyTitle ?? "";
      const story = s.stories?.[0];

      const text = story?.storyText ?? "";
      const unLockType = story?.unLockType ?? "";
      const unLockParam = story?.unLockParam ?? "";

      const match = title.match(/\d+/);
      const num =
        match?.[0] !== undefined
          ? parseInt(match[0])
          : chineseNumberToInt(title);

      return {
        title,
        text,
        num,
        unLockType,
        unLockParam,
      };
    })
    .filter((s) => s.num !== null)
    .sort((a, b) => (a.num ?? 0) - (b.num ?? 0));

  // Promotion Record

  const promotionRaw = story.find((s) =>
    storyKeyMap.Promotion_Record.some((key) =>
      s.storyTitle?.toLowerCase().includes(key.toLowerCase())
    )
  );

  const promotionEntry = promotionRaw
    ? {
        title: promotionRaw.storyTitle,
        text: promotionRaw.stories?.[0]?.storyText ?? "",
        unLockType: promotionRaw.stories?.[0]?.unLockType ?? "",
        unLockParam: promotionRaw.stories?.[0]?.unLockParam ?? "",
      }
    : null;

  function chineseNumberToInt(text: string): number | null {
    const map: Record<string, number> = {
      一: 1,
      二: 2,
      三: 3,
      四: 4,
      五: 5,
      六: 6,
      七: 7,
      八: 8,
      九: 9,
      十: 10,
    };

    const match = text.match(/[一二三四五六七八九十]/);
    if (match && map[match[0]]) {
      return map[match[0]];
    }

    return null;
  }

  const matchMulti = (text: string, patterns: RegExp[]): string => {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1] ?? match[2] ?? match[3] ?? "-";
    }
    return "-";
  };

  const examStyleMap: Record<string, string> = {
    Outstanding: "text-sky-400 ",
    Excellent: "text-lime-400",
    Standard: "text-amber-400",
    Normal: "text-zinc-200",
    Flawed: "text-rose-500 font-bold",

    // JP
    卓越: "text-sky-400", // Outstanding
    優秀: "text-lime-400", // Excellent
    標準: "text-amber-400", // Standard
    普通: "text-zinc-200", // Normal
    欠落: "text-rose-500 font-bold", // Flawed

    // CN
    //卓越: "text-sky-400", // Outstanding
    优良: "text-lime-400", // Excellent
    标准: "text-amber-400", // Standard
    //普通: "text-zinc-200", // Normal
    缺陷: "text-rose-500 font-bold", // Flawed
  };

  const physicalExamKeys: Record<string, string[]> = {
    "Physical Strength": ["Physical Strength", "物理强度", "物理強度"],
    Mobility: ["Mobility", "战场机动", "戦場機動"],
    "Physical Resilience": ["Physical Resilience", "生理耐受", "生理的耐性"],
    "Tactical Acumen": ["Tactical Acumen", "战术规划", "戦術立案"],
    "Combat Skill": ["Combat Skill", "战斗技巧", "戦闘技術"],
    "Arts Assimilation": [
      "Originium Arts Assimilation",
      "源石技艺适应性",
      "アーツ適性",
    ],
  };

  const infoRows: [label: string, value: React.ReactNode][] = [
    [
      "Code Name",
      (() => {
        const name =
          opDetail.meta_info.appellation?.trim() || opDetail.meta_info.name;

        const parts = name.split(/ the /i);
        return parts.map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {i > 0 ? "the " : ""}
            {part}
          </React.Fragment>
        ));
      })(),
    ],
    [
      "Gender",
      matchMulti(basicInfoText, [/Gender\] (.+)/, /性别】(.+)/, /性別】(.+)/]),
    ],
    [
      "Combat Experience",
      matchMulti(basicInfoText, [
        /Combat Experience\] (.+)/,
        /战斗经验】(.+)/,
        /戦闘経験】(.+)/,
      ]),
    ],
    [
      "Place of Birth",
      matchMulti(basicInfoText, [
        /Place of Birth\] (.+)/,
        /出身地】(.+)/,
        /出身地】(.+)/,
      ]),
    ],
    [
      "Date of Birth",
      matchMulti(basicInfoText, [
        /Date of Birth\] (.+)/,
        /生日】(.+)/,
        /誕生日】(.+)/,
      ]),
    ],
    [
      "Race",
      matchMulti(basicInfoText, [/Race\] (.+)/, /种族】(.+)/, /種族】(.+)/]),
    ],
    [
      "Height",
      matchMulti(basicInfoText, [/Height\] (.+)/, /身高】(.+)/, /身長】(.+)/]),
    ],
  ];

  return (
    <div className="p-4 space-y-6 text-sm text-gray-300">
      {/* Profile */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Profile</h2>
        <p className="whitespace-pre-wrap">{profileText}</p>
      </div>

      {/* Basic Info + Physical Exam */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-base font-bold text-white mb-2 border-b border-zinc-700 pb-1">
            Basic Info
          </h3>
          <div className="space-y-1 text-sm text-zinc-300">
            {infoRows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[auto_1fr] gap-4 border-b border-zinc-800 py-0.5"
              >
                <span className="text-zinc-400">{label}</span>
                <span className="font-semibold text-right text-white">
                  {value || "-"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Physical Exam */}
        <div>
          <h3 className="text-base font-bold text-white mb-2 border-b border-zinc-700 pb-1">
            Physical Exam
          </h3>
          <div className="space-y-1 text-sm text-zinc-300">
            {Object.entries(physicalExamKeys).map(([label, keys]) => {
              const patterns = keys.flatMap((key) => [
                new RegExp(`\\[${key}\\] (.+)`),
                new RegExp(`【${key}】(.+)`),
              ]);
              const value = matchMulti(physicalExamText, patterns).trim();
              const color = examStyleMap[value] ?? "text-white";

              return (
                <div
                  key={label}
                  className="grid grid-cols-[auto_1fr] gap-4 border-b border-zinc-800 py-0.5"
                >
                  <span className="text-zinc-400">{label}</span>
                  <span className={`font-semibold text-right ${color}`}>
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Infection Status */}
      <div className="bg-zinc-900 border border-zinc-700 text-sm whitespace-pre-wrap">
        <h3 className="text-base font-semibold text-white border-b border-zinc-700 p-4">
          Infection Status
        </h3>
        <p className="whitespace-pre-wrap p-4">
          {highlightClinicalText(clinicalText)}
        </p>
      </div>

      {/* Archive File */}
      {archiveFiles.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-700 text-sm whitespace-pre-wrap">
          <h3 className="text-base font-semibold text-white border-b border-zinc-700 p-4">
            <div className="flex items-center gap-2">
              <span>Archive Files</span>
              <Badge
                variant="outline"
                className="text-yellow-400 bg-yellow-950/50"
              >
                Spoiler Warning
              </Badge>
            </div>
          </h3>
          <Accordion type="multiple" className="w-full">
            {archiveFiles.map((entry, i) => (
              <AccordionItem key={i} value={`archive-${i}`}>
                <AccordionTrigger className="px-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Folder size={16} />
                      <span>{`Archive File ${entry.num ?? i + 1}`}</span>
                    </div>

                    {entry.unLockType === "FAVOR" && (
                      <Badge
                        variant="outline"
                        className="text-emerald-300 bg-emerald-900/40 ml-4"
                      >
                        Trust {entry.unLockParam}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>

                <AccordionContent className="whitespace-pre-wrap text-zinc-300 px-4">
                  {entry.text}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {/* Promotion Record */}
      {promotionEntry && (
        <div className="bg-zinc-900 border border-zinc-700 text-sm whitespace-pre-wrap">
          <h3 className="text-base font-semibold text-white border-b border-zinc-700 p-4">
            <div className="flex items-center gap-2">
              <span>Promotion Record</span>
              <Badge
                variant="outline"
                className="text-yellow-400 bg-yellow-950/50"
              >
                Spoiler Warning
              </Badge>
            </div>
          </h3>
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="promotion-record">
              <AccordionTrigger className="px-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Folder size={16} />
                    <span>View Record</span>
                  </div>

                  {promotionEntry.unLockType === "AWAKE" &&
                    promotionEntry.unLockParam === "2;1" && (
                      <Badge
                        variant="outline"
                        className="text-indigo-300 bg-indigo-900/40 ml-4"
                      >
                        E2
                      </Badge>
                    )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="whitespace-pre-wrap text-zinc-300 px-4">
                {promotionEntry.text}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
}
