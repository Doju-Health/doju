import { DataTableWrapper, DataTable } from "@/components/ui/table";
import { getProductsColumns } from "./product-table-column";

const mockTableData = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "Portable Oxygen Concentrator",
    description:
      "High-quality portable oxygen concentrator with 2-hour battery life",
    price: 499.99,
    stock: 50,
    status: "approved",
    category: {
      id: "category-123",
      name: "Respiratory Equipment",
      description: "Respiratory care and monitoring equipment",
      imageUrl:
        "https://res.cloudinary.com/doju/image/upload/v1234567890/doju/categories/respiratory.jpg",
      isActive: true,
      createdAt: "2025-02-09T10:30:00Z",
      updatedAt: "2025-02-09T10:30:00Z",
    },
    imageUrl:
      "https://res.cloudinary.com/doju/image/upload/v1234567890/doju/products/product.jpg",
    seller: {
      id: "user-123",
      fullName: "John Doe",
      email: "john@example.com",
    },
    isActive: true,
    createdAt: "2025-02-09T10:30:00Z",
    updatedAt: "2025-02-09T10:30:00Z",
  },
];
export const ProductTable = () => {
  const columns = getProductsColumns();
  return (
    <DataTableWrapper className="">
      <DataTable columns={columns} data={mockTableData} />
    </DataTableWrapper>
  );
};
