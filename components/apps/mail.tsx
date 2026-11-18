"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, FilePenLine, Inbox, Mail, Search, Send, Trash2, X } from "lucide-react";
import { mailMessages, type MailFolder, type MailMessage } from "@/data/mail";
import type { AppProps } from "@/lib/workstation";
import styles from "./communications.module.css";

const folders = [
  { id: "inbox", name: "Inbox", icon: Inbox },
  { id: "sent", name: "Sent", icon: Send },
  { id: "drafts", name: "Drafts", icon: FilePenLine },
  { id: "trash", name: "Trash", icon: Trash2 },
] as const;

const fullDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const shortDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "short",
  day: "numeric",
});

function about(message: MailMessage) {
  return message.folder === "sent" || message.folder === "drafts" ? message.to : message.from;
}

export function MailApp({ view, go, back, readIds, markRead }: AppProps) {
  const [section, id] = view.split("/");
  const selected = section === "message" ? mailMessages.find((message) => message.id === id) : undefined;
  const folder: MailFolder = selected?.folder ?? folders.find((item) => item.id === id)?.id ?? "inbox";
  const folderName = folders.find((item) => item.id === folder)?.name ?? "Inbox";
  const [query, setQuery] = useState("");
  const listScroll = useRef<HTMLDivElement>(null);
  const messageHeading = useRef<HTMLHeadingElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const filter = query.trim().toLowerCase();

  useEffect(() => {
    if (selected?.unread && !readIds.includes(`mail:${selected.id}`)) {
      markRead(`mail:${selected.id}`);
    }
  }, [selected, markRead, readIds]);

  useLayoutEffect(() => {
    if (listScroll.current) listScroll.current.scrollTop = 0;
  }, [filter]);

  useEffect(() => {
    messageHeading.current?.focus({ preventScroll: true });
  }, [selected]);

  const unread = mailMessages.filter((message) => message.unread && !readIds.includes(`mail:${message.id}`)).length;
  const shown = mailMessages.filter((message) => filter
    ? [message.subject, message.from, message.to, message.fromAddress, message.toAddress, message.body]
        .some((part) => part.toLowerCase().includes(filter))
    : message.folder === folder);

  return (
    <div className={`${styles.app} ${styles.mailApp}`}>
      <header className={styles.mailTop}>
        <div className={styles.mailBrand}>
          <span className={styles.mailLogo}><Mail size={19} /></span>
          <span>Meridian Mail</span>
        </div>
        <div className={styles.mailSearch} role="search" aria-label="Search Meridian Mail">
          <Search size={17} />
          <input
            ref={searchInput}
            type="search"
            placeholder="Search mail"
            aria-label="Search mail"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              if (selected) go(`folder/${folder}`);
            }}
          />
          {query && (
            <button
              type="button"
              className={styles.clearSearch}
              onClick={() => { setQuery(""); searchInput.current?.focus(); }}
              aria-label="Clear mail search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </header>
      <div className={`${styles.mailBody} ${selected ? styles.mailReading : ""}`}>
        <nav className={styles.mailNav} aria-label="Mail folders">
          {folders.map(({ id: folderId, name, icon: Icon }) => (
            <button
              type="button"
              key={folderId}
              aria-current={folderId === folder && !filter ? "page" : undefined}
              className={styles.folderButton}
              onClick={() => {
                setQuery("");
                if (selected || folder !== folderId) go(`folder/${folderId}`);
              }}
            >
              <Icon size={17} />
              <span>{name}</span>
              {folderId === "inbox" && unread > 0 && <small>{unread}<span className="sr-only"> unread</span></small>}
            </button>
          ))}
        </nav>
        <div
          key={selected?.id ?? folder}
          ref={listScroll}
          className={styles.mailScroll}
          data-workstation-scroll
        >
          {selected ? (
            <article className={styles.message}>
              <button type="button" className={styles.messageBack} onClick={back}><ArrowLeft size={18} /> Back</button>
              <h2 ref={messageHeading} tabIndex={-1}>{selected.subject}</h2>
              {selected.folder === "drafts" && <span className={styles.draft}>Unsent draft</span>}
              <div className={styles.mailMeta}>
                <span className={styles.initial} aria-hidden="true">{selected.from.charAt(0)}</span>
                <div>
                  <p><strong>{selected.from}</strong> <span>&lt;{selected.fromAddress}&gt;</span></p>
                  <p>To {selected.to} <span>&lt;{selected.toAddress}&gt;</span></p>
                  <time dateTime={selected.date}>{fullDate.format(new Date(selected.date))}, {selected.time}</time>
                </div>
              </div>
              <div className={styles.mailText}>{selected.body}</div>
            </article>
          ) : (
            <>
              <header className={styles.mailListHead}>
                <h2>{filter ? "Search results" : folderName}</h2>
                <p aria-live="polite">{shown.length} {shown.length === 1 ? "message" : "messages"}</p>
              </header>
              {shown.length > 0 ? (
                <ul className={styles.mailList}>
                  {shown.map((message) => {
                    const isUnread = message.unread && !readIds.includes(`mail:${message.id}`);
                    return (
                      <li key={message.id}>
                        <button
                          type="button"
                          className={styles.mailRow}
                          data-unread={isUnread || undefined}
                          onClick={() => go(`message/${message.id}`)}
                        >
                          <span className={styles.mailRowIdentity}>
                            {isUnread && <span className={styles.mailDot}><span className="sr-only">Unread </span></span>}
                            {message.folder === "drafts" ? "Draft to " : message.folder === "sent" ? "To " : ""}{about(message)}
                          </span>
                          <span className={styles.mailRowDate}>
                            <time dateTime={message.date}>{shortDate.format(new Date(message.date))}</time>
                            {filter && <small>{folders.find((item) => item.id === message.folder)?.name}</small>}
                          </span>
                          <strong className={styles.mailRowSubject}>{message.subject}</strong>
                          <span className={styles.mailRowPreview}>{message.body.replaceAll(/\s+/g, " ")}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className={styles.mailEmpty}>{filter ? "No results. Try another keyword." : "This folder is empty."}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
