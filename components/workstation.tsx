"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import { Bell, ChevronRight, FileText, House, Maximize2, Minimize2, Minus, Search, X } from "lucide-react";
import { appDirectory } from "@/lib/app-directory";
import { appIds, type AppId, type AppProps } from "@/lib/workstation";
import { navigate, backInApp, useLocation } from "@/lib/use-location";
import { useProgress } from "@/lib/use-progress";
import { documents } from "@/data/files";
import { mailMessages } from "@/data/mail";
import { heartlineThreads } from "@/data/heartline";
import { AppIcon } from "./app-icon";
import { WorkstationPanel, type PanelName, type Notice } from "./workstation-panel";
import styles from "./workstation.module.css";

function LoadingApp() {
  return <p className={styles.loading} role="status">Opening application…</p>;
}

const applications = {
  heartline: dynamic<AppProps>(() => import("./apps/heartline").then((mod) => mod.HeartlineApp), { loading: LoadingApp }),
  mail: dynamic<AppProps>(() => import("./apps/mail").then((mod) => mod.MailApp), { loading: LoadingApp }),
  analytics: dynamic<AppProps>(() => import("./apps/analytics").then((mod) => mod.AnalyticsApp), { loading: LoadingApp }),
  files: dynamic<AppProps>(() => import("./apps/files").then((mod) => mod.FilesApp), { loading: LoadingApp }),
  calendar: dynamic<AppProps>(() => import("./apps/calendar").then((mod) => mod.CalendarApp), { loading: LoadingApp }),
  notes: dynamic<AppProps>(() => import("./apps/notes").then((mod) => mod.NotesApp), { loading: LoadingApp }),
};

function MeridianMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M4 24V8l9 6v10m6 0V14l9-6v16M4 24h24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Brand() {
  return (
    <span className={styles.brand}>
      <span className={styles.brandMark}><MeridianMark /></span>
      <span>MeridianOS</span>
    </span>
  );
}

function WorkstationClock() {
  return (
    <time dateTime="2026-11-18T23:48:00" className={styles.clock} aria-label="Wednesday, November 18, 2026 at 11:48 PM">
      <span>Wed, Nov 18</span>
      <span>11:48 PM</span>
    </time>
  );
}

