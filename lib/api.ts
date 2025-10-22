import axios from "axios";
import { Note } from "@/types/note";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

// === Get all notes ===
export const fetchNotes = async (): Promise<Note[]> => {
  const { data } = await instance.get("/notes");
  return data;
};

// === Get one note by ID ===
export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await instance.get(`/notes/${id}`);
  return data;
};

// === Create a new note ===
export const createNote = async (note: {
  title: string;
  content: string;
}): Promise<Note> => {
  const { data } = await instance.post("/notes", note);
  return data;
};

// === Delete a note ===
export const deleteNote = async (id: string): Promise<void> => {
  await instance.delete(`/notes/${id}`);
};
