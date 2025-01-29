import { RupiahFormat } from "@/utils/RupiahFormat";
import { Input } from "@headlessui/react";
import type { Product } from "@prisma/client";
import type { ChangeEvent } from "react";
import type { OrderState } from "@/types";

const ProductOrderCard = ({ order, product }: {
  order: OrderState, product: (Product & { quantity: number })
}) => {
  const handleDelete = (product: Product) => {
    const updatedProducts = order.products.filter(
      (p) => p.id !== product.id
    );

    const updatedTotal = updatedProducts.reduce(
      (total, p) => total + p.quantity * p.price, 0
    );

    const newOrder = {
      ...order,
      products: updatedProducts,
      total: updatedTotal,
    }
    window.dispatchEvent(new CustomEvent("orderUpdated", { detail: { ...newOrder } }))
    window.localStorage.setItem("order", JSON.stringify(newOrder))
  }

  const handleChangeQnt = (e: ChangeEvent<HTMLInputElement>, product: (Product & { quantity: number })) => {
    const updatedProducts = order.products.map((p) =>
      p.id === product.id
        ? { ...p, quantity: +e.target.value }
        : p
    );

    const updatedTotal = updatedProducts.reduce(
      (total, p) => total + p.quantity * p.price,
      0
    );

    const newOrder = {
      ...order,
      products: updatedProducts,
      total: updatedTotal,
    }
    window.dispatchEvent(new CustomEvent("orderUpdated", { detail: { ...newOrder } }))
    window.localStorage.setItem("order", JSON.stringify(newOrder))
  }
  return (
    <div className="bg-gray-100 rounded-md flex p-2 mb-3">
      <img
        src={`${product.image}`}
        className="bg-white rounded-md object-cover shrink-0 h-[4.5rem]"
        width={95}
      />

      <div className="ps-2 w-full flex flex-col items-end justify-between">
        <div className="flex items-center justify-between w-full">
          <h4 className="font-medium text-sm">{product.name}</h4>
          <h5 className="text-sm text-blue-600">
            {RupiahFormat(product.price)}
          </h5>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Input id={`product-quantity-${product.id}`} type="number" min="1" value={product.quantity} onChange={(e) => handleChangeQnt(e, product)} className="text-sm text-center w-12 py-1 rounded-md" />

          <button type="button" onClick={() => handleDelete(product)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductOrderCard;
