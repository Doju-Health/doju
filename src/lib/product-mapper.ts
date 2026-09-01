import type { ApiProduct, Product } from "@/types";

/** Map an API product to the internal Product shape used by ProductCard & cart */
export const mapApiProduct = (p: ApiProduct): Product => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: Number(p.price),
  images: p.imageUrl?.filter(Boolean) ?? [],
  category: p.category?.name ?? "Other",
  brand: p.seller?.fullName ?? "DOJU Seller",
  sku: `DB-${p.id.slice(0, 8)}`,
  stock: p.stock,
  sellerId: p.seller?.id ?? "",
  sellerCity: p.seller?.businessCity ?? undefined,
  approvalStatus: "approved",
  createdAt: new Date(p.createdAt),
});
