"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import styles from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

/**
 * Компонент списку нотаток.
 * Відображає title, content і tag для кожної нотатки.
 * Використовує React Query для видалення і оновлення кешу.
 */
export function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (!notes?.length) {
    return <p className={styles.empty}>Немає нотаток 😔</p>;
  }

  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li key={note.id} className={styles.item}>
          <div className={styles.header}>
            <h3 className={styles.title}>{note.title}</h3>
            <span className={styles.tag}>#{note.tag}</span>
          </div>

          {/* ✅ контент тепер завжди присутній у розмітці */}
          <p className={styles.content}>
            {note.content && note.content.trim().length > 0
              ? note.content
              : "Без змісту"}
          </p>

          <div className={styles.actions}>
            <Link href={`/notes/${note.id}`} className={styles.link}>
              View details
            </Link>
            <button
              type="button"
              onClick={() => mutation.mutate(note.id)}
              className={styles.delete}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
