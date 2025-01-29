import { RupiahFormat } from "@/utils/RupiahFormat";
import { useOrder } from '@/hooks/useOrder';
import type { Category, Product } from "@prisma/client";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  product: Product & { category: Category };
  className?: string;
};

const ProductCard = ({ product, className = "", ...props }: Props) => {
  const [order, setOrder] = useOrder()
  const handleClick = (product: Product) => {
    const existingProductIndex = order.products.findIndex(
      (p) => p.id === product.id,
    );

    if (existingProductIndex !== -1) {
      order.products[existingProductIndex].quantity += 1;
    } else {
      order.products.push({ ...product, quantity: 1 });
    }

    order.total = order.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );

    window.dispatchEvent(
      new CustomEvent("orderUpdated", { detail: { ...order } }),
    );
    window.localStorage.setItem("order", JSON.stringify(order));
  }
  return (
    <button
      className={`shadow-md rounded-lg p-2 hover:bg-white hover:shadow-sm transition-all ease-in-out duration-200 delay-75 text-sm md:text-base ${className}`}
      onClick={() => handleClick(product)}
      {...props}
    >
      <img
        src={product.image}
        className="bg-white rounded-md w-full h-[180px] object-cover"
        alt={product.name}
      />
      <p className="font-medium text-start">{product.name}</p>

      <div className="flex items-center justify-between mt-2">
        <p className="hidden md:block text-sm text-blue-600">
          {product.category.name}
        </p>

        <p className="font-medium">{RupiahFormat(product.price)}</p>
      </div>
    </button>
  )
}

export default ProductCard
