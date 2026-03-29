import { ColumnDef } from "@tanstack/react-table";
import { IBuyerOrders} from "@/types";
import { clipSentence, cn, formatPriceAmount } from "@/lib/utils";





export const getBuyerOrdersColumns = (): ColumnDef<IBuyerOrders>[] => [
  {
    header: "PRODUCT",
    accessorKey: "product",
    cell: ({ row }) => {
      const product = row.original.product.name;
      const productDescription = row.original.product.description;
      const productImage = row.original.product.imageUrl[0];
      return (
        <div className="flex gap-2">
          <div className="h-20 w-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
            <img
              src={productImage}
              alt={product}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h2 className="font-semibold">{product}</h2>
            <p>{clipSentence(productDescription, 30)}</p>
          </div>
        </div>
      );
    },
  },

  {
    header: "SELLER",
    accessorKey: "product.seller.fullName",
    cell: ({ row }) => {
      const seller = row.original.product.seller.fullName;

      return <h3>{seller}</h3>;
    },
  },

  {
    header: "QUANTITY",
    accessorKey: "quantity",
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      return <p className="">{quantity}</p>;
    },
  },
  {
    header: "PRICE",
    accessorKey: "price",
    cell: ({ row }) => {
      const price = row.original.totalPrice;
      return <p className="">{formatPriceAmount(Number(price))}</p>;
    },
  },
  {
    header: "ORDERSTATUS",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.orderStatus;
      return (
        <p
          className={cn(
            "px-2 text-xs py-1 w-fit rounded-full ",
            status === "COMPLETED"
              ? "bg-green-100 text-green-700"
              : status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700",
          )}
        >
          {status}
        </p>
      );
    },
  },
  {
    header: "PAYMENT STATUS",
    accessorKey: "paymentStatus",
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      return <div>{status}</div>;
    },
  },
];
