import {
  OperatorSkin,
  OperatorSkill,
  OperatorModule,
  BuildingSkill,
  MetaInfo,
  Phase,
  FavorKeyFrame,
  PotentialBonus,
} from "@/types/operator";

type Lang = "cn" | "en" | "jp";

export function mapLocaleToLang(locale: string): Lang {
  switch (locale) {
    case "ja":
      return "jp";
    case "zh":
    case "zh-CN":
    case "zh-TW":
      return "cn";
    case "en":
    default:
      return "en";
  }
}

export type OperatorDetail = {
  id: string;
  skins: OperatorSkin[];
  skills: OperatorSkill[];
  modules: OperatorModule[];
  handbook_info: unknown;
  voice_lines: unknown;
  building_skills: BuildingSkill[];
  patch_info: unknown;
  meta_info: MetaInfo;
  phases?: Phase[];
  favorKeyFrames?: FavorKeyFrame[];
  potentialRanks?: PotentialBonus[];
};

export async function getOperatorDetail(
  operatorId: string,
  lang: Lang = "en",
  fallbackCN: boolean = true
): Promise<OperatorDetail | undefined> {
  const loadOperatorDetail = async (
    id: string,
    lang: Lang
  ): Promise<OperatorDetail | undefined> => {
    try {
      const detail = await import(`@/data/operator_detail/${lang}/${id}.json`);
      return detail.default as OperatorDetail;
    } catch {
      console.warn(`Operator detail not found for ${id} (${lang})`);
      return undefined;
    }
  };

  const primary = await loadOperatorDetail(operatorId, lang);
  const fallback = fallbackCN
    ? await loadOperatorDetail(operatorId, "cn")
    : undefined;

  if (!primary && !fallback) return undefined;

  if (!fallbackCN || !fallback) return primary;

  const merged: OperatorDetail = {
    id: operatorId,
    skins: primary?.skins?.length ? primary.skins : fallback.skins,
    skills: primary?.skills?.length ? primary.skills : fallback.skills,
    modules: primary?.modules?.length ? primary.modules : fallback.modules,
    handbook_info:
      primary?.handbook_info && Object.keys(primary.handbook_info).length > 0
        ? primary.handbook_info
        : fallback.handbook_info,
    voice_lines:
      primary?.voice_lines && Object.keys(primary.voice_lines).length > 0
        ? primary.voice_lines
        : fallback.voice_lines,
    building_skills: primary?.building_skills?.length
      ? primary.building_skills
      : fallback.building_skills,
    patch_info: primary?.patch_info ?? fallback.patch_info,
    meta_info: primary?.meta_info ?? fallback.meta_info,
    phases: primary?.phases ?? fallback.phases,
    favorKeyFrames:
      primary?.favorKeyFrames?.length && primary.favorKeyFrames.length > 0
        ? primary.favorKeyFrames
        : fallback.favorKeyFrames,
    potentialRanks: primary?.potentialRanks?.length
      ? primary.potentialRanks
      : fallback.potentialRanks,
  };

  return merged;
}
