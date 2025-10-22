import axios from "axios";
import { Note } from "@/types/note";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export async function fetchNotes(): Promise<Note[]> {
  try {
    const res = await axios.get<Note[]>(`${API_URL}/notes`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    return res.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching notes:", error.message);
    } else {
      console.error("Unknown error while fetching notes");
    }
    throw new Error("Failed to fetch notes");
  }
}
