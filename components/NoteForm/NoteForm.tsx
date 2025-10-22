"use client";

import { useState } from "react";
import css from "./NoteForm.module.css";

interface Props {
  onSubmit: (title: string, content: string) => void;
}

export default function NoteForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <input
        type="text"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={css.input}
        required
      />
      <textarea
        placeholder="Note content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={css.textarea}
      />
      <button type="submit" className={css.button}>
        Add Note
      </button>
    </form>
  );
}
