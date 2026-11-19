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
          { label: "Call the client back. The first call is already logged.", checked: false },
          { label: "Send revised quote. It was due Tuesday.", checked: false },
          { label: "Pull the November numbers for Andrew.", checked: true },
          { label: "Update accounts with no follow-up date.", checked: false },
        ],
      },
      {
        kind: "paragraphs",
        paragraphs: [
          "$50k target. $12,450 posted. Check if the November renewal was counted yet.",
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
          "Get Otto a picture of the chipped wall in 402. The light by the door is terrible. Try in the morning.",
        ],
      },
    ],
  },
  {
    id: "weekend-plans",
    title: "Weekend Plans",
    modified: "2026-11-17",
    summary: "Maybe drive out to the lake on Sunday.",
    sections: [
      {
        kind: "checklist",
        items: [
          { label: "Check the weather for Sunday", checked: true },
          { label: "Find the old envelope from the lake", checked: false },
          { label: "Fill up the car", checked: false },
        ],
      },
      {
        kind: "paragraphs",
        paragraphs: [
          "Maybe just go for an hour. Figure out where I put the basement key.",
        ],
      },
    ],
  },
  {
    id: "people-to-call",
    title: "People to Call",
    modified: "2026-08-26",
    summary: "Three calls James meant to make in August.",
    sections: [
      {
        kind: "checklist",
        items: [
          { label: "Andrew about next month's target", checked: false },
          { label: "Otto about the storage key", checked: false },
          { label: "Gordon about the old dinner receipt", checked: false },
        ],
      },
    ],
  },
];
