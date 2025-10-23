import { NextResponse } from "next/server";

// Пример временных данных (заметки)
const notes = [
  {
    id: 1,
    title: "Первая заметка",
    content: "Это пример заметки для теста API.",
    tag: "demo",
  },
  {
    id: 2,
    title: "Вторая заметка",
    content: "API работает корректно 🚀",
    tag: "test",
  },
];

// 📘 Обработка GET-запросов (список заметок)
export async function GET() {
  return NextResponse.json({ notes });
}

// 📘 Обработка POST-запросов (добавление заметки)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newNote = {
      id: notes.length + 1,
      title: body.title ?? "Без названия",
      content: body.content ?? "",
      tag: body.tag ?? "general",
    };
    notes.push(newNote);

    return NextResponse.json({ note: newNote, success: true }, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании заметки:", error);
    return NextResponse.json(
      { error: "Ошибка при создании заметки" },
      { status: 400 }
    );
  }
}
