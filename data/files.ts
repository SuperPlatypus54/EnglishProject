export interface ChecklistItem {
  label: string;
  checked: boolean;
}

export type ArtifactSection =
  | { kind: "paragraphs"; title?: string; paragraphs: readonly string[] }
  | {
      kind: "fields";
      title?: string;
      fields: readonly { label: string; value: string }[];
    }
  | { kind: "checklist"; title?: string; items: readonly ChecklistItem[] };

export type FileFolderId = "documents" | "personal" | "downloads" | "family-photos" | "old-letters" | "trash";

export interface FileFolder {
  id: FileFolderId;
  name: string;
  parent?: FileFolderId;
  summary: string;
}

interface FamilyPhoto {
  position: "left" | "center" | "right";
  alt: string;
  caption: string;
}

export interface WorkstationDocument {
  id: string;
  name: string;
  folder: FileFolderId;
  format: "pdf" | "text" | "photo";
  modified: string;
  summary: string;
  heading?: string;
  issuer?: string;
  sections: readonly ArtifactSection[];
  photo?: FamilyPhoto;
}

export const fileFolders: readonly FileFolder[] = [
  { id: "documents", name: "Documents", summary: "Employment and tenancy records" },
  { id: "personal", name: "Personal", summary: "Photos, letters, and plans" },
  { id: "downloads", name: "Downloads", summary: "Saved attachments and confirmations" },
  { id: "family-photos", name: "Family Photos", parent: "personal", summary: "Scans of family prints" },
  { id: "old-letters", name: "Old Letters", parent: "personal", summary: "Letters James saved" },
  { id: "trash", name: "Trash", summary: "Discarded files" },
];

export const dateNightChecklist: readonly ChecklistItem[] = [
  { label: "Make reservation", checked: true },
  { label: "Buy flowers", checked: true },
  { label: "Get wine", checked: true },
  { label: "Pick up candles", checked: true },
  { label: "Buy bath bombs", checked: true },
  { label: "Clean apartment", checked: false },
  { label: "Relax and stop overthinking", checked: false },
];

export const resignationDraft = "I've been thinking about this for a while, and I don't know if I can keep...";

