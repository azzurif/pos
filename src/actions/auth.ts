import { Prisma } from "@/database";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema"
import bcrypt from "bcrypt"

export const auth = {
  //register
  register: defineAction({
    accept: "form",
    input: z.object({
      username: z.string().min(5).max(100),
      password: z.string().min(8).max(100),
      name: z.string().min(1).max(100),
    }),
    handler: async (input, ctx) => {
      //check existing user
      const totalUserSameUsername = await Prisma.user.count({
        where: {
          username: input.username
        }
      })

      if (totalUserSameUsername != 0) {
        throw new ActionError({
          code: "CONFLICT",
          message: "Username already exist."
        })
      }

      //hash password
      input.password = await bcrypt.hash(input.password, 10);
      const user = await Prisma.user.create({
        data: input
      })
      //set the created user to cookie
      ctx.cookies.set("user", JSON.stringify({ user: user.id }), {
        httpOnly: true,
        maxAge: 60 * 60 * 10,
        sameSite: "lax"
      })

      return {
        message: "User created."
      }
    }
  }),
  //login
  login: defineAction({
    accept: "form",
    input: z.object({
      username: z.string().min(5).max(100),
      password: z.string().min(8).max(100),
    }),
    handler: async (input, ctx) => {
      const user = await Prisma.user.findUnique({
        where: {
          username: input.username
        }
      })

      //check mathing records
      if (!user) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "Username or password is wrong."
        })
      }

      const isPasswordValid = await bcrypt.compare(input.password, user.password)
      if (!isPasswordValid) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "Username or password is wrong."
        })
      }
      //set user to cookis
      ctx.cookies.set("user", JSON.stringify({ user: user.id }), {
        httpOnly: true,
        maxAge: 60 * 60 * 10,
        sameSite: "lax"
      })

      return {
        user,
        message: "Login."
      }
    }
  }),
  logout: defineAction({
    handler: async (_, ctx) => {
      ctx.cookies.delete("user", { path: "/" })

      return {
        message: "logged out."
      }
    }
  })
}
