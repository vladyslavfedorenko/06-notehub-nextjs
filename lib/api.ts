import axios from "axios";
import { Note } from "@/types/note";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!token) {
  console.warn("⚠️ NEXT_PUBLIC_NOTEHUB_TOKEN is missing!");
}

export const instance = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

// 📥 Отримати список нотаток
export const getNotes = async (
  search: string,
  page: number
): Promise<NotesResponse> => {
  const { data } = await instance.get<NotesResponse>("/notes", {
    params: { search, page },
  });
  return data;
};

// ➕ Створити нову нотатку
export const createNote = async (
  note: Pick<Note, "title" | "content" | "tag">
): Promise<Note> => {
  const { data } = await instance.post<Note>("/notes", note);
  return data;
};

// ❌ Видалити нотатку
export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await instance.delete<Note>(`/notes/${id}`);
  return data;
};

// 🔍 Отримати нотатку за ID
export const getNoteById = async (id: string): Promise<Note> => {
  const { data } = await instance.get<Note>(`/notes/${id}`);
  return data;
};
