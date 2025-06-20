export type OperatorSkin = {
  skinId: string;
  illustId: string;
  avatarId: string;
  portraitId: string;
  sortId?: number;
  displayName?: string;
  description?: string;
  overridePrefabKey?: string;
  skinGroupName: string;
  drawerList?: string[];
};

export type OperatorSkill = {
  skillId: string;
  name: string;
  description: string;
  iconId: string;
  spData?: unknown;
  duration: number;
  spCost?: number;
  initSp?: number;
  blackboard?: Array<{ key: string; value: number }>;
};

export type ModuleUpgrade = {
  equipLevel: number;
  attributeBlackboard: {
    key: string;
    value: number;
  }[];
};

export type OperatorModule = {
  moduleId: string;
  moduleName: string;
  desc: string;
  typeIcon?: string;
  uniEquipIcon?: string;
  typeName1?: string;
  typeName2?: "X" | "Y" | "Z";
  showEvolvePhase?: string;
  unlockLevel?: number;
  itemCost?: Record<string, ItemCost[]>;
  statBonus?: ModuleStatBonus;
  module_upgrades?: ModuleUpgrade[];
};

export type ItemCost = {
  id: string;
  count: number;
  type: string;
};

export type ModuleStatBonus = {
  [level: string]: {
    maxHp?: number;
    atk?: number;
    def?: number;
    [key: string]: number | undefined;
  };
};

export type BuildingSkill = {
  skillId?: string;
  skillName?: string;
  description?: string;
  skillIcon?: string;
  roomType?: string;
  phase?: number;
};

export type Phase = {
  rangeId: string;
  maxLevel: number;
  attributesKeyFrames: {
    level: number;
    data: Record<string, number>;
  }[];
  evolveCost?: {
    id: string;
    count: number;
    name: string;
    rarity: number;
    iconId: string;
    type: string;
  }[];
};

export type MetaInfo = {
  name: string;
  nationId?: string;
  appellation?: string;
  tagList: string[];
  illustrator?: string;
  voiceActor?: {
    en?: string;
    jp?: string;
    kr?: string;
    cn?: string;
  };
  team?: string;
  position?: string;
  profession?: string;
  subProfessionId?: string;
  attributes?: {
    maxHp?: number;
    atk?: number;
    def?: number;
    magicResistance?: number;
    blockCnt?: number;
    baseAttackTime?: number;
    respawnTime?: number;
    cost?: number;
  };
  phases?: Phase[];
  rarity: number;
  storyTextAudio?: StoryBlock[];
};
export type StoryBlock = {
  storyTitle: string;
  stories: StoryEntry[];
};
export type StoryEntry = {
  storyText: string;
  unLockType?: string;
  unLockParam?: string;
};

export type PotentialBonus = {
  type: string;
  value: number;
  buff?: {
    attributes?: {
      attributeModifiers?: {
        attributeType: string;
        value: number;
      }[];
    };
  };
};

export type FavorKeyFrame = {
  level: number;
  data: Record<string, number>;
};

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

export type OperatorSummary = {
  id: string;
  name: string;
  name_cn: string;
  name_jp: string;
  rarity: number;
  image: string;
  profession: string;
  subProfession: string;
  position: string;
  tagList: string[];
  nationId: string;
  obtainable: boolean;
  source: string;
  isNotObtainable: boolean;
  itemObtainApproach: string;
};
