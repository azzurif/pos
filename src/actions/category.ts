import { defineAction } from "astro:actions"
import { Prisma } from "@/database"
import { z } from "astro:schema"
import { ActionError } from "astro:actions"

export const category = {
  getAll: defineAction({
    handler: async () => {
      const categories = await Prisma.category.findMany({ orderBy: { createdAt: "desc" } })
      return { categories }
    }
  }),

  create: defineAction({
    accept: "form",
    input: z.object({
      name: z.string({ message: "name is required." }).min(1).max(255)
    }),
    handler: async (input) => {
      await Prisma.category.create({
        data: {
          name: input.name
        }
      })
      return { message: "Category created." }
    }
  }),

  delete: defineAction({
    input: z.object({
      categories: z.array(z.number().positive())
        .nonempty("At least one item must be selected"),
    }),
    handler: async ({ categories }) => {
      const categoriesWithProducts = await Prisma.category.findMany({
        where: {
          id: { in: categories },
          products: { some: {} },
        },
      });

      if (categoriesWithProducts.length > 0) throw new ActionError({
        code: "BAD_REQUEST",
        message: "category have some products exists."
      })

      const deletedCategories = await Prisma.category.deleteMany({
        where: {
          id: { in: categories },
        },
      });
      return {
        message: `${deletedCategories.count} categories deleted.`,
      };
    },
  })
}
