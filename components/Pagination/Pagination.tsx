"use client";

import ReactPaginate from "react-paginate";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Компонент пагінації.
 * Використовує ReactPaginate із модульними стилями.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.wrapper}>
      <ReactPaginate
        pageCount={totalPages}
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        forcePage={currentPage - 1}
        previousLabel="Назад"
        nextLabel="Далі"
        containerClassName={styles.pagination}
        pageClassName={styles.page}
        activeClassName={styles.active}
        previousClassName={styles.navButton}
        nextClassName={styles.navButton}
        disabledClassName={styles.disabled}
      />
    </div>
  );
}
