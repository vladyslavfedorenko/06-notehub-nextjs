import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { getNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import styles from "./NotesPage.module.css";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1],
    queryFn: () => getNotes(1, ""), // ✅ правильный порядок аргументов
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className={styles.container}>
      <HydrationBoundary state={dehydratedState}>
        <NotesClient />
      </HydrationBoundary>
    </div>
  );
}
