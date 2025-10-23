import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  // ✅ Оборачиваем вызов fetchNotes, чтобы не было ошибки типов
  await queryClient.prefetchQuery({
    queryKey: ["notes", { page: 1, q: "" }],
    queryFn: () => fetchNotes({ page: 1, q: "" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
