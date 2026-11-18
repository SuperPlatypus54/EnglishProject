export const appIds = ["heartline", "mail", "analytics", "files", "calendar", "notes"] as const;

export type AppId = (typeof appIds)[number];

export interface AppProps {
  view: string;
  go: (view: string) => void;
  back: () => void;
  readIds: readonly string[];
  markRead: (id: string) => void;
  recentIds: readonly string[];
  recordRecent: (id: string) => void;
}

export type WorkstationLocation =
  | { screen: "home" }
  | { screen: "app"; app: AppId; view: string };

export function getLocation(hash: string): WorkstationLocation {
  const [app, ...view] = hash.slice(1).split("/");
  const appId = appIds.find((id) => id === app);
  return appId ? { screen: "app", app: appId, view: view.join("/") } : { screen: "home" };
}
