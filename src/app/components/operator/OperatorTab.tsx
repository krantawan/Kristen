"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OperatorProfile from "./details/OperatorProfile";
import type { OperatorDetail } from "@/types/operator";
import OperatorModules from "./details/OperatorModules";
import OperatorSkill from "./details/OperatorSkill";

export default function OperatorTabs({
  opDetail,
}: {
  opDetail: OperatorDetail;
}) {
  //console.log(opDetail);

  return (
    <div className="border-t dark:border-zinc-800">
      <div className="w-full overflow-x-auto">
        <Tabs defaultValue="profile">
          <TabsList className="flex flex-wrap md:flex-nowrap gap-2 px-2">
            {[
              { value: "profile", label: "Profile" },
              { value: "modules", label: "Modules" },
              { value: "skills", label: "Skills" },
              { value: "talents", label: "Talents" },
              { value: "voice", label: "Voice" },
              { value: "story", label: "Story" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                value={tab.value}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile">
            <OperatorProfile opDetail={opDetail} />
          </TabsContent>

          <TabsContent value="modules">
            <OperatorModules modules={opDetail.modules} />
          </TabsContent>

          <TabsContent value="skills">
            <OperatorSkill
              skills={opDetail.skills}
              skillLevelUpgrade={opDetail.skills_1to7 ?? []}
            />
          </TabsContent>

          <TabsContent value="talents">
            <div className="text-sm text-zinc-400 h-200 p-4">
              Talents section coming soon...
            </div>
          </TabsContent>

          <TabsContent value="voice">
            <div className="text-sm text-zinc-400 h-200 p-4">
              Voice section coming soon...
            </div>
          </TabsContent>

          <TabsContent value="story">
            <div className="text-sm text-zinc-400 h-200 p-4">
              Story section coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
