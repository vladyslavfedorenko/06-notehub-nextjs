"use client";

import { Note } from "@/types/note";
import styles from "./NoteList.module.css";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li key={note.id} className={styles.item}>
          <div className={styles.header}>
            <h3>{note.title}</h3>
            <p className={styles.tag}>Tag: {note.tag}</p>
          </div>
          <p className={styles.content}>{note.content}</p>
          <div className={styles.footer}>
            <Link href={`/notes/${note.id}`}>View details</Link>
            <button onClick={() => deleteMutation.mutate(note.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
