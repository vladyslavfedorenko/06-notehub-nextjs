// app/api/notes/route.ts
import { NextResponse } from "next/server";

const notes = [
  { id: 1, title: "Пример заметки", content: "Это пример заметки." },
  { id: 2, title: "Вторая заметка", content: "Ещё одна заметка." },
];

export async function GET() {
  return NextResponse.json({ notes });
}
