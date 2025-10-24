"use client";

import ReactPaginate from "react-paginate";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6">
      <ReactPaginate
        pageCount={totalPages}
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        forcePage={currentPage - 1}
        previousLabel="Назад"
        nextLabel="Далі"
        containerClassName="flex gap-2"
        pageClassName="px-3 py-1 border rounded hover:bg-gray-100"
        activeClassName="bg-blue-600 text-white"
        previousClassName="px-3 py-1 border rounded"
        nextClassName="px-3 py-1 border rounded"
        disabledClassName="opacity-50 cursor-not-allowed"
      />
    </div>
  );
}
