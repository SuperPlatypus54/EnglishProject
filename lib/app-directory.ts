import { Bell, CalendarDays, ChartNoAxesColumnIncreasing, Folder, Heart, Mail, NotebookPen } from "lucide-react";
import type { AppId } from "./workstation";

export const appDirectory = {
  heartline: { name: "Heartline", description: "Matches and conversations", icon: Heart },
  mail: { name: "Meridian Mail", description: "Inbox, sent mail, and drafts", icon: Mail },
  analytics: { name: "Apex Analytics", description: "Sales performance and branch reports", icon: ChartNoAxesColumnIncreasing },
  files: { name: "Files", description: "Documents and folders", icon: Folder },
  calendar: { name: "Calendar", description: "Appointments and events", icon: CalendarDays },
  notes: { name: "Notes", description: "Personal notes and lists", icon: NotebookPen },
} satisfies Record<AppId, { name: string; description: string; icon: typeof Bell }>;
