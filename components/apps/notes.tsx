"use client";

import { ArrowLeft, ChevronRight, NotebookPen } from "lucide-react";
import { useEffect, useRef } from "react";
import { notes } from "@/data/notes";
import type { AppProps } from "@/lib/workstation";
import { ArtifactSections, formatArtifactDate } from "./files";
import styles from "./productivity.module.css";

const sortedNotes = [...notes].sort((a, b) => b.modified.localeCompare(a.modified));

export function NotesApp({ view, go }: AppProps) {
  const [kind, id] = view.split("/");
  const note = kind === "note" ? notes.find((item) => item.id === id) : undefined;
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [note?.id]);

  return (
    <div className={`${styles.notes} ${note ? styles.withNote : ""}`}>
      <nav className={styles.noteSidebar} aria-label="Saved notes" data-workstation-scroll={!note ? "" : undefined}>
        <div className={styles.noteListTitle}>
          <h2>All Notes</h2>
          <span>{notes.length} notes</span>
        </div>
        <ul className={styles.noteList}>
          {sortedNotes.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={note?.id === item.id ? styles.activeNote : ""}
                aria-current={note?.id === item.id ? "page" : undefined}
                onClick={() => go(`note/${item.id}`)}
              >
                <strong>{item.title}</strong>
                <time dateTime={item.modified}>{formatArtifactDate(item.modified)}</time>
                <span>{item.summary}</span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.notePane} key={note?.id ?? "all"} data-workstation-scroll={note ? "" : undefined}>
        {note ? (
          <>
            <button type="button" className={styles.noteBack} onClick={() => go("")}>
              <ArrowLeft size={17} aria-hidden="true" /> All Notes
            </button>
            <article className={styles.noteSheet}>
              <time dateTime={note.modified}>{formatArtifactDate(note.modified)}</time>
              <h1 ref={heading} tabIndex={-1}>{note.title}</h1>
              <ArtifactSections sections={note.sections} />
            </article>
          </>
        ) : (
          <div className={styles.notePlaceholder}>
            <NotebookPen size={29} aria-hidden="true" />
            <p>Select a note to read it.</p>
          </div>
        )}
      </div>
    </div>
  );
}
