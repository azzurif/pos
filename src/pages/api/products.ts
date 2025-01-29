
import { Prisma } from "@/database";
import type { APIRoute } from "astro";
import { decode, encode } from "@/utils/Code";

export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get("category");
  const take = url.searchParams.get("take") || 15;
  const lastCursor = url.searchParams.get("lastCursor");
  const like = url.searchParams.get("like");

  const cursor = lastCursor ? decode(lastCursor) : undefined;

  const products = await Prisma.product.findMany({
    include: {
      category: true,
    },
    ...(like
      ? {}
      : {
        take: +take,
        ...(cursor && {
          skip: 1,
          cursor: {
            id: cursor.id,
          },
        }),
      }),
    where: {
      ...(like
        ? {
          name: {
            contains: like,
          },
        }
        : {
          ...(slug && {
            category: {
              slug: slug,
            },
          }),
        }),
      deletedAt: null,
    },
    orderBy: {
      id: "desc"
    },
  });

  const nextCursor = products.length < +take ? null : encode(JSON.stringify(products[products.length - 1]));

  return new Response(
    JSON.stringify({
      products: products,
      nextCursor,
    }),
    { status: 200 }
  );
};

