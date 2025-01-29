import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { Prisma } from "@/database"

export const product = {
  getAll: defineAction({
    handler: async () => {
      const products = await Prisma.product.findMany({
        include: {
          category: true
        },
        orderBy: {
          createdAt: "desc"
        }
      })

      return { products }
    }
  }),

  create: defineAction({
    accept: "form",
    input: z.object({
      category: z.number().positive(),
      image: z.string().url(),
      name: z.string().min(1).max(255),
      price: z.number().positive()
    }),
    handler: async (input) => {
      await Prisma.product.create({
        data: {
          categoryId: input.category,
          image: input.image,
          name: input.name,
          price: input.price
        }
      })

      return { message: "Product created." }
    }
  }),

  delete: defineAction({
    input: z.object({
      products: z
        .array(z.number().positive())
        .nonempty("At least one item must be selected"),
    }),
    handler: async ({ products }) => {
      const now = new Date();
      const deletedProducts = await Prisma.product.updateMany({
        where: {
          id: { in: products },
        },
        data: {
          deletedAt: now,
        },
      });

      return {
        message: `${deletedProducts.count} products deleted.`
      }
    },
  })
}