function Window({
  app, view, maximized, positions, onToggleMaximize, onHome, onMinimize, children,
}: {
  app: AppId;
  view: string;
  maximized: boolean;
  positions: RefObject<Map<string, number[]>>;
  onToggleMaximize: () => void;
  onHome: () => void;
  onMinimize: () => void;
  children: ReactNode;
}) {
  const title = useRef<HTMLHeadingElement>(null);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    title.current?.focus({ preventScroll: true });
  }, [app]);

  useLayoutEffect(() => {
    const content = body.current;
    if (!content) return;

    const key = `${app}/${view}`;
    const saved = positions.current;
    const active = new WeakSet<HTMLElement>();
    let scrollers: HTMLElement[] = [];
    function restore() {
      scrollers = Array.from(content!.querySelectorAll<HTMLElement>("[data-workstation-scroll]"));
      const previous = saved.get(key);
      scrollers.forEach((element, index) => {
        if (active.has(element)) return;
        element.scrollTop = previous?.[index] ?? 0;
        active.add(element);
      });
    }
    function savePosition(event: Event) {
      if (event.target instanceof HTMLElement && active.has(event.target)) {
        saved.set(key, scrollers.map((element) => element.scrollTop));
      }
    }

    restore();
    const observer = new MutationObserver(restore);
    observer.observe(content, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-workstation-scroll"] });
    content.addEventListener("scroll", savePosition, true);
    return () => {
      observer.disconnect();
      content.removeEventListener("scroll", savePosition, true);
    };
  }, [app, view, positions]);

  return (
    <m.main
      aria-labelledby="app-window-title"
      className={styles.window}
      data-maximized={maximized}
      initial={{ opacity: 0, scale: 0.984, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.19, ease: "easeOut" }}
    >
      <header className={styles.titlebar}>
        <button className={styles.mobileHome} type="button" aria-label="Workstation Home" onClick={onHome}>
          <House size={17} aria-hidden="true" /> Home
        </button>
        <div className={styles.windowIdentity}>
          <AppIcon app={app} compact />
          <h2 id="app-window-title" tabIndex={-1} ref={title}>{appDirectory[app].name}</h2>
        </div>
        <div className={styles.windowControls}>
          <button type="button" aria-label="Minimize window" title="Minimize" onClick={onMinimize}><Minus size={16} /></button>
          <button type="button" aria-label={maximized ? "Restore window" : "Maximize window"} title={maximized ? "Restore" : "Maximize"} onClick={onToggleMaximize}>
            {maximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button type="button" aria-label="Close window" title="Close" onClick={onHome}><X size={17} /></button>
        </div>
      </header>
      <div className={styles.windowBody} ref={body}>{children}</div>
    </m.main>
  );
}

function Desktop({
  activeApp, unreadMail, unreadHeartline, notices, recentIds, openApp, openPanel,
}: {
  activeApp: AppId | null;
  unreadMail: number;
  unreadHeartline: number;
  notices: readonly Notice[];
  recentIds: readonly string[];
  openApp: (app: AppId, view?: string) => void;
  openPanel: (panel: PanelName) => void;
}) {
  const recents = recentIds.slice(0, 3).flatMap((id) => documents.find((document) => document.id === id) ?? []);
  const badges = { heartline: unreadHeartline, mail: unreadMail };

  return (
    <main className={styles.desktop} inert={!!activeApp} aria-hidden={activeApp ? true : undefined}>
      <div className={styles.launcher}>
        <div className={styles.homeIdentity}>
          <p><span className={styles.statusDot} /> JAMES-WORKSTATION</p>
          <h1>James Bond</h1>
          <span>The Grand Meridian</span>
        </div>
        <nav className={styles.appGrid} aria-label="Applications">
          {appIds.map((app) => {
            const unread = app === "mail" || app === "heartline" ? badges[app] : 0;
            return (
              <button type="button" className={styles.appTile} key={app} onClick={() => openApp(app)}>
                <span className={styles.tileIcon}>
                  <AppIcon app={app} />
                  {unread > 0 && <span className={styles.appBadge} aria-label={`${unread} unread`}>{unread}</span>}
                </span>
                <span>{appDirectory[app].name}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <aside className={styles.desktopSidebar}>
        <div className={styles.widget}>
          <h2><Bell size={16} aria-hidden="true" /> Notifications</h2>
          {notices.map((item) => (
            <button key={item.id} type="button" className={styles.widgetItem} onClick={() => openApp(item.app, item.view)}>
              <AppIcon app={item.app} compact />
              <span><strong>{item.title}</strong><small>{item.detail}</small></span>
              <ChevronRight size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
        {recents.length > 0 && (
          <div className={styles.widget}>
            <h2><FileText size={16} aria-hidden="true" /> Recent files</h2>
            {recents.map((document) => (
              <button key={document.id} type="button" className={styles.widgetItem} onClick={() => openApp("files", `document/${document.id}`)}>
                <span className={styles.recentIcon}><FileText size={17} aria-hidden="true" /></span>
                <span><strong>{document.name}</strong></span>
                <ChevronRight size={15} aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </aside>
      <nav className={styles.mobileTools} aria-label="Workstation tools">
        <button type="button" onClick={() => openPanel("search")}><Search size={18} aria-hidden="true" /> Search</button>
        <button type="button" onClick={() => openPanel("notifications")}><Bell size={18} aria-hidden="true" /> Notifications {notices.length > 0 && <span>{notices.length}</span>}</button>
      </nav>
    </main>
  );
}

export function Workstation() {
  const location = useLocation();
  const progress = useProgress();
  const [panel, setPanel] = useState<PanelName | null>(null);
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState<Partial<Record<AppId, string>>>({});
  const positions = useRef(new Map<string, number[]>());

  const activeApp = location.screen === "app" ? location.app : null;
  const unreadMessages = mailMessages.filter((message) => message.unread && !progress.readIds.includes(`mail:${message.id}`));
  const unreadHeartline = heartlineThreads.filter((thread) => thread.unread && !progress.readIds.includes(`heartline:${thread.id}`)).length;
  const notices: Notice[] = [];

  if (unreadMessages.length) notices.push({
    id: "mail", title: `${unreadMessages.length} unread ${unreadMessages.length === 1 ? "email" : "emails"}`,
    detail: "Meridian Mail", app: "mail", view: "",
  });

  if (unreadHeartline) notices.push({
    id: "heartline", title: "Sydney", detail: "New Heartline messages", app: "heartline", view: "thread/sydney",
  });

  notices.push({
    id: "calendar", title: "Performance review", detail: "Tomorrow at 9:00 AM", app: "calendar", view: "event/performance-meeting",
  });

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPanel("search");
      }
    }
    function closePanel() {
      setPanel(null);
    }
    window.addEventListener("keydown", handleKey);
    window.addEventListener("popstate", closePanel);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("popstate", closePanel);
    };
  }, []);

  function openApp(app: AppId, view = "") {
    setPanel(null);
    navigate(view ? `#${app}/${view}` : `#${app}`);
  }

  function goHome() {
    navigate("");
  }

  function minimizeApp(app: AppId, view: string) {
    setMinimized((value) => ({ ...value, [app]: view }));
    goHome();
  }

  function closeApp(app: AppId) {
    setMinimized((value) => {
      const remaining = { ...value };
      delete remaining[app];
      return remaining;
    });
    goHome();
  }

  function innerBack(app: AppId, view: string) {
    let fallback = "";
    if (app === "mail" && view.startsWith("message/")) {
      const message = mailMessages.find((item) => item.id === view.slice("message/".length));
      if (message && message.folder !== "inbox") fallback = `folder/${message.folder}`;
    }
    if (app === "files" && view.startsWith("document/")) {
      const document = documents.find((item) => item.id === view.slice("document/".length));
      if (document) fallback = `folder/${document.folder}`;
    }
    backInApp(app, fallback);
  }

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <div className={styles.workspace} data-window={!!activeApp}>
          <header className={styles.systemBar}>
            <button type="button" className={styles.brandButton} onClick={goHome} aria-label="MeridianOS home"><Brand /></button>
            <div className={styles.systemActions}>
              <button type="button" aria-label="Search workstation" title="Search (Ctrl or Command + K)" onClick={() => setPanel("search")}><Search size={19} /></button>
              <button type="button" className={styles.notificationButton} aria-label={`Notifications, ${notices.length} items`} title="Notifications" onClick={() => setPanel("notifications")}>
                <Bell size={19} />{notices.length > 0 && <span />}
              </button>
            </div>
            <WorkstationClock />
          </header>
          <Desktop activeApp={activeApp} unreadMail={unreadMessages.length} unreadHeartline={unreadHeartline} notices={notices} recentIds={progress.recentIds} openApp={openApp} openPanel={setPanel} />
          {location.screen === "app" && (() => {
            const { app, view } = location;
            const Application = applications[app];
            return (
              <Window key={app} app={app} view={view} maximized={maximized} positions={positions} onToggleMaximize={() => setMaximized((value) => !value)} onHome={() => closeApp(app)} onMinimize={() => minimizeApp(app, view)}>
                <Application {...progress} view={view} go={(nextView) => openApp(app, nextView)} back={() => innerBack(app, view)} />
              </Window>
            );
          })()}
          <nav className={styles.dock} aria-label="Application dock">
            <button className={styles.dockHome} type="button" aria-label="Home" title="Home" onClick={goHome}><House size={20} aria-hidden="true" /></button>
            <span className={styles.dockDivider} />
            {appIds.map((app) => {
              const active = activeApp === app;
              return (
                <button key={app} type="button" aria-label={appDirectory[app].name} aria-current={active ? "page" : undefined} title={appDirectory[app].name} onClick={() => {
                  if (active && location.screen === "app") minimizeApp(app, location.view);
                  else openApp(app, minimized[app]);
                }}>
                  <AppIcon app={app} compact />
                </button>
              );
            })}
          </nav>
          {panel && (
            <WorkstationPanel
              key={panel} panel={panel} notices={notices} recentIds={progress.recentIds}
              onClose={() => setPanel(null)} onOpen={openApp}
            />
          )}
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
