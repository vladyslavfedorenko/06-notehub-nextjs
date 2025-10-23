import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

interface PageProps {
  // ✅ саме Promise<{ id: string }>, як вимагає перевірка
  params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({ params }: PageProps) {
  // ✅ очікуємо params у тілі функції
  const { id } = await params;

  const queryClient = new QueryClient();

  // ✅ префетч з коректним queryKey/queryFn
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
