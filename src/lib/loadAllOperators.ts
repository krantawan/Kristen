import fs from "fs";
import path from "path";

export type OperatorSummary = {
  id: string;
  name: string;
  appellation?: string;
  name_en?: string;
  name_cn?: string;
  name_jp?: string;
  slug: string;
  rarity: number;
  profession: string;
  subProfession: string;
  isNotObtainable: boolean;
  source: "global" | "cn-only";
};

export async function loadOperatorSummaries(
  lang: "cn" | "en" | "jp" = "en",
  includeAll = false
): Promise<OperatorSummary[]> {
  const dirPath = path.join(process.cwd(), "src/data/operator_detail", lang);
  const files = fs.readdirSync(dirPath);

  const summaries: OperatorSummary[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dirPath, file), "utf-8");
      const json = JSON.parse(raw);
      const meta = json.meta_info;

      if (!meta) {
        console.warn("Missing meta_info in", file);
        continue;
      }

      const isObtainable = meta.isNotObtainable !== true;
      if (!includeAll && !isObtainable) continue;

      const name = meta.name ?? "";
      const appellation = meta.appellation?.trim();
      const fallback = json.id.replace(/^char_/, "");

      const slug = (appellation || name || fallback)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      summaries.push({
        id: json.id,
        name: meta.name ?? "",
        appellation: meta.appellation?.trim() ?? "",
        slug,
        rarity: meta.rarity ?? 0,
        profession: meta.profession ?? "",
        subProfession: meta.subProfessionId ?? "",
        isNotObtainable: !isObtainable,
        source: "global",
      });
    } catch (error) {
      console.error("Failed to parse:", file, error);
    }
  }

  return summaries;
}

export async function getAllOperatorsWithSource(): Promise<OperatorSummary[]> {
  const cnOps = await loadOperatorSummaries("cn", false);
  const jpOps = await loadOperatorSummaries("jp", false);
  const enOps = await loadOperatorSummaries("en", false);

  const cnNameMap = new Map(cnOps.map((op) => [op.id, op.name]));
  const jpNameMap = new Map(jpOps.map((op) => [op.id, op.name]));
  const enAppellationMap = new Map(
    enOps.map((op) => [op.id, op.appellation || op.name])
  );

  const enIds = new Set(enOps.map((op) => op.id));

  const combined = cnOps.map((op) => {
    const id = op.id;
    const name_en = enAppellationMap.get(id) ?? "";
    const name_cn = cnNameMap.get(id) ?? "";
    const name_jp = jpNameMap.get(id) ?? "";

    return {
      ...op,
      name: name_en || name_cn || name_jp || op.name,
      name_en,
      name_cn,
      name_jp,
      source: enIds.has(id) ? ("global" as const) : ("cn-only" as const),
    };
  });

  return combined;
}
