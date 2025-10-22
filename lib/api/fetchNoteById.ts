import axios from "axios";
import { Note } from "@/types/note";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export async function fetchNoteById(id: string): Promise<Note> {
  try {
    const res = await axios.get<Note>(`https://api.notehub.app/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching note:", error.message);
    } else {
      console.error("Unknown error while fetching note");
    }
    throw new Error("Failed to fetch note details");
  }
}
