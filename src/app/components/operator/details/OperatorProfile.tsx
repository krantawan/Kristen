import React from "react";
import type { OperatorDetail } from "@/types/operator";

export default function OperatorProfile({
  opDetail,
}: {
  opDetail: OperatorDetail;
}) {
  const story = opDetail.meta_info.storyTextAudio ?? [];

  const findStory = (title: string) =>
    story.find((s) => s.storyTitle?.toLowerCase().includes(title.toLowerCase()))
      ?.stories?.[0]?.storyText ?? "";

  const examStyleMap: Record<string, string> = {
    Outstanding: "text-sky-400 ",
    Excellent: "text-emerald-400",
    Standard: "text-amber-400",
    Normal: "text-zinc-200",
    Flawed: "text-rose-500 font-bold",
  };

  return (
    <div className="p-4 space-y-6 text-sm text-gray-300">
      {/* Profile */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Profile</h2>
        <p className="whitespace-pre-wrap">{findStory("Profile")}</p>
      </div>

      {/* Basic Info + Physical Exam */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-base font-bold text-white mb-2 border-b border-zinc-700 pb-1">
            Basic Info
          </h3>
          <div className="space-y-1 text-sm text-zinc-300">
            {[
              ["Code Name", opDetail.meta_info.name],
              ["Gender", findStory("Basic Info").match(/Gender\] (.+)/)?.[1]],
              [
                "Combat Experience",
                findStory("Basic Info").match(/Combat Experience\] (.+)/)?.[1],
              ],
              [
                "Place of Birth",
                findStory("Basic Info").match(/Place of Birth\] (.+)/)?.[1],
              ],
              [
                "Date of Birth",
                findStory("Basic Info").match(/Date of Birth\] (.+)/)?.[1],
              ],
              ["Race", findStory("Basic Info").match(/Race\] (.+)/)?.[1]],
              ["Height", findStory("Basic Info").match(/Height\] (.+)/)?.[1]],
            ].map(([label, value]) => (
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
            {[
              "Physical Strength",
              "Mobility",
              "Physical Resilience",
              "Tactical Acumen",
              "Combat Skill",
              "Arts Assimilation",
            ].map((key) => {
              const match = findStory("Physical Exam").match(
                new RegExp(`${key}\\] (.+)`)
              );
              const value = match?.[1]?.trim() ?? "-";
              const color = examStyleMap[value] ?? "text-white";
              return (
                <div
                  key={key}
                  className="grid grid-cols-[auto_1fr] gap-4 border-b border-zinc-800 py-0.5"
                >
                  <span className="text-zinc-400">{key}</span>
                  <span className={`font-semibold text-right ${color}`}>
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Infection / Clinical */}
      <div className="bg-zinc-900 p-4 rounded border border-zinc-700 text-sm whitespace-pre-wrap">
        <h3 className="text-base font-semibold text-white mb-2">
          Infection Status
        </h3>
        {findStory("Clinical Analysis")}
      </div>
    </div>
  );
}
