"use client";

import { useSyncExternalStore } from "react";

type Progress = { readIds: string[]; recentIds: string[] };

const key = "meridianos.progress.v1";
const emptyProgress: Progress = { readIds: [], recentIds: [] };
const eventName = "meridianos:progress";
let savedText: string | null | undefined;
let cachedProgress = emptyProgress;
let inMemory = false;

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function getProgress() {
  if (inMemory) return cachedProgress;

  try {
    const text = window.localStorage.getItem(key);
    if (text !== savedText) {
      savedText = text;
      const data = text ? JSON.parse(text) : null;
      cachedProgress = data
        ? { readIds: stringArray(data.readIds), recentIds: stringArray(data.recentIds) }
        : emptyProgress;
    }
  } catch {
    cachedProgress = emptyProgress;
  }

  return cachedProgress;
}

function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(eventName, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(eventName, listener);
  };
}

function updateProgress(progress: Progress) {
  try {
    window.localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    inMemory = true;
  }
  cachedProgress = progress;
  window.dispatchEvent(new Event(eventName));
}

function markRead(id: string) {
  const progress = getProgress();
  if (progress.readIds.includes(id)) return;

  updateProgress({ ...progress, readIds: [...progress.readIds, id] });
}

function recordRecent(id: string) {
  const progress = getProgress();
  if (progress.recentIds[0] === id) return;

  updateProgress({ ...progress, recentIds: [id, ...progress.recentIds.filter((item) => item !== id)].slice(0, 8) });
}

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getProgress, () => emptyProgress);
  return { ...progress, markRead, recordRecent };
}
