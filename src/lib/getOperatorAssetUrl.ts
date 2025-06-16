const ASSET_BASE_PATH = "/assets";

const DEFAULT_IMAGES = {
  skin: "/game-ui/char_any.png",
  portrait: "/game-ui/char_any.png",
  skill: "/assets/skill/default.png",
  building_skill: "/assets/building_skill/default.png",
  item: "/assets/item/default.png",
  item_rarity_img: "/assets/item_rarity_img/default.png",
};

export function getOperatorAssetUrl(
  type:
    | "skin"
    | "portrait"
    | "skill"
    | "building_skill"
    | "item"
    | "item_rarity_img",
  id?: string,
  options?: {
    skinFullArt?: boolean;
    skillVersion?: number;
  }
): string {
  if (!id || id.trim() === "") {
    return DEFAULT_IMAGES[type] ?? "";
  }

  let finalId = id;

  if (type === "skin" && options?.skinFullArt) {
    finalId = id.replace("illust_", "") + "b";
  }

  if (type === "skill") {
    const skillVersion = options?.skillVersion ?? 1;

    // ถ้า id เริ่มด้วย skcom_ → เติม [1]
    if (id.startsWith("skcom_")) {
      // ถ้า id ยังไม่มี [x] → เติม [skillVersion]
      if (/\[\d+\]/.test(id)) {
        finalId = `skill_icon_${id}`;
      } else {
        finalId = `skill_icon_${id}[${skillVersion}]`;
      }
    } else {
      // ถ้าเป็น skchr_ หรืออื่นๆ → ไม่เติม [1] → ใช้ตรงๆ
      finalId = `skill_icon_${id}`;
    }
  }

  // VERY IMPORTANT → encodeURIComponent เพื่อกัน # หรือ special char
  const encodedFileName = encodeURIComponent(finalId);

  return `${ASSET_BASE_PATH}/${type}/${encodedFileName}.png`;
}
