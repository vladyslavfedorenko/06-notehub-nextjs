import { NextResponse } from "next/server";

const notes = [
  { id: 1, title: "Test note", content: "API is working!", tag: "demo" },
];

// Обработка GET-запроса — поддерживает query-параметры (?page=1)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "1";
  console.log("📄 Получен запрос на страницу:", page);

  return NextResponse.json({ page, notes });
}

// POST-запрос — добавление новой заметки
export async function POST(req: Request) {
  const data = await req.json();
  const newNote = {
    id: notes.length + 1,
    title: data.title || "Без названия",
    content: data.content || "",
    tag: data.tag || "general",
  };
  notes.push(newNote);
  return NextResponse.json({ note: newNote, success: true }, { status: 201 });
}
