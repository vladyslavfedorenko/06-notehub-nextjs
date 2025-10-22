import axios from "axios";
import { Note } from "@/types/note";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export interface CreateNoteDto {
  title: string;
  content: string;
}

export async function createNote(note: CreateNoteDto): Promise<Note> {
  try {
    const res = await axios.post<Note>("https://api.notehub.app/notes", note, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating note:", error.message);
    } else {
      console.error("Unknown error while creating note");
    }
    throw new Error("Failed to create note");
  }
}
