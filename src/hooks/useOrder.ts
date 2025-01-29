// custom hooks to get the order from localStorage
import type { OrderState } from "@/types";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";

export const useOrder = (): [OrderState, Dispatch<SetStateAction<OrderState>>] => {
  //get order from localStorage
  const [order, setOrder] = useState<OrderState>(() => {
    const storedorder = window.localStorage.getItem("order");
    return storedorder ? JSON.parse(storedorder) : { products: [], total: 0 };
  });

  //update order when event is fire
  useEffect(() => {
    window.addEventListener("orderUpdated", (e) => {
      const customEvent = e as CustomEvent<OrderState>;
      setOrder(customEvent.detail);
    });

    return () => window.removeEventListener("orderUpdated", (e) => {
      const customEvent = e as CustomEvent<OrderState>;
      setOrder(customEvent.detail);
    })
  }, [])

  return [order, setOrder];
}
