"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { fetchNotes, createNote, deleteNote } from "@/lib/api";
import { Note } from "@/types/note";
import NoteForm from "@/components/NoteForm/NoteForm";
import Link from "next/link";

export default function NotesClient() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  // === Получаем список заметок ===
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", { page, q }],
    queryFn: () => fetchNotes({ page, q }),
    placeholderData: keepPreviousData, // ✅ современный аналог keepPreviousData: true
    staleTime: 1000 * 60, // кэш валиден 1 минуту
    refetchOnMount: false,
  });

  // === Мутация для создания заметки ===
  const createMutation = useMutation({
    mutationFn: (newNote: Pick<Note, "title" | "content" | "tag">) =>
      createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // === Мутация для удаления заметки ===
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // === Обработчики ===
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setQ((formData.get("q") as string) || "");
    setPage(1);
  };

  const handleSubmit = (title: string, content: string, tag: string) => {
    createMutation.mutate({ title, content, tag });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong while loading notes.</p>;

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">📒 Your Notes</h1>

      {/* Поиск */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          name="q"
          placeholder="Search notes..."
          className="border rounded p-2 w-full"
          defaultValue={q}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {/* Создание заметки */}
      <NoteForm onSubmit={handleSubmit} />

      {/* Список заметок */}
      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note: Note) => (
            <li
              key={note.id}
              className="border rounded p-4 flex justify-between items-start"
            >
              <div>
                <h2 className="font-bold text-lg">{note.title}</h2>
                <p className="text-gray-700">{note.content}</p>
                <p className="text-sm text-gray-500 mt-1">#{note.tag}</p>

                <Link
                  href={`/notes/${note.id}`}
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                >
                  View details →
                </Link>
              </div>

              <button
                onClick={() => deleteMutation.mutate(note.id)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Пагинация */}
      <div className="flex justify-center gap-3 pt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ← Prev
        </button>
        <span className="px-2 text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
