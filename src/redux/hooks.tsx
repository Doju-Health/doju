import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import type { TypedUseSelectorHook } from "react-redux";
import { Product } from "@/types";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "./slice/cart/cartSlice";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { items, totalItems, totalAmount } = useAppSelector(
    (state) => state.cart,
  );

  return {
    items,
    totalItems,
    totalAmount,
    addToCart: (product: Product, quantity?: number) =>
      dispatch(addToCart({ product, quantity })),
    removeFromCart: (productId: string) => dispatch(removeFromCart(productId)),
    updateQuantity: (productId: string, quantity: number) =>
      dispatch(updateQuantity({ productId, quantity })),
    clearCart: () => dispatch(clearCart()),
  };
};
