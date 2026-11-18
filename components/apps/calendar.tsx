"use client";

import {
  ArrowLeft, Bell, CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin,
} from "lucide-react";
import { useState } from "react";
import { calendarEvents, formatEventTime, snapshotDate } from "@/data/calendar";
import type { CalendarRecord } from "@/data/calendar";
import type { AppProps } from "@/lib/workstation";
import styles from "./calendar.module.css";

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

function asDate(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: string, days: number) {
  const result = asDate(date);
  result.setUTCDate(result.getUTCDate() + days);
  return dateKey(result);
}

function dateLabel(date: string, format: Intl.DateTimeFormatOptions) {
  return asDate(date).toLocaleDateString("en-US", { ...format, timeZone: "UTC" });
}

function longDate(date: string) {
  return dateLabel(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function weekStart(date: string) {
  return addDays(date, -(asDate(date).getUTCDay() + 6) % 7);
}

function dateFromPath(date?: string) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return snapshotDate;
  const parsed = asDate(date);
  return Number.isFinite(parsed.getTime()) && date === dateKey(parsed) ? date : snapshotDate;
}

function eventsOn(date: string) {
  return calendarEvents
    .filter((event) => event.date === date)
    .sort((first, second) => first.time.localeCompare(second.time));
}

interface MonthPickerProps {
  selected: string;
  onSelect: (date: string) => void;
}

function MonthPicker({ selected, onSelect }: MonthPickerProps) {
  const [month, setMonth] = useState(selected.slice(0, 7));
  const firstDay = `${month}-01`;
  const start = weekStart(firstDay);
  const days = Array.from({ length: 42 }, (_, index) => addDays(start, index));

  function switchMonth(direction: number) {
    const next = asDate(firstDay);
    next.setUTCMonth(next.getUTCMonth() + direction);
    setMonth(dateKey(next).slice(0, 7));
  }

  return (
    <section className={styles.month} aria-label="Calendar month picker">
      <div className={styles.monthHeading}>
        <h2>{dateLabel(firstDay, { month: "long", year: "numeric" })}</h2>
        <div className={styles.monthControls}>
          <button type="button" aria-label="Previous month" onClick={() => switchMonth(-1)}><ChevronLeft size={17} /></button>
          <button type="button" aria-label="Next month" onClick={() => switchMonth(1)}><ChevronRight size={17} /></button>
        </div>
      </div>
      <div className={styles.monthGrid}>
        {weekDays.map((day, index) => <span className={styles.weekday} key={index} aria-hidden="true">{day}</span>)}
        {days.map((day) => {
          const count = eventsOn(day).length;
          return (
            <button
              type="button"
              key={day}
              className={styles.monthDay}
              data-other-month={day.slice(0, 7) !== month || undefined}
              aria-pressed={day === selected}
              aria-label={`${longDate(day)}${count ? `, ${count} ${count === 1 ? "event" : "events"}` : ""}`}
              onClick={() => onSelect(day)}
            >
              {Number(day.slice(-2))}
              {count > 0 && <span aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function EventCard({ event, onClick }: { event: CalendarRecord; onClick: () => void }) {
  return (
    <button
      type="button"
      className={styles.eventCard}
      data-category={event.category}
      data-priority={event.priority || undefined}
      onClick={onClick}
    >
      <time dateTime={`${event.date}T${event.time}`}>{formatEventTime(event.time)}</time>
      <span>
        <strong>{event.title}</strong>
        {event.location && <small>{event.location}</small>}
      </span>
      <ChevronRight className={styles.eventArrow} size={16} aria-hidden="true" />
    </button>
  );
}

function DailyAgenda({ date, openEvent }: { date: string; openEvent: (id: string) => void }) {
  const events = eventsOn(date);
  return (
    <section className={styles.dayAgenda}>
      <div className={styles.agendaHeading}>
        <h2>{dateLabel(date, { weekday: "long", month: "long", day: "numeric" })}</h2>
        <span>{events.length} {events.length === 1 ? "event" : "events"}</span>
      </div>
      {events.length ? <div className={styles.dayEvents}>
        {events.map((event) => <EventCard key={event.id} event={event} onClick={() => openEvent(event.id)} />)}
      </div> : <p className={styles.empty}>Nothing scheduled.</p>}
    </section>
  );
}

function WeekAgenda({ date, openEvent, openDay }: {
  date: string; openEvent: (id: string) => void; openDay: (date: string) => void;
}) {
  const start = weekStart(date);
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index));
  return (
    <section className={styles.weekAgenda} aria-label="Week schedule">
      {days.map((day) => {
        const events = eventsOn(day);
        return (
          <div className={styles.weekDay} key={day} data-today={day === snapshotDate || undefined}>
            <button type="button" className={styles.weekDayLink} onClick={() => openDay(day)}>
              <span>{dateLabel(day, { weekday: "short" })}</span> <strong>{Number(day.slice(-2))}</strong>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
            {events.length ? <div className={styles.weekEvents}>
              {events.map((event) => <EventCard key={event.id} event={event} onClick={() => openEvent(event.id)} />)}
            </div> : <p className={styles.empty}>No events</p>}
          </div>
        );
      })}
    </section>
  );
}

function EventDetails({ event, go }: { event: CalendarRecord; go: AppProps["go"] }) {
  return (
    <article className={styles.details} data-priority={event.priority || undefined}>
      <p className={styles.category} data-category={event.category}>{event.category}</p>
      <h2>{event.title}</h2>
      <div className={styles.detailInfo}>
        <span><Clock3 size={18} aria-hidden="true" />{longDate(event.date)} at {formatEventTime(event.time)}</span>
        {event.location && <span><MapPin size={18} aria-hidden="true" />{event.location}</span>}
        {event.priority && <span className={styles.priority}><Bell size={18} aria-hidden="true" />Required attendance</span>}
      </div>
      {event.description && <p className={styles.description}>{event.description}</p>}
      <button type="button" className={styles.ghostButton} onClick={() => go(`day/${event.date}`)}>
        <CalendarDays size={17} aria-hidden="true" /> View day
      </button>
    </article>
  );
}

export function CalendarApp({ view, go, back }: AppProps) {
  const [monthVisible, setMonthVisible] = useState(false);
  const [kind, id] = view.split("/");
  const event = kind === "event" ? calendarEvents.find((entry) => entry.id === id) : undefined;
  const mode = kind === "week" ? "week" : "day";
  const date = event?.date ?? dateFromPath(id);
  const firstDay = weekStart(date);

  function openDate(next: string, nextMode = mode) {
    if (view !== `${nextMode}/${next}` && !(view === "" && nextMode === "day" && next === snapshotDate)) {
      go(`${nextMode}/${next}`);
    }
    setMonthVisible(false);
  }

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <div className={styles.appIdentity}><CalendarDays size={20} aria-hidden="true" /><span>James Bond</span></div>
        <div className={styles.segmented} aria-label="Calendar view">
          <button type="button" aria-pressed={mode === "day" && !event} onClick={() => openDate(date, "day")}>Day</button>
          <button type="button" aria-pressed={mode === "week" && !event} onClick={() => openDate(date, "week")}>Week</button>
        </div>
      </header>
      <div data-workstation-scroll className={styles.scroll}>
        <div className={styles.layout}>
          <div className={styles.controls}>
            <div className={styles.toolbar}>
              {event ? (
                <button type="button" className={styles.ghostButton} onClick={back}><ArrowLeft size={16} aria-hidden="true" /> Back</button>
              ) : (
                <>
                  <div className={styles.dateNavigation}>
                    <div className={styles.dateNavButtons}>
                      <button type="button" aria-label={`Previous ${mode}`} onClick={() => openDate(addDays(date, mode === "week" ? -7 : -1))}><ChevronLeft size={19} /></button>
                      <button type="button" aria-label={`Next ${mode}`} onClick={() => openDate(addDays(date, mode === "week" ? 7 : 1))}><ChevronRight size={19} /></button>
                    </div>
                    <button type="button" className={styles.todayButton} onClick={() => openDate(snapshotDate)}>Today</button>
                  </div>
                  <p className={styles.dateTitle}>
                    {mode === "week"
                      ? `${dateLabel(firstDay, { month: "short", day: "numeric" })} to ${dateLabel(addDays(firstDay, 6), { month: "short", day: "numeric" })}`
                      : dateLabel(date, { month: "long", year: "numeric" })}
                  </p>
                  <button
                    type="button"
                    className={styles.monthToggle}
                    aria-label="Month picker"
                    aria-expanded={monthVisible}
                    aria-controls="calendar-month-picker"
                    onClick={() => setMonthVisible((visible) => !visible)}
                  >
                    <CalendarDays size={19} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
          </div>
          <aside className={styles.sidebar} data-visible={monthVisible && !event} id="calendar-month-picker">
            <MonthPicker key={date} selected={date} onSelect={openDate} />
          </aside>
          <div className={styles.main}>
            {event ? <EventDetails event={event} go={go} /> : mode === "week" ? (
              <WeekAgenda date={date} openDay={(day) => openDate(day, "day")} openEvent={(eventId) => go(`event/${eventId}`)} />
            ) : (
              <DailyAgenda date={date} openEvent={(eventId) => go(`event/${eventId}`)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
