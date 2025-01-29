import { z } from "astro:schema";
import { Prisma } from "@/database";
import { defineAction, ActionError } from "astro:actions";
import Midtrans from "midtrans-client"

export const order = {
  midtrans: defineAction({
    input: z.object({
      products: z.array(z.object({
        id: z.number().int().positive(),
        quantity: z.number().int().positive()
      })).min(1, { message: "At least 1 product selected." }),
    }),
    handler: async (input, ctx) => {
      const table = JSON.parse(ctx.cookies.get("table")?.value || "{}")
      const productsData = await Prisma.product.findMany({
        where: {
          id: { in: input.products.map(p => p.id) },
        },
      });
      const total = input.products.reduce((total, p) => {
        const product = productsData.find(prod => prod.id === p.id);
        return product ? total + p.quantity * product.price : total;
      }, 0);

      if (!table.id) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Request must contain table id."
        })
      }

      const order = await Prisma.order.create({
        data: {
          tableId: table.id,
          total: total,
        },
      })
      const snap = new Midtrans.Snap({
        isProduction: false,
        serverKey: import.meta.env.MIDTRANS_SERVER_KEY,
        clientKey: import.meta.env.PUBLIC_MIDTRANS_CLIENT_KEY
      })
      const parameter = {
        transaction_details: {
          order_id: order.id,
          gross_amount: order.total,
        },
        item_details: input.products.map(({ quantity }) => {
          productsData.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            quantity: quantity,
          }))
        })
      }
      const token = await snap.createTransactionToken(parameter)
      return { token, orderId: order.id }
    },
  }),

  getAll: defineAction({
    handler: async () => {
      const orders = await Prisma.order.findMany({
        include: {
          table: true
        }
      })

      return { orders }
    }
  }),

  create: defineAction({
    input: z.object({
      orderId: z.string().min(1, { message: "Order not created." }),
      products: z.array(
        z.object({
          id: z.number().int().positive(),
          quantity: z.number().int().positive({ message: "Quantity must be a positive integer." }),
        })
      ).min(1, { message: "At least one product is required." })
    }),
    handler: async (input, ctx) => {
      const table = ctx.cookies.get("table")?.value
      const order = await Prisma.order.findFirst({
        where: {
          id: input.orderId
        }
      })

      if (!order) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Order not created."
        })
      }
      if (!table) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Request must contain table id."
        })
      }
      const productsData = input.products.map(p => ({
        orderId: input.orderId,
        productId: p.id,
        quantity: p.quantity
      }));
      await Prisma.orderProduct.createMany({
        data: productsData,
      });
      ctx.cookies.delete("table")
      return {
        message: "Order is being processed."
      }
    }
  }),

  delete: defineAction({
    input: z.object({
      orderId: z.string().min(1)
    }),
    handler: async (input) => {
      const order = await Prisma.order.findFirst({
        where: {
          id: input.orderId
        }
      })
      if (!order) throw new ActionError({
        code: "NOT_FOUND",
        message: "Order not created."
      })
      await Prisma.order.delete({
        where: {
          id: input.orderId
        }
      })
      return {
        message: "order deleted."
      }
    }
  })
}
