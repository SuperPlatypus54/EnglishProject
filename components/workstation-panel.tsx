"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronRight, Search, X } from "lucide-react";
import { documents } from "@/data/files";
import { searchableApps, searchWorkstation, type SearchEntry } from "@/lib/search";
import type { AppId } from "@/lib/workstation";
import { AppIcon } from "./app-icon";
import styles from "./workstation-panel.module.css";

export type PanelName = "search" | "notifications";

export interface Notice extends SearchEntry {
  id: string;
}

function ResultList({
  entries, onOpen,
}: {
  entries: readonly SearchEntry[];
  onOpen: (app: AppId, view: string) => void;
}) {
  return (
    <ul className={styles.list}>
      {entries.map((item) => (
        <li key={`${item.app}/${item.view}`}>
          <button type="button" onClick={() => onOpen(item.app, item.view)}>
            <AppIcon app={item.app} compact />
            <span><strong>{item.title}</strong><small>{item.detail}</small></span>
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}

export function WorkstationPanel({
  panel, notices, recentIds, onClose, onOpen,
}: {
  panel: PanelName;
  notices: readonly Notice[];
  recentIds: readonly string[];
  onClose: () => void;
  onOpen: (app: AppId, view: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const searching = panel === "search";
  const results = searching ? searchWorkstation(query) : [];
  const recentlyOpened = recentIds.slice(0, 5).flatMap<SearchEntry>((id) => {
    const document = documents.find((item) => item.id === id);
    return document ? [{ app: "files", view: `document/${id}`, title: document.name, detail: "Files" }] : [];
  });

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    input.current?.focus();
    return () => { element?.close(); };
  }, []);

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="workstation-panel-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          {searching ? <Search size={19} aria-hidden="true" /> : <Bell size={19} aria-hidden="true" />}
          <h2 id="workstation-panel-title">{searching ? "Search workstation" : "Notifications"}</h2>
          <button type="button" onClick={onClose} aria-label={searching ? "Close search" : "Close notifications"}><X size={20} aria-hidden="true" /></button>
        </header>
        {searching && (
          <div className={styles.search}>
            <label htmlFor="workstation-search" className="sr-only">Search apps, messages, and files</label>
            <input ref={input} id="workstation-search" type="search" placeholder="Search apps, messages, and files" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" />
          </div>
        )}
        <div className={styles.panelBody}>
          {searching ? query.trim() ? (
            <>
              <h3 role="status">{results.length ? `${results.length} ${results.length === 1 ? "result" : "results"}` : "No matching items"}</h3>
              <ResultList entries={results} onOpen={onOpen} />
            </>
          ) : (
            <>
              {recentlyOpened.length > 0 && (
                <>
                  <h3>Recent files</h3>
                  <ResultList entries={recentlyOpened} onOpen={onOpen} />
                </>
              )}
              <h3>Applications</h3>
              <ResultList entries={searchableApps} onOpen={onOpen} />
            </>
          ) : <ResultList entries={notices} onOpen={onOpen} />}
        </div>
      </div>
    </dialog>
  );
}
