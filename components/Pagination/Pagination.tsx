"use client";

import ReactPaginate from "react-paginate";
import styles from "./Pagination.module.css";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className={styles.pagination}>
      <ReactPaginate
        pageCount={totalPages}
        forcePage={currentPage - 1}
        onPageChange={(selected) => onPageChange(selected.selected + 1)}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        containerClassName={styles.pageContainer}
        activeClassName={styles.active}
        previousLabel="<"
        nextLabel=">"
      />
    </div>
  );
}
