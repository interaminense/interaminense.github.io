import { TProject } from "../types";

/** Lowercase letters and digits only: "Node.js" and "NodeJS" both -> "nodejs". */
export function normalize(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Skills are written for people ("Data Visualization") and project tags for
 * filtering ("D3 Chart", "Recharts"), so a skill maps to the tags that count
 * as using it. Keys and values are normalized. A skill that isn't listed
 * here still matches a tag with the same name.
 */
const SKILL_TAGS: Record<string, string[]> = {
  react: ["reactjs"],
  javascript: ["jquery", "angularjs"],
  csssass: [
    "css",
    "css3",
    "sass",
    "cssfilter",
    "cssrotation",
    "perspective",
    "boxshadow",
    "grid",
    "materializecss",
  ],
  datavisualization: ["d3chart", "recharts"],
  testingjestplaywright: ["jest", "playwright", "vitest", "unittests"],
  chromeextensions: ["chromeextension"],
  aiassisteddevelopment: ["geminiai", "langchain", "claude"],
  canvaswebaudio: ["htmlcanvas", "webaudio", "webgl"],
};

export function tagsForSkill(skill: string) {
  const key = normalize(skill);

  return new Set([key, ...(SKILL_TAGS[key] ?? [])]);
}

export function projectUsesSkill(project: TProject, skill: string) {
  const tags = tagsForSkill(skill);

  return (project.tags ?? []).some(({ label }) => tags.has(normalize(label)));
}
