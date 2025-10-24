import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { getNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage() {
  // создаём новый QueryClient на сервере
  const queryClient = new QueryClient();

  // делаем prefetch (SSR-запрос на сервере)
  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1], // по умолчанию первая страница без фильтра
    queryFn: () => getNotes("", 1),
  });

  // передаём состояние кеша в клиент
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient />
    </HydrationBoundary>
  );
}
