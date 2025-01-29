import { defineMiddleware } from "astro:middleware";
import { Prisma } from "./database";

export const onRequest = defineMiddleware(async ({ cookies, redirect, url }, next) => {
  const tokenSearch = url.searchParams.get("table")
  if (url.pathname === "/" && tokenSearch) {
    const tokenData = await Prisma.table.findFirst({
      where: {
        code: tokenSearch
      },
      select: {
        id: true,
        code: true
      }
    })
    if (tokenSearch === tokenData?.code) {
      cookies.set("table", JSON.stringify(tokenData), {
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
      })
      return redirect("/order")
    }
  }

  const userCookie = cookies.get("user")
  if (userCookie && (url.pathname === "/login" || url.pathname === "/register")) {
    return redirect("/dashboard");
  }

  if (!userCookie && url.pathname.startsWith("/dashboard")) {
    return redirect("/login");
  }

  return next()
})
