"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";

interface NoteListProps {
  notes: Note[];
}

export function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (!notes?.length) {
    return <p className="text-gray-500">Немає нотаток 😔</p>;
  }

  return (
    <ul className="grid gap-4">
      {notes.map((note) => (
        <li
          key={note.id}
          className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{note.title}</h3>
            <span className="text-sm text-gray-500">#{note.tag}</span>
          </div>

          {note.content && (
            <p className="text-gray-700 text-sm mb-3 line-clamp-3">
              {note.content}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Link
              href={`/notes/${note.id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              View details
            </Link>
            <button
              onClick={() => mutation.mutate(note.id)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
