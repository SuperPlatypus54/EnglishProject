"use client";

import { useEffect, useRef } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Clock3,
  Download,
  FileImage,
  FileText,
  Folder,
  FolderOpen,
  House,
  Square,
  SquareCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  documents,
  fileFolders,
  type ArtifactSection,
  type FileFolder,
  type WorkstationDocument,
} from "@/data/files";
import type { AppProps } from "@/lib/workstation";
import styles from "./productivity.module.css";

const locations = [
  { view: "", name: "Home", icon: House },
  { view: "folder/documents", name: "Documents", icon: Folder },
  { view: "folder/personal", name: "Personal", icon: UserRound },
  { view: "folder/downloads", name: "Downloads", icon: Download },
  { view: "recent", name: "Recently opened", icon: Clock3 },
  { view: "folder/trash", name: "Trash", icon: Trash2 },
] as const;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatArtifactDate(date: string) {
  return dateFormatter.format(new Date(date));
}

export function ArtifactSections({ sections }: { sections: readonly ArtifactSection[] }) {
  return sections.map((section, index) => (
    <section className={styles.artifactSection} key={index}>
      {section.title && <h2>{section.title}</h2>}
      {section.kind === "paragraphs" &&
        section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
      {section.kind === "fields" && (
        <dl className={styles.fieldList}>
          {section.fields.map(({ label, value }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {section.kind === "checklist" && (
        <ul className={styles.checklist}>
          {section.items.map(({ label, checked }) => {
            const Icon = checked ? SquareCheck : Square;
            return (
              <li key={label}>
                <Icon size={18} className={checked ? styles.checked : styles.unchecked} aria-hidden="true" />
                <span className="sr-only">{checked ? "Complete: " : "Incomplete: "}</span>
                <span>{label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  ));
}

const photoPositions = {
  left: styles.photoLeft,
  center: styles.photoCenter,
  right: styles.photoRight,
};

function PhotoPreview({ photo }: { photo: NonNullable<WorkstationDocument["photo"]> }) {
  return <div className={`${styles.photo} ${photoPositions[photo.position]}`} role="img" aria-label={photo.alt} />;
}

function FolderCard({ folder, open }: { folder: FileFolder; open: () => void }) {
  const location = locations.find(({ view }) => view === `folder/${folder.id}`);
  const Icon = location?.icon ?? FolderOpen;
  return (
    <button type="button" className={styles.folderCard} onClick={open}>
      <span className={styles.folderIcon}><Icon size={21} aria-hidden="true" /></span>
      <span className={styles.folderLabel}>
        <strong>{folder.name}</strong>
        <small>{folder.summary}</small>
      </span>
      <ChevronRight size={16} className={styles.quietIcon} aria-hidden="true" />
    </button>
  );
}

function DocumentList({
  files,
  open,
}: {
  files: readonly WorkstationDocument[];
  open: (id: string) => void;
}) {
  return (
    <ul className={styles.fileList}>
      {files.map((file) => {
        const Icon = file.format === "photo" ? FileImage : FileText;
        return (
          <li key={file.id}>
            <button type="button" className={styles.fileRow} onClick={() => open(file.id)}>
              <span className={`${styles.fileIcon} ${file.format === "pdf" ? styles.pdfIcon : ""}`}>
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className={styles.fileIdentity}>
                <strong>{file.name}</strong>
                <small>{file.format === "pdf" ? "PDF document" : file.format === "photo" ? "JPEG image" : "Text document"}</small>
              </span>
              <time dateTime={file.modified}>{formatArtifactDate(file.modified)}</time>
              <ChevronRight size={16} className={styles.quietIcon} aria-hidden="true" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function DocumentViewer({ file }: { file: WorkstationDocument }) {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [file.id]);

  return (
    <article className={`${styles.documentPaper} ${file.photo ? styles.photoPaper : ""}`}>
      {file.issuer && <p className={styles.issuer}>{file.issuer}</p>}
      <h1 ref={heading} tabIndex={-1}>{file.heading ?? file.name}</h1>
      {file.photo && (
        <figure className={styles.photoFigure}>
          <PhotoPreview photo={file.photo} />
          <figcaption>{file.photo.caption}</figcaption>
        </figure>
      )}
      <ArtifactSections sections={file.sections} />
    </article>
  );
}

export function FilesApp({ view, go, back, recentIds, recordRecent }: AppProps) {
  const [kind, id] = view.split("/");
  const file = kind === "document" ? documents.find((item) => item.id === id) : undefined;
  const folderId = file?.folder ?? (kind === "folder" ? id : undefined);
  const folder = fileFolders.find((item) => item.id === folderId);
  const parent = fileFolders.find((item) => item.id === folder?.parent);
  const recent = view === "recent";
  const home = !file && !folder && !recent;
  const nestedFolders = fileFolders.filter((item) => item.parent === folder?.id);
  const folderDocuments = documents.filter((item) => item.folder === folder?.id);
  const recentDocuments = recentIds.flatMap((recentId) => documents.find((item) => item.id === recentId) ?? []);
  const openedFileId = file?.id;

  useEffect(() => {
    if (openedFileId) recordRecent(openedFileId);
  }, [openedFileId, recordRecent]);

  const openFile = (fileId: string) => go(`document/${fileId}`);
  const openFolder = (nextFolder: FileFolder) => go(`folder/${nextFolder.id}`);

  return (
    <div className={styles.files}>
      <nav className={styles.fileSidebar} aria-label="File locations">
        <div className={styles.locationLabel}>Locations</div>
        {locations.map(({ view: destination, name, icon: Icon }) => {
          const active = destination === view || destination === `folder/${parent?.id ?? folder?.id}`;
          return (
            <button
              key={name}
              type="button"
              className={active ? styles.activeLocation : ""}
              aria-current={active ? "location" : undefined}
              onClick={() => go(destination)}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{name}</span>
            </button>
          );
        })}
      </nav>

      <div className={styles.filePane}>
        <nav className={styles.fileToolbar} aria-label="File path">
          {!home && (
            <button type="button" className={styles.backButton} onClick={back} aria-label="Back in Files">
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
          )}
          <button type="button" aria-current={home ? "page" : undefined} onClick={() => go("")}>
            <House size={15} aria-hidden="true" /> <span>Home</span>
          </button>
          {parent && (
            <>
              <ChevronRight size={14} aria-hidden="true" />
              <button type="button" className={styles.parentCrumb} onClick={() => openFolder(parent)}>{parent.name}</button>
            </>
          )}
          {folder && (
            <>
              <ChevronRight size={14} aria-hidden="true" />
              {file ? (
                <button type="button" onClick={() => openFolder(folder)}>{folder.name}</button>
              ) : (
                <span aria-current="page">{folder.name}</span>
              )}
            </>
          )}
          {recent && <><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">Recently opened</span></>}
        </nav>

        <div className={styles.fileScroll} key={view} data-workstation-scroll>
          {file ? (
            <DocumentViewer file={file} />
          ) : recent ? (
            <>
              <h1>Recently opened</h1>
              {recentDocuments.length > 0 ? (
                <DocumentList files={recentDocuments} open={openFile} />
              ) : (
                <div className={styles.emptyFiles}><Clock3 size={22} aria-hidden="true" /> Documents you open appear here.</div>
              )}
            </>
          ) : (
            <>
              <h1>{folder?.name ?? "Home"}</h1>
              {nestedFolders.length > 0 && (
                <div className={styles.folderGrid}>
                  {nestedFolders.map((item) => <FolderCard key={item.id} folder={item} open={() => openFolder(item)} />)}
                </div>
              )}
              {folder?.id === "keepsakes" ? (
                <ul className={styles.photoGrid}>
                  {folderDocuments.map((item) => (
                    <li key={item.id}>
                      <button type="button" onClick={() => openFile(item.id)}>
                        {item.photo && <PhotoPreview photo={item.photo} />}
                        <span>{item.heading ?? item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                folderDocuments.length > 0 && <DocumentList files={folderDocuments} open={openFile} />
              )}
              {home && (
                <section className={styles.recentSection}>
                  <button type="button" className={styles.sectionLink} onClick={() => go("recent")}>
                    <Clock3 size={18} aria-hidden="true" />
                    <span>Recently opened</span>
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                  {recentDocuments.length > 0 && <DocumentList files={recentDocuments.slice(0, 3)} open={openFile} />}
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
