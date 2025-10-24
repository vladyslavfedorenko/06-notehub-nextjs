"use client";

import { useQuery } from "@tanstack/react-query";
import { getNoteById } from "@/lib/api";
import type { Note } from "@/types/note";

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
    refetchOnMount: false, // 👈 виправлено згідно вимог
  });

  if (isLoading) return <p>Завантаження...</p>;
  if (isError) return <p>Помилка завантаження нотатки 😢</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-3">{note?.title}</h1>
      {note?.content && <p className="text-gray-700 mb-2">{note.content}</p>}
      <span className="text-sm text-gray-500">#{note?.tag}</span>
    </div>
  );
}
