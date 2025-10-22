import axios from "axios";
import { Note } from "@/types/note";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export async function fetchNotes(): Promise<Note[]> {
  try {
    const res = await axios.get<Note[]>("https://api.notehub.app/notes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: unknown) {
    // Проверяем тип ошибки
    if (error instanceof Error) {
      console.error("Error fetching notes:", error.message);
    } else {
      console.error("Unknown error while fetching notes");
    }
    throw new Error("Failed to fetch notes");
  }
}
