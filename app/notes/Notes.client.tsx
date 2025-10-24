"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotes } from "@/lib/api";
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => getNotes(page, debouncedSearch),
    placeholderData: (prev) => prev,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
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

      <NoteList notes={data?.notes || []} />

      <Pagination
        currentPage={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
