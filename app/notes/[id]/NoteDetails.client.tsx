"use client";

import { useQuery } from "@tanstack/react-query";
import { getNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import styles from "./NoteDetails.module.css"; // ✅ импорт модульных стилей

interface NoteDetailsClientProps {
  noteId: string;
}

export default function NoteDetailsClient({ noteId }: NoteDetailsClientProps) {
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => getNoteById(noteId),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Завантаження...</p>;
  if (isError) return <p>Помилка завантаження нотатки 😢</p>;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{note?.title}</h1>
      <p className={styles.content}>
        {note?.content ? note.content : "Без змісту"}
      </p>
      <span className={styles.tag}>#{note?.tag}</span>
    </div>
  );
}
