import axios from "axios";
import { Note } from "@/types/note";

// 🔐 Подтягиваем токен и базовый URL из .env.local
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// ⚠️ Если токена нет — предупреди в консоли
if (!token) {
  console.warn("⚠️ NEXT_PUBLIC_NOTEHUB_TOKEN is missing!");
}

// Создаём axios-инстанс
export const instance = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface NotesResponse {
  notes: Note[];
  total: number;
  page: number;
  limit: number;
}

// 📥 Получить все заметки
export const getNotes = async (
  search: string,
  page: number
): Promise<NotesResponse> => {
  const { data } = await instance.get<NotesResponse>("/notes", {
    params: { search, page },
  });
  return data;
};

// ➕ Создать новую заметку
export const createNote = async (
  note: Pick<Note, "title" | "content" | "tag">
): Promise<Note> => {
  const { data } = await instance.post<Note>("/notes", note);
  return data;
};

// ❌ Удалить заметку
export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await instance.delete<Note>(`/notes/${id}`);
  return data;
};

// 🔍 Получить заметку по id
export const getNoteById = async (id: string): Promise<Note> => {
  const { data } = await instance.get<Note>(`/notes/${id}`);
  return data;
};
