"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/fetchNoteById";
import css from "./NoteDetails.module.css";
import { useParams } from "next/navigation";
import { Note } from "@/types/note";

interface Props {
  noteId?: string;
}

export default function NoteDetailsClient({ noteId }: Props) {
  const params = useParams();
  const id = noteId || (params?.id as string);

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          Created: {new Date(note.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