export const documents: readonly WorkstationDocument[] = [
  {
    id: "employment-contract",
    name: "Employment Contract.pdf",
    folder: "documents",
    format: "pdf",
    modified: "2025-03-03",
    heading: "Employment Agreement",
    issuer: "Apex Sales Group",
    summary: "Signed five-year Sales Associate agreement with a performance review clause.",
    sections: [
      {
        kind: "fields",
        fields: [
          { label: "Employee", value: "James Bond" },
          { label: "Role", value: "Sales Associate" },
          { label: "Assigned branch", value: "Grand Meridian Office" },
          { label: "Start date", value: "March 3, 2025" },
          { label: "Initial term", value: "Five years, through March 2, 2030" },
        ],
      },
      {
        kind: "paragraphs",
        title: "1. Duties and compensation",
        paragraphs: [
          "The employee will maintain assigned accounts, document client communications, and report to the branch manager. Compensation consists of base pay and commission on eligible closed sales under the current branch commission schedule.",
        ],
      },
      {
        kind: "paragraphs",
        title: "2. Performance review",
        paragraphs: [
          "The branch manager will review sales targets, account records, and client follow-through each quarter. If expectations are missed, the manager may schedule a formal review and issue an improvement plan with a written follow-up date. Either party may end the agreement early under the separation terms.",
        ],
      },
      {
        kind: "fields",
        title: "Signatures on record",
        fields: [
          { label: "Employee", value: "James Bond · March 3, 2025" },
          { label: "Branch manager", value: "Andrew Tate · March 3, 2025" },
        ],
      },
    ],
  },
  {
    id: "sales-performance-review",
    name: "Sales Performance Review.pdf",
    folder: "documents",
    format: "pdf",
    modified: "2026-11-18",
    heading: "Performance Review Worksheet",
    issuer: "Apex Sales Group",
    summary: "Latest sales figures and an open performance review for James.",
    sections: [
      {
        kind: "fields",
        fields: [
          { label: "Employee", value: "James Bond" },
          { label: "Manager", value: "Andrew Tate" },
          { label: "Period", value: "November 2026, month to date at Nov 18" },
          { label: "Monthly target", value: "$50,000" },
          { label: "Closed sales", value: "$12,450 (24.9%)" },
          { label: "Accounts", value: "3 deals closed / 28 assigned" },
          { label: "Branch rank", value: "14 of 14" },
        ],
      },
      {
        kind: "paragraphs",
        title: "Manager notes",
        paragraphs: [
          "Bring a current list of accounts without a next follow-up date. Review the service handoffs noted by Marcus and agree on which accounts need a call before Friday.",
          "Performance improvement review pending.",
        ],
      },
    ],
  },
  {
    id: "resignation-draft",
    name: "Resignation Draft.txt",
    folder: "documents",
    format: "text",
    modified: "2026-11-18",
    heading: "Resignation Draft",
    summary: "Unfinished text addressed to Andrew Tate.",
    sections: [
      { kind: "paragraphs", paragraphs: ["Andrew,", resignationDraft] },
    ],
  },
  {
    id: "apartment-lease",
    name: "Apartment Lease.pdf",
    folder: "documents",
    format: "pdf",
    modified: "2026-11-18",
    heading: "Residential Lease",
    issuer: "The Grand Meridian · Tenant copy",
    summary: "Apartment 402 lease and three overdue rent notices from Otto.",
    sections: [
      {
        kind: "fields",
        fields: [
          { label: "Tenant", value: "James Bond" },
          { label: "Landlord", value: "Otto von Habsburg" },
          { label: "Unit", value: "Apartment 402, The Grand Meridian" },
          { label: "Current term", value: "June 1, 2026 to May 31, 2027" },
          { label: "Monthly rent", value: "$1,250, due on the first" },
          { label: "Assigned storage", value: "Basement B-12" },
        ],
      },
      {
        kind: "fields",
        title: "Attached notices",
        fields: [
          { label: "September 8", value: "$350 remains due for September." },
          { label: "October 9", value: "October payment outstanding. Total due $1,600." },
          { label: "November 18", value: "Final notice. Total outstanding rent $2,850." },
        ],
      },
      {
        kind: "paragraphs",
        title: "Landlord correspondence",
        paragraphs: [
          "I can meet at the building office to go over your account. Please call or reply with a time.",
          "Otto von Habsburg",
        ],
      },
    ],
  },
  {
    id: "birthday-plans",
    name: "Birthday Plans.txt",
    folder: "personal",
    format: "text",
    modified: "2026-09-02",
    heading: "Birthday Plans",
    summary: "An old, unfinished plan to get friends and family together.",
    sections: [
      {
        kind: "paragraphs",
        paragraphs: [
          "Maybe just do dinner at Mom and Dad's. Invite Daniel and tell him he can bring whoever. Don't book a whole thing again.",
          "Mom asked if I still had the old prints. Navy shoebox, B-12 downstairs. Should take it next time. Maybe put a few in frames.",
          "Pick a Saturday when Dad's off. Ask Daniel about",
        ],
      },
    ],
  },
  {
    id: "restaurant-reservation",
    name: "Restaurant Reservation.pdf",
    folder: "downloads",
    format: "pdf",
    modified: "2026-11-17",
    heading: "Reservation Confirmation",
    issuer: "The Grand Meridian Restaurant",
    summary: "Dinner reservation for James Bond and one guest at 7:00 PM on November 18.",
    sections: [
      {
        kind: "fields",
        fields: [
          { label: "Reservation name", value: "James Bond" },
          { label: "Date", value: "Wednesday, November 18, 2026" },
          { label: "Time", value: "7:00 PM" },
          { label: "Guests", value: "2" },
          { label: "Location", value: "Restaurant downstairs, off the lobby" },
        ],
      },
      {
        kind: "paragraphs",
        paragraphs: ["Please check in at the host stand when you arrive. We hold reservations for 15 minutes."],
      },
    ],
  },
  {
    id: "date-night-checklist",
    name: "Date Night Checklist.txt",
    folder: "downloads",
    format: "text",
    modified: "2026-11-18",
    heading: "Date Night Checklist",
    summary: "James's evening checklist, saved before dinner with Sydney.",
    sections: [{ kind: "checklist", items: dateNightChecklist }],
  },
  {
    id: "park-picnic",
    name: "Park Picnic.jpg",
    folder: "family-photos",
    format: "photo",
    modified: "2026-07-12",
    heading: "Park picnic",
    summary: "James and his parents at a picnic in the fall.",
    photo: {
      position: "left",
      alt: "James and his parents sitting at a picnic table under gold trees.",
      caption: "Mom, Dad, me. Dad forgot forks again. Original print in the navy shoebox, basement B-12.",
    },
    sections: [],
  },
  {
    id: "kitchen-birthday",
    name: "Kitchen Birthday.jpg",
    folder: "family-photos",
    format: "photo",
    modified: "2026-07-12",
    heading: "Kitchen birthday",
    summary: "An old birthday in the family kitchen.",
    photo: {
      position: "center",
      alt: "James and his mother lighting candles on a cake in the family kitchen.",
      caption: "Mom insisted on every single candle. She found the print in the back of the album.",
    },
    sections: [],
  },
  {
    id: "lake-weekend",
    name: "Lake Weekend.jpg",
    folder: "family-photos",
    format: "photo",
    modified: "2026-07-12",
    heading: "Lake weekend",
    summary: "James and his father sitting on the dock at dusk.",
    photo: {
      position: "right",
      alt: "James and his father looking out from a wooden dock at sunset.",
      caption: "Dad and me on the dock. The envelope marked LAKE WEEKEND has the other three from this roll.",
    },
    sections: [],
  },
  {
    id: "letter-from-home",
    name: "Letter from Home.txt",
    folder: "old-letters",
    format: "text",
    modified: "2026-04-06",
    heading: "Letter from Home",
    summary: "A short letter tucked into a box of photographs.",
    sections: [
      {
        kind: "paragraphs",
        paragraphs: [
          "Jamie,",
          "I put the extra prints in with the envelopes. You always said you didn't remember that lake trip, but Dad says you wouldn't leave the dock. Bring the pictures back next time you come by and we'll sort them.",
          "Love, Mom",
        ],
      },
    ],
  },
  {
    id: "apartment-inventory",
    name: "Apartment Inventory (old).txt",
    folder: "trash",
    format: "text",
    modified: "2026-11-15",
    heading: "Apartment Inventory",
    summary: "An old running list of household repairs and move-in supplies.",
    sections: [
      {
        kind: "paragraphs",
        paragraphs: [
          "Two kitchen chairs, one loose leg.",
          "Ask maintenance if they still have the wall paint for 402. Take a photo in daylight so they can see where it's chipped.",
        ],
      },
    ],
  },
  {
    id: "budget-old",
    name: "October Budget (old).txt",
    folder: "trash",
    format: "text",
    modified: "2026-11-05",
    heading: "October Budget",
    summary: "A discarded budgeting draft with a rent transfer reminder.",
    sections: [
      {
        kind: "paragraphs",
        paragraphs: [
          "Rent transfer bounced. Move it to Friday after the deposit clears.",
          "Cancel gym add-on. Compare grocery receipts. Ask if the phone bill can come out a week later.",
        ],
      },
    ],
  },
];
