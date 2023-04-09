export enum Reactions {
  ThumbsUp = "👍",
  ThumbsDown = "👎",
  Fire = "🔥",
  Heart = "💖",
  Hello = "👋",
}

export type TReactions = {
  [key in Reactions]: number;
};

export type TProfile = {
  about: string;
  createDate: number;
  description: string;
  id: string;
  firstName: string;
  lastName: string;
  imageURL: string;
};

export type TProject = {
  createDate: number;
  description: string;
  id: string;
  imageURL: string;
  tags: TTag[];
  label: string;
  url: string;
};

export type TSkill = {
  id: string;
  label: string;
};

export enum SocialIcons {
  Behance = "behance",
  Codepen = "codepen",
  Facebook = "facebook",
  Github = "github",
  Instagram = "instagram",
  LinkedIn = "linkedIn",
  Medium = "medium",
  Twitter = "twitter",
  Youtube = "youtube",
}

export type TSocialNetwork = {
  id: string;
  label: SocialIcons;
  url: string;
};

export type TTag = {
  id: string;
  label: string;
};

export type TLink = {
  id: string;
  label: string;
  url: string;
};

export enum AlertStatus {
  Success = "success",
  Error = "error",
}
