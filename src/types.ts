enum Reactions {
  ThumbsUp = "👍",
  ThumbsDown = "👎",
  Fire = "🔥",
  Heart = "💖",
  Hello = "👋",
}

type TReactions = {
  [key in Reactions]: number;
};

export type TProfile = {
  about: {
    description: string;
    label: string;
  };
  createDate: number;
  description: string;
  id: string;
  name: string;
  reactions: TReactions;
};

export type TProject = {
  createDate: number;
  description: string;
  id: string;
  imageURL: string;
  reactions: TReactions;
  tags: TTag[];
  label: string;
  url: string;
};

export type TSkill = {
  id: string;
  label: string;
};

export enum SocialNetwork {
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

export type TLink = {
  id: string;
  label: SocialNetwork;
  url: string;
};

export type TTag = {
  id: string;
  label: string;
};
