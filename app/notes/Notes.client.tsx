"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/fetchNotes";
import { createNote } from "@/lib/api/createNote";
import { deleteNote } from "@/lib/api/deleteNote";
import Link from "next/link";
import css from "./Notes.module.css";
import { useState } from "react";
import { Note } from "@/types/note";

export default function NotesClient() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  const {
    data: notes,
    isLoading,
    isError,
  } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError) return <p>Could not fetch the list of notes.</p>;
  if (!notes) return <p>No notes found.</p>;

  const filtered = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim()) return;
    createMutation.mutate(newNote);
    setNewNote({ title: "", content: "" });
  };

  return (
    <div className={css.container}>
      <h1 className={css.title}>Your Notes</h1>

      <input
        className={css.search}
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <form onSubmit={handleSubmit} className={css.form}>
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        />
        <button type="submit">Add Note</button>
      </form>

      <ul className={css.list}>
        {filtered.map((note) => (
          <li key={note.id} className={css.item}>
            <div>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </div>
            <div className={css.actions}>
              <Link href={`/notes/${note.id}`}>View details</Link>
              <button onClick={() => deleteMutation.mutate(note.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
