"use client";

import {
  ArrowDown, ArrowUpRight, BarChart3, Building2, CircleAlert, Search, Users,
} from "lucide-react";
import { useState } from "react";
import {
  branchReport, branchTeam, employeeSales, salesMonths,
} from "@/data/sales";
import type { AppProps } from "@/lib/workstation";
import styles from "./analytics.module.css";

const dollars = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 0,
});

const sections = [
  { id: "", title: "My performance", icon: BarChart3 },
  { id: "team", title: "Team", icon: Users },
  { id: "branch", title: "Branch", icon: Building2 },
];

const rankings = [...branchTeam].sort((first, second) => second.sales - first.sales);
const employeeRank = rankings.findIndex((record) => record.name === employeeSales.name) + 1;

function percentage(actual: number, target: number) {
  return `${((actual / target) * 100).toFixed(1)}%`;
}

function SalesTrend() {
  const [period, setPeriod] = useState(6);
  const [selectedMonth, setSelectedMonth] = useState(salesMonths.at(-1)?.month);
  const months = salesMonths.slice(-period);
  const selected = months.find((month) => month.month === selectedMonth) ?? months.at(-1)!;

  return (
    <section className={styles.card} aria-labelledby="sales-trend-title">
      <div className={styles.chartHeading}>
        <div>
          <h2 id="sales-trend-title">Sales history</h2>
          <p>Closed sales by month</p>
        </div>
        <label className={styles.rangeControl}>
          <span>Sales period</span>
          <select value={period} onChange={(event) => setPeriod(Number(event.target.value))}>
            <option value={6}>Last 6 months</option>
            <option value={3}>Last 3 months</option>
          </select>
        </label>
      </div>

      <div className={styles.chartSelection} aria-live="polite">
        <strong>{dollars.format(selected.sales)}</strong>
        <span>{selected.month}{selected.monthToDate ? " month to date" : ""}</span>
      </div>

      <div className={styles.chart}>
        <div className={styles.axis} aria-hidden="true">
          <span>$50k</span><span>$40k</span><span>$30k</span>
          <span>$20k</span><span>$10k</span><span>$0</span>
        </div>
        <div className={styles.plot} style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}>
          {months.map((month) => (
            <button
              type="button"
              key={month.month}
              className={styles.barButton}
              onClick={() => setSelectedMonth(month.month)}
              aria-pressed={month.month === selected.month}
              aria-label={`${month.month}${month.monthToDate ? " month to date" : ""}, ${dollars.format(month.sales)}`}
            >
              <span className={styles.bar} style={{ height: `${month.sales / employeeSales.target * 100}%` }} />
              <span className={styles.barLabel}>{month.shortLabel}{month.monthToDate && <small>MTD</small>}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chartFooter}>
        <span className={styles.key}><span className={styles.keyLine} /> Monthly target {dollars.format(employeeSales.target)}</span>
        <span>November through Nov 18</span>
      </div>
    </section>
  );
}

interface Metric {
  label: string;
  value: string;
  caption: string;
}

function Metrics({ metrics }: { metrics: readonly Metric[] }) {
  return (
    <dl className={styles.metrics}>
      {metrics.map((metric) => (
        <div className={styles.metric} key={metric.label}>
          <dt>{metric.label}</dt>
          <dd>{metric.value}<small>{metric.caption}</small></dd>
        </div>
      ))}
    </dl>
  );
}

function EmployeeOverview() {
  const attainment = percentage(employeeSales.actual, employeeSales.target);
  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <div>
          <p className={styles.context}>November 2026 · Month to date</p>
          <h1>Sales performance</h1>
          <p className={styles.subheading}>Activity through November 18, 2026</p>
        </div>
        <div className={styles.employeeBadge}>
          <span className={styles.initials}>JB</span>
          <span><strong>{employeeSales.name}</strong><small>{employeeSales.role}</small></span>
        </div>
      </div>
      <Metrics metrics={[
        { label: "Monthly sales", value: dollars.format(employeeSales.actual), caption: "November month to date" },
        { label: "Quota attainment", value: attainment, caption: `Target ${dollars.format(employeeSales.target)}` },
        { label: "Deals closed", value: String(employeeSales.closed), caption: `of ${employeeSales.assigned} assigned` },
        { label: "Branch ranking", value: `${employeeRank} of ${rankings.length}`, caption: "By November sales" },
      ]} />
      <div className={styles.overviewGrid}>
        <SalesTrend />
        <section className={styles.card} aria-labelledby="employee-title">
          <h2 id="employee-title">Employee record</h2>
          <dl className={styles.record}>
            <div><dt>Employee</dt><dd>{employeeSales.name}</dd></div>
            <div><dt>Role</dt><dd>{employeeSales.role}</dd></div>
            <div><dt>Employer</dt><dd>Apex Sales Group</dd></div>
            <div><dt>Branch</dt><dd>{employeeSales.branch}</dd></div>
            <div><dt>Manager</dt><dd>{employeeSales.manager}</dd></div>
            <div><dt>Employment status</dt><dd><span className={styles.activeStatus}>{employeeSales.status}</span></dd></div>
            <div><dt>Quarterly performance</dt><dd>{employeeSales.quarterRating}</dd></div>
          </dl>
          <div className={styles.warning}>
            <CircleAlert size={19} aria-hidden="true" />
            <div><strong>Human Resources</strong><p>Performance improvement review pending.</p></div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Leaderboard() {
  const [query, setQuery] = useState("");
  const team = rankings.map((record, index) => ({ ...record, rank: index + 1 }));
  const visible = team.filter((record) => record.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <div>
          <p className={styles.context}>{employeeSales.branch}</p>
          <h1>Team leaderboard</h1>
          <p className={styles.subheading}>November sales through Nov 18</p>
        </div>
      </div>
      <section className={styles.teamCard} aria-label="November sales leaderboard">
        <div className={styles.tableToolbar}>
          <p>{visible.length} of {team.length} employees</p>
          <label className={styles.search}>
            <Search aria-hidden="true" size={17} />
            <input type="search" aria-label="Find an employee" placeholder="Find an employee" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
        </div>
        {visible.length ? (
          <table className={styles.leaderboard}>
            <thead><tr><th scope="col">Rank</th><th scope="col">Employee</th><th scope="col" aria-sort="descending">Sales <ArrowDown size={14} aria-hidden="true" /></th></tr></thead>
            <tbody>
              {visible.map((record) => (
                <tr key={record.name} className={record.name === employeeSales.name ? styles.myRow : undefined}>
                  <td>{record.rank}</td>
                  <th scope="row">{record.name}{record.name === employeeSales.name && <span>You</span>}</th>
                  <td>{dollars.format(record.sales)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className={styles.empty}>No employees found.</p>}
      </section>
    </div>
  );
}

function BranchOverview() {
  const novemberPace = Math.round(branchReport.target * 18 / 30);
  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <div>
          <p className={styles.context}>Branch summary · November 2026</p>
          <h1>{employeeSales.branch}</h1>
          <p className={styles.subheading}>Branch manager Andrew Tate</p>
        </div>
      </div>
      <Metrics metrics={[
        { label: "November sales", value: dollars.format(branchReport.actual), caption: `As of ${branchReport.date}` },
        { label: "Monthly branch quota", value: dollars.format(branchReport.target), caption: `${branchTeam.length} sales associates` },
        { label: "Quota attainment", value: percentage(branchReport.actual, branchReport.target), caption: "November month to date" },
        { label: "Behind target pace", value: dollars.format(novemberPace - branchReport.actual), caption: "Based on elapsed calendar days" },
      ]} />
      <div className={styles.overviewGrid}>
        <section className={styles.card} aria-labelledby="quota-title">
          <h2 id="quota-title">Quota tracking</h2>
          <div className={styles.quota}>
            <label htmlFor="quota-nov">November <small>Month to date</small></label>
            <strong>{percentage(branchReport.actual, branchReport.target)}</strong>
            <progress id="quota-nov" max={branchReport.target} value={branchReport.actual} />
          </div>
          <div className={styles.quota}>
            <label htmlFor="quota-oct">October <small>Final</small></label>
            <strong>{percentage(branchReport.previousActual, branchReport.previousTarget)}</strong>
            <progress id="quota-oct" max={branchReport.previousTarget} value={branchReport.previousActual} />
          </div>
        </section>
        <section className={styles.card} aria-labelledby="memo-title">
          <p className={styles.memoLabel}><ArrowUpRight size={16} aria-hidden="true" /> {branchReport.memo.from}</p>
          <h2 id="memo-title">{branchReport.memo.subject}</h2>
          <p className={styles.memoMeta}>To {branchReport.memo.to} · {branchReport.memo.date}</p>
          <p className={styles.memoBody}>{branchReport.memo.body}</p>
        </section>
      </div>
    </div>
  );
}

export function AnalyticsApp({ view, go }: AppProps) {
  const section = view === "team" || view === "branch" ? view : "";
  return (
    <div className={styles.app}>
      <header className={styles.masthead}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}><BarChart3 size={20} aria-hidden="true" /></span>
          <span>Apex Analytics</span>
        </div>
        <span className={styles.organization}>Apex Sales Group</span>
      </header>
      <nav className={styles.navigation} aria-label="Analytics sections">
        {sections.map(({ id, title, icon: Icon }) => (
          <button key={id} type="button" aria-current={section === id ? "page" : undefined} onClick={() => section !== id && go(id)}>
            <Icon size={17} aria-hidden="true" />{title}
          </button>
        ))}
      </nav>
      <div data-workstation-scroll className={styles.scroll} key={section}>
        {section === "team" ? <Leaderboard /> : section === "branch" ? <BranchOverview /> : <EmployeeOverview />}
      </div>
    </div>
  );
}
