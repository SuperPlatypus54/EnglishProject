import { appDirectory } from "@/lib/app-directory";
import type { AppId } from "@/lib/workstation";
import styles from "./workstation.module.css";

export function AppIcon({ app, compact = false }: { app: AppId; compact?: boolean }) {
  const Icon = appDirectory[app].icon;
  return (
    <span className={`${styles.appIcon}${compact ? ` ${styles.compactIcon}` : ""}`} data-app={app}>
      <Icon aria-hidden="true" strokeWidth={1.65} />
    </span>
  );
}
