export type EventCategory = "Personal" | "Work" | "Reminder";

export interface CalendarRecord {
  id: string;
  date: string;
  time: string;
  title: string;
  category: EventCategory;
  location?: string;
  description?: string;
  priority?: boolean;
}

export const snapshotDate = "2026-11-18";

export const calendarEvents: readonly CalendarRecord[] = [
  {
    id: "laundry", date: "2026-11-03", time: "18:00",
    title: "Laundry", category: "Personal", location: "The Grand Meridian",
  },
  {
    id: "inventory-call", date: "2026-11-05", time: "10:30",
    title: "Inventory call", category: "Work", location: "Apex Sales Group",
  },
  {
    id: "pick-up-coat", date: "2026-11-07", time: "11:00",
    title: "Pick up coat", category: "Personal",
  },
  {
    id: "branch-standup", date: "2026-11-09", time: "09:15",
    title: "Branch standup", category: "Work", location: "Grand Meridian Office",
  },
  {
    id: "car-service", date: "2026-11-12", time: "08:00",
    title: "Car service", category: "Personal",
  },
  {
    id: "heartline-messages", date: "2026-11-17", time: "15:00",
    title: "Heartline messages", category: "Personal",
  },
  {
    id: "review-correspondence", date: "2026-11-17", time: "15:30",
    title: "Review office correspondence", category: "Work",
  },
  {
    id: "dinner-with-sydney", date: "2026-11-18", time: "19:00",
    title: "Dinner with Sydney", category: "Personal",
    location: "The Grand Meridian Restaurant",
    description: "Reservation for two under James Bond.",
  },
  {
    id: "personal-evening", date: "2026-11-18", time: "20:30",
    title: "Personal evening plans", category: "Personal",
  },
  {
    id: "performance-meeting", date: "2026-11-19", time: "09:00",
    title: "Mandatory Performance Meeting with Andrew Tate", category: "Work",
    location: "Andrew Tate’s office, Apex Sales Group",
    description: "Attendance required. Bring current account and pipeline figures.",
    priority: true,
  },
];

export function formatEventTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
}
