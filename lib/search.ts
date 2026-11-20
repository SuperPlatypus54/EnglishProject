import { calendarEvents, formatEventTime } from "@/data/calendar";
import { documents, fileFolders, type ArtifactSection } from "@/data/files";
import { heartlineProfiles, heartlineThreads } from "@/data/heartline";
import { mailMessages } from "@/data/mail";
import { notes } from "@/data/notes";
import { appDirectory } from "./app-directory";
import { appIds, type AppId } from "./workstation";

export interface SearchEntry {
  app: AppId;
  view: string;
  title: string;
  detail: string;
  content?: string;
}

export const searchableApps: readonly SearchEntry[] = appIds.map((app) => ({
  app, view: "", title: appDirectory[app].name, detail: appDirectory[app].description,
}));

function sectionText(sections: readonly ArtifactSection[]) {
  return sections.map((section) => {
    if (section.kind === "paragraphs") return [section.title, ...section.paragraphs].join(" ");
    if (section.kind === "fields") return [section.title, ...section.fields.map(({ label, value }) => `${label} ${value}`)].join(" ");
    return [section.title, ...section.items.map(({ label }) => label)].join(" ");
  }).join(" ");
}

const searchIndex: readonly SearchEntry[] = [
  ...searchableApps,
  ...fileFolders.map<SearchEntry>((item) => ({
    app: "files", view: `folder/${item.id}`, title: item.name, detail: "Folder", content: item.summary,
  })),
  ...documents.map<SearchEntry>((item) => ({
    app: "files", view: `document/${item.id}`, title: item.name, detail: "Files",
    content: [item.summary, item.heading, item.issuer, item.photo?.caption, sectionText(item.sections)].join(" "),
  })),
  ...mailMessages.map<SearchEntry>((item) => ({
    app: "mail", view: `message/${item.id}`, title: item.subject, detail: `Meridian Mail · ${item.folder === "sent" || item.folder === "drafts" ? item.to : item.from}`,
    content: [item.from, item.fromAddress, item.to, item.toAddress, item.body, item.date].join(" "),
  })),
  ...notes.map<SearchEntry>((item) => ({
    app: "notes", view: `note/${item.id}`, title: item.title, detail: "Notes", content: [item.summary, sectionText(item.sections)].join(" "),
  })),
  ...calendarEvents.map<SearchEntry>((item) => ({
    app: "calendar", view: `event/${item.id}`, title: item.title, detail: `Calendar · ${formatEventTime(item.time)}`,
    content: [item.category, item.date, item.location, item.description].join(" "),
  })),
  ...heartlineThreads.map<SearchEntry>((item) => ({
    app: "heartline", view: `thread/${item.id}`, title: heartlineProfiles.find((person) => person.id === item.personId)?.name ?? item.id,
    detail: "Heartline conversation", content: item.messages.map((message) => message.text).join(" "),
  })),
  ...heartlineProfiles.map<SearchEntry>((item) => ({
    app: "heartline", view: `profile/${item.id}`, title: `${item.name}'s profile`, detail: "Heartline",
    content: [item.occupation, item.bio, ...item.interests].join(" "),
  })),
  { app: "analytics", view: "branch", title: "Branch performance", detail: "Apex Analytics", content: "Andrew Tate branch quota Grand Meridian Office" },
  { app: "analytics", view: "team", title: "Office staff", detail: "Apex Analytics", content: "Grand Meridian Office James Bond Sales Associate Andrew Tate Branch Manager two employees roster" },
];

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

const normalizedIndex = searchIndex.map((entry) => ({
  entry,
  title: normalize(entry.title),
  text: normalize([entry.title, entry.detail, entry.content].join(" ")),
}));

export function searchWorkstation(query: string): SearchEntry[] {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  return normalizedIndex
    .filter(({ text }) => terms.every((term) => text.includes(term)))
    .sort((a, b) => {
      const score = (title: string) => terms.filter((term) => title.includes(term)).length;
      return score(b.title) - score(a.title);
    })
    .map(({ entry }) => entry);
}
