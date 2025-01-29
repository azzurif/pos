import type { Product } from "@prisma/client"

export type OrderState = {
  total: number;
  products: (Product & { quantity: number })[];
};

export type FormResponseType = {
  error?: {
    code?: string
    message?: string
    fields?: unknown
  }
  data?: {
    message: string
  }
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess?: () => void
        onPending?: () => void
        onError?: () => void
        onClose?: () => void
      }) => void
    }
  }
}
