# James Bond's Computer

MeridianOS is a fictional workstation for the Grand Meridian classroom investigation. It includes Heartline, Meridian Mail, Apex Analytics, Files, Calendar, and Notes. The evidence snapshot is dated November 18, 2026.

## Run locally

Use Node.js 22.

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to load the desktop directly. The browser stores read indicators and recent files on the current device. Clear this site's storage to start a fresh investigation.

```sh
npm run lint
npm run typecheck
npm run build
```

The production build exports static files to `out/`. Serve that directory with an HTTP server to preview the production build locally.

## Edit the evidence

| File | What to edit |
| --- | --- |
| [data/heartline.ts](data/heartline.ts) | Profiles, matches, and timestamped chat messages |
| [data/mail.ts](data/mail.ts) | Inbox, Sent, Drafts, Trash, and unread flags |
| [data/sales.ts](data/sales.ts) | Sales history, quotas, team standings, and the branch memo |
| [data/files.ts](data/files.ts) | Folders, document sections, keepsake photo captions, and shared checklists |
| [data/calendar.ts](data/calendar.ts) | Event dates, start times, and priority |
| [data/notes.ts](data/notes.ts) | Personal notes and checklists |

Keep existing record IDs when editing items so bookmarks, read status, and recents still work. Dates use `YYYY-MM-DD`. Calendar times use 24-hour `HH:mm`. Keep the reservation, calendar, and Heartline confirmations in sync when moving an appointment. The Date Night checklist is shared between Files and Notes. Keep instructor-only material outside the project because the evidence data ships to browsers.

## Deploy on GitHub Pages

1. Push the project to the `main` branch of a public GitHub repository.
2. Open **Settings → Pages** and select **GitHub Actions** as the publishing source. [GitHub Pages setup](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
3. In **Actions**, run **Deploy MeridianOS to GitHub Pages** on `main`. Future pushes to `main` deploy automatically.
4. Copy the live URL from **Settings → Pages** after the deployment succeeds. Open it in a private browser window and confirm it goes directly to the workstation.

The workflow builds the static export with the repository path provided by GitHub Pages and publishes the contents of `out/`.

## Print the poster QR code

Run the command with the verified public GitHub Pages URL.

```sh
npm run qr -- "$MERIDIAN_PRODUCTION_URL"
```

The script checks that the address serves MeridianOS without a sign-in, then saves a print-ready `qr/evidence-03.svg`. Place the SVG on the poster with its white margin intact. Scan a printed proof with a phone before printing the final poster.

**EVIDENCE 03 · JAMES BOND'S COMPUTER**

Scan to examine the recovered workstation.
