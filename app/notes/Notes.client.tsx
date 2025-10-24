"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotes, createNote, deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";

export default function NotesClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formValues, setFormValues] = useState({
    title: "",
    content: "",
    tag: "",
  });

  const queryClient = useQueryClient();

  // 🧠 Загружаем заметки
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () => getNotes(search, page),
  });

  // ➕ Создание заметки
  const createMutation = useMutation({
    mutationFn: (values: Pick<Note, "title" | "content" | "tag">) =>
      createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] as const });
      setFormValues({ title: "", content: "", tag: "" });
    },
  });

  // ❌ Удаление заметки
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] as const });
    },
  });

  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Ошибка загрузки данных</p>;

  return (
    <div className="p-6 space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate(formValues);
        }}
        className="flex flex-col gap-2 max-w-md"
      >
        <input
          type="text"
          placeholder="Заголовок"
          value={formValues.title}
          onChange={(e) =>
            setFormValues((v) => ({ ...v, title: e.target.value }))
          }
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Текст заметки"
          value={formValues.content}
          onChange={(e) =>
            setFormValues((v) => ({ ...v, content: e.target.value }))
          }
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Тег"
          value={formValues.tag}
          onChange={(e) =>
            setFormValues((v) => ({ ...v, tag: e.target.value }))
          }
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Создать
        </button>
      </form>

      <hr />

      <div className="grid gap-3">
        {data?.notes?.map((note) => (
          <div key={note.id} className="border p-3 rounded bg-gray-50">
            <h2 className="text-lg font-semibold">{note.title}</h2>
            <p className="text-gray-700">{note.content}</p>
            <span className="text-sm text-gray-500">#{note.tag}</span>
            <button
              onClick={() => deleteMutation.mutate(note.id)}
              className="text-red-500 mt-2 block"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
