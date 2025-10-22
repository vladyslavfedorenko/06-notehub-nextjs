import axios from "axios";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export async function deleteNote(id: string): Promise<void> {
  try {
    await axios.delete(`https://api.notehub.app/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting note:", error.message);
    } else {
      console.error("Unknown error while deleting note");
    }
    throw new Error("Failed to delete note");
  }
}
