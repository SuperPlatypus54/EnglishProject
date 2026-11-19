"use client";

import { useEffect, useRef } from "react";
import { ArrowDownToLine, ArrowLeft, ChevronRight, Heart, Ruler, UserRound } from "lucide-react";
import { heartlineProfiles, heartlineThreads, type HeartlineProfile } from "@/data/heartline";
import type { AppProps } from "@/lib/workstation";
import styles from "./communications.module.css";

const dateLabel = new Intl.DateTimeFormat("en-US", {
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

const profilesById = new Map(heartlineProfiles.map((profile) => [profile.id, profile]));
const james = heartlineProfiles[0];

function Avatar({ profile, large = false }: { profile: HeartlineProfile; large?: boolean }) {
  const initials = profile.name.split(" ").map((word) => word[0]).join("");

  return (
    <span
      aria-hidden="true"
      className={`${styles.avatar} ${styles[profile.avatarColor]} ${large ? styles.avatarLarge : ""}`}
    >
      <span>{initials}</span>
    </span>
  );
}

export function HeartlineApp({ view, go, back, readIds, markRead }: AppProps) {
  const [section, id] = view.split("/");
  const thread = section === "thread" ? heartlineThreads.find((item) => item.id === id) : undefined;
  const profile = section === "profile" ? profilesById.get(id) : undefined;
  const match = thread ? profilesById.get(thread.personId) : undefined;
  const latestThread = heartlineThreads[0];
  const latestMatch = profilesById.get(latestThread.personId);
  const threadScroll = useRef<HTMLDivElement>(null);
  const detailHeading = useRef<HTMLElement>(null);

  useEffect(() => {
    if (thread?.unread && !readIds.includes(`heartline:${thread.id}`)) {
      markRead(`heartline:${thread.id}`);
    }
  }, [markRead, readIds, thread]);

  useEffect(() => {
    detailHeading.current?.focus({ preventScroll: true });
  }, [profile, thread]);

  return (
    <div className={`${styles.app} ${styles.heartline}`}>
      <header className={styles.heartTop}>
        {view ? <button className={styles.heartBrand} onClick={() => go("")} type="button" aria-label="Heartline matches">
          <span className={styles.heartLogo}><Heart size={20} fill="currentColor" /></span>
          Heartline
        </button> : <span className={styles.heartBrand}>
          <span className={styles.heartLogo}><Heart size={20} fill="currentColor" /></span>
          Heartline
        </span>}
        <button
          type="button"
          aria-pressed={profile?.id === james.id}
          className={styles.profileButton}
          onClick={() => go(profile?.id === james.id ? "" : "profile/james")}
        >
          <UserRound size={17} /> My profile
        </button>
      </header>
      <div className={`${styles.heartBody} ${thread || profile ? styles.showDetail : ""}`}>
        <section className={styles.matchList} aria-label="Match conversations" data-workstation-scroll>
          <div className={styles.matchHeading}>
            <h2>Matches</h2>
            <p>{heartlineThreads.length} {heartlineThreads.length === 1 ? "conversation" : "conversations"}</p>
          </div>
          {heartlineThreads.map((item) => {
            const person = profilesById.get(item.personId);
            if (!person) return null;
            const unread = item.unread && !readIds.includes(`heartline:${item.id}`);
            return (
              <button
                key={item.id}
                type="button"
                className={styles.matchRow}
                data-active={thread?.id === item.id}
                onClick={() => thread?.id !== item.id && go(`thread/${item.id}`)}
              >
                <Avatar profile={person} />
                <span className={styles.matchSummary}>
                  <strong>{person.name}{unread && <span className={styles.heartDot}><span className="sr-only"> Unread</span></span>}</strong>
                  <span>{item.preview}</span>
                </span>
                <time dateTime={item.date}>{shortDate.format(new Date(item.date))}</time>
              </button>
            );
          })}
        </section>
        <section className={styles.heartDetail} aria-label={match ? `Conversation with ${match.name}` : profile ? `${profile.name}'s profile` : "Featured conversation"}>
          {thread && match ? (
            <>
              <header className={styles.threadHead} ref={detailHeading} tabIndex={-1}>
                <button type="button" className={styles.iconButton} onClick={back} aria-label="Back"><ArrowLeft size={20} /></button>
                <button type="button" className={styles.threadPerson} onClick={() => go(`profile/${match.id}`)}>
                  <Avatar profile={match} />
                  <span><strong>{match.name}</strong><small>View profile</small></span>
                </button>
                <button
                  type="button"
                  className={`${styles.iconButton} ${styles.latestButton}`}
                  onClick={() => threadScroll.current?.scrollTo({ top: threadScroll.current.scrollHeight })}
                  aria-label="Jump to latest message"
                  title="Jump to latest message"
                >
                  <ArrowDownToLine size={18} />
                </button>
              </header>
              <div
                key={thread.id}
                ref={threadScroll}
                className={styles.threadScroll}
                data-workstation-scroll
              >
                <div className={styles.threadInner}>
                  <p className={styles.threadDate}>{dateLabel.format(new Date(thread.date))}</p>
                  <ol className={styles.bubbles}>
                    {thread.messages.map((message, index) => (
                      <li
                        key={`${thread.id}-${index}`}
                        className={styles.bubbleRow}
                        data-sender={message.sender}
                      >
                        <p className={styles.bubble}><span className="sr-only">{message.sender === "james" ? james.name : match.name}: </span>{message.text}</p>
                        <span className={styles.bubbleTime}>{message.time}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          ) : profile ? (
            <>
              <header className={styles.threadHead} ref={detailHeading} tabIndex={-1}>
                <button type="button" className={styles.iconButton} aria-label="Back" onClick={back}><ArrowLeft size={20} /></button>
                <strong>{profile.id === james.id ? "My profile" : "Match profile"}</strong>
              </header>
              <div key={profile.id} className={styles.profileScroll} data-workstation-scroll>
                <article className={styles.profileCard}>
                  <Avatar profile={profile} large />
                  <h2>{profile.name}, {profile.age}</h2>
                  <div className={styles.profileMeta}>
                    {profile.occupation && <span>{profile.occupation}</span>}
                    {profile.height && <span><Ruler size={15} /> {profile.height}</span>}
                  </div>
                  <p className={styles.profileBio}>{profile.bio}</p>
                  <h3>Interests</h3>
                  <ul className={styles.interests}>
                    {profile.interests.map((interest) => <li key={interest}>{interest}</li>)}
                  </ul>
                </article>
              </div>
            </>
          ) : latestMatch && (
            <div className={styles.heartFeature}>
              <button className={styles.featureCard} type="button" onClick={() => go(`thread/${latestThread.id}`)}>
                <Avatar profile={latestMatch} large />
                <span className={styles.featureText}>
                  <small>Latest conversation</small>
                  <strong>{latestMatch.name}</strong>
                  <span>{latestThread.preview}</span>
                </span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
