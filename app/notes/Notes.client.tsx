"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/fetchNotes";
import { createNote } from "@/lib/api/createNote";
import { deleteNote } from "@/lib/api/deleteNote";
import { useState } from "react";
import css from "./Notes.module.css";
import { Note } from "@/types/note";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";

export default function NotesClient() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 5; // можно изменить при необходимости

  // === FETCH NOTES ===
  const {
    data: notes = [],
    isLoading,
    isError,
  } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  // === CREATE NOTE ===
  const createMutation = useMutation({
    mutationFn: (note: { title: string; content: string }) => createNote(note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  // === DELETE NOTE ===
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  // === HANDLE STATES ===
  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError) return <p>Could not fetch the list of notes.</p>;
  if (!notes.length) return <p>No notes yet.</p>;

  // === FILTERED + PAGINATED NOTES ===
  const filtered = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / notesPerPage);
  const startIndex = (currentPage - 1) * notesPerPage;
  const paginated = filtered.slice(startIndex, startIndex + notesPerPage);

  // === EVENT HANDLERS ===
  const handleAddNote = (title: string, content: string) => {
    createMutation.mutate({ title, content });
  };

  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={css.container}>
      <h1 className={css.title}>Your Notes</h1>

      {/* Search */}
      <SearchBox value={search} onChange={setSearch} />

      {/* Form */}
      <NoteForm onSubmit={handleAddNote} />

      {/* Notes List */}
      <NoteList notes={paginated} onDelete={handleDeleteNote} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
