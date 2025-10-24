import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

interface PageProps {
  params: {
    id: string;
  };
}

// 🚀 Серверный компонент — подготавливает данные для конкретной заметки
export default async function NoteDetailsPage({ params }: PageProps) {
  const queryClient = new QueryClient();

  // Предварительно подгружаем данные заметки
  await queryClient.prefetchQuery({
    queryKey: ["note", params.id],
    queryFn: () => getNoteById(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient noteId={params.id} />
    </HydrationBoundary>
  );
}
