"use client";

import type { Note } from "@/types/note";
import styles from "./NoteDetails.module.css";

interface NoteDetailsProps {
  note: Note;
}

export function NoteDetails({ note }: NoteDetailsProps) {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{note.title}</h1>
      <p className={styles.tag}>#{note.tag}</p>
      <p className={styles.content}>{note.content || "Без змісту"}</p>
      <p className={styles.date}>
        Створено: {new Date(note.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
