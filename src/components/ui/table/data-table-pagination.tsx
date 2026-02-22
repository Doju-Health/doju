import ReactPaginate from "react-paginate";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select/select";
import { MoveLeft, MoveRight } from "lucide-react";

interface PaginationType {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

interface DataTablePaginationProps {
  showPaginationProps?: boolean;
  pagination?: PaginationType;
  handlePageChange?: (newPage: number) => void;
  handleLimitChange?: (newLimit: number) => void;
}

export const DataTablePagination = ({
  pagination,
  showPaginationProps = true,
  handlePageChange,
  handleLimitChange,
}: DataTablePaginationProps) => {
  const { currentPage, itemsPerPage, totalItems } = pagination! || {};
  const itemOffset = (currentPage - 1) * itemsPerPage;
  const endOffset =
    itemOffset + itemsPerPage > totalItems
      ? totalItems
      : itemOffset + itemsPerPage;

  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newPage = event.selected + 1;
    handlePageChange?.(newPage);
  };

  return (
    <div className="flex w-full items-center justify-end gap-4 border-t p-2.5 font-light text-sm flex-wrap">
      {showPaginationProps && (
        <>
          <div className="flex items-center space-x-2">
            <p>Rows per page</p>
            <Select
              value={itemsPerPage?.toString()}
              onValueChange={(value) => {
                handleLimitChange?.(+value);
                handlePageChange?.(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px] px-2.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 8, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem
                    key={pageSize}
                    value={`${pageSize}`}
                    className="cursor-pointer"
                  >
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="w-20 text-center">
            {itemOffset + 1} - {endOffset} of {totalItems}
          </p>
        </>
      )}
      <ReactPaginate
        breakLabel="..."
        nextLabel={<MoveRight className="size-5 cursor-pointer" />}
        onPageChange={handlePageClick}
        pageCount={pageCount}
        forcePage={currentPage - 1}
        previousLabel={<MoveLeft className="size-5 cursor-pointer" />}
        containerClassName="flex gap-2 items-center"
        pageLinkClassName="w-full h-full flex items-center justify-center"
        pageClassName="flex items-center justify-center border size-7 rounded-lg transition duration-300 ease-in-out hover:bg-primary cursor-pointer hover:text-white"
        activeClassName="flex items-center justify-center bg-primary text-white size-7 border-purple rounded-lg"
      />
    </div>
  );
};
