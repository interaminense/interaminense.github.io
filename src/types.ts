export type TProfile = {
  about: {
    description: string;
    label: string;
  };
  createDate: number;
  description: string;
  id: string;
  links: {
    label: string;
    url: string;
  }[];
  name: string;
  reactions: {
    fire: number;
    hi: number;
    "thumbs-down": number;
    "thumbs-up": number;
  };
  skills: { label: string; id: string }[];
};
