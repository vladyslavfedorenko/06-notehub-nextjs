"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote, deleteNote } from "@/lib/api";
import { useState } from "react";
import styles from "./Notes.module.css";
import { Note } from "@/types/note";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";

export default function NotesClient() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 5;

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
    <div className={styles.container}>
      <h1 className={styles.title}>Your Notes</h1>

      <SearchBox value={search} onChange={setSearch} />
      <NoteForm onSubmit={handleAddNote} />
      <NoteList notes={paginated} onDelete={handleDeleteNote} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
