"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotes, createNote, deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import { useDebounce } from "@/hooks/useDebounce";
import { Modal } from "@/components/Modal/Modal";
import { NoteForm } from "@/components/NoteForm/NoteForm";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import { NoteList } from "@/components/NoteList/NoteList";
import { Pagination } from "@/components/Pagination/Pagination";

export default function NotesClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => getNotes(debouncedSearch, page),
    placeholderData: (prev) => prev, // 👈 keepPreviousData
  });

  const createMutation = useMutation({
    mutationFn: (values: Pick<Note, "title" | "content" | "tag">) =>
      createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] as const });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] as const });
    },
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // 👈 reset page on search change
  };

  if (isLoading) return <p>Завантаження...</p>;
  if (isError) return <p>Помилка отримання нотаток 😢</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <SearchBox value={search} onChange={handleSearchChange} />
        <button
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          Нова нотатка
        </button>
      </div>

      <NoteList
        notes={data?.notes || []}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      <Pagination
        currentPage={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSubmit={(values) => createMutation.mutate(values)}
          onCancel={() => setIsModalOpen(false)} // 👈 кнопка "Скасувати"
        />
      </Modal>
    </div>
  );
}
