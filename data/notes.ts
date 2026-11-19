import { dateNightChecklist, type ArtifactSection } from "./files";

export interface WorkstationNote {
  id: string;
  title: string;
  modified: string;
  summary: string;
  sections: readonly ArtifactSection[];
}

export const notes: readonly WorkstationNote[] = [
  {
    id: "date-night",
    title: "Date Night",
    modified: "2026-11-18",
    summary: "Dinner with Sydney downstairs at seven.",
    sections: [
      { kind: "checklist", items: dateNightChecklist },
      {
        kind: "paragraphs",
        paragraphs: [
          "Dinner with Sydney downstairs at seven. Navy shirt if it's actually clean. Leave the flowers upstairs until after dinner.",
        ],
      },
    ],
  },
  {
    id: "work",
    title: "Work",
    modified: "2026-11-18",
    summary: "Call backs, missed deadlines, and the numbers for Andrew.",
    sections: [
      {
        kind: "checklist",
        items: [
          { label: "Return the call on the Greystone account. Marcus covered the first call.", checked: false },
          { label: "Send revised quote. It was due Tuesday.", checked: false },
          { label: "Pull the November numbers for Andrew.", checked: true },
          { label: "Update accounts with no follow-up date.", checked: false },
        ],
      },
      {
        kind: "paragraphs",
        paragraphs: [
          "$50k target. $12,450 posted. Check if the Calder renewal was counted yet.",
          "Tomorrow, 9:00. Bring a copy of the account list. Print it in the morning.",
        ],
      },
    ],
  },
  {
    id: "apartment",
    title: "Apartment",
    modified: "2026-11-16",
    summary: "Text Otto when I know what I can transfer.",
    sections: [
      {
        kind: "paragraphs",
        paragraphs: [
          "Text Otto when I know what I can transfer. Ask if he'll take September's balance first.",
          "Maintenance wants a picture of the chipped wall in 402. The light by the door is terrible. Try in the morning.",
        ],
      },
    ],
  },
  {
    id: "weekend-plans",
    title: "Weekend Plans",
    modified: "2026-11-17",
    summary: "Daniel asked about Friday. Maybe bring the old photos.",
    sections: [
      {
        kind: "checklist",
        items: [
          { label: "Check Daniel's invite", checked: true },
          { label: "Ask Daniel what time to come over", checked: false },
          { label: "See if Mom and Dad are around Sunday", checked: false },
        ],
      },
      {
        kind: "paragraphs",
        paragraphs: [
          "Maybe just go for an hour. If I drive home Sunday, bring the old photos. Figure out where I put the basement key.",
        ],
      },
    ],
  },
  {
    id: "people-to-call",
    title: "People to Call",
    modified: "2026-08-26",
    summary: "Mom, Dad, Daniel",
    sections: [
      {
        kind: "checklist",
        items: [
          { label: "Mom", checked: false },
          { label: "Dad", checked: false },
          { label: "Daniel", checked: false },
        ],
      },
    ],
  },
];
