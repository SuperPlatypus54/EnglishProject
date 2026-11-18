"use client";

import { useSyncExternalStore } from "react";
import { getLocation } from "./workstation";

const eventName = "meridianos:navigate";

function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener("hashchange", listener);
  window.addEventListener(eventName, listener);

  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener("hashchange", listener);
    window.removeEventListener(eventName, listener);
  };
}

export function useLocation() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => "");
  return getLocation(hash);
}

export function navigate(hash: string, replace = false) {
  const previous = window.location.hash;
  if (previous === hash) return;

  const state = {
    ...window.history.state,
    meridianPrevious: replace ? window.history.state?.meridianPrevious : previous,
  };
  const url = hash || window.location.pathname + window.location.search;
  if (replace) window.history.replaceState(state, "", url);
  else window.history.pushState(state, "", url);
  window.dispatchEvent(new Event(eventName));
}

export function backInApp(app: string, fallback = "") {
  const previous = window.history.state?.meridianPrevious;
  if (typeof previous === "string" && (previous === `#${app}` || previous.startsWith(`#${app}/`))) {
    window.history.back();
  } else {
    navigate(fallback ? `#${app}/${fallback}` : `#${app}`, true);
  }
}
