import axios from "axios";
import { Note } from "@/types/note";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

/**
 * Получение списка заметок с пагинацией и поиском
 */
export const fetchNotes = async ({
  page = 1,
  q = "",
}: {
  page?: number;
  q?: string;
}): Promise<NotesResponse> => {
  // ✅ Передаем q только если он непустой
  const params: Record<string, string | number> = { page };
  if (q && q.trim() !== "") params.q = q.trim();

  const res = await axios.get<NotesResponse>(`${BASE_URL}/notes`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    params,
  });

  return res.data;
};

/**
 * Получение одной заметки по id
 */
export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await axios.get<Note>(`${BASE_URL}/notes/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return res.data;
};

/**
 * Создание новой заметки
 */
export const createNote = async (
  note: Pick<Note, "title" | "content" | "tag">
): Promise<Note> => {
  const res = await axios.post<Note>(`${BASE_URL}/notes`, note, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return res.data;
};

/**
 * Удаление заметки
 */
export const deleteNote = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/notes/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
};
