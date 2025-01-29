import { Prisma } from "@/database";
import { CreateSlug } from "@/utils/CreateSlug";
import { faker } from "@faker-js/faker"

async function main() {
  // User seed
  await Prisma.user.createMany({
    data: [{
      username: "user",
      name: "user",
      password: await Bun.password.hash("password", {
        algorithm: "bcrypt",
        cost: 5
      })
    }, {
      username: "admin",
      name: "admin",
      password: await Bun.password.hash("password", {
        algorithm: "bcrypt",
        cost: 5
      })
    }]
  })
  console.log("User seed done.")

  // Table seed
  for (let i = 0; i < 10; i++) {
    await Prisma.table.create({ data: {} })
  }
  console.log("Table seed done.")

  // Category seed
  for (let i = 0; i < 10; i++) {
    let counter = 1
    const name = faker.food.adjective()
    let slug = CreateSlug(name)
    let slugIsExist = await Prisma.category.findUnique({
      where: { slug },
    });

    if (slugIsExist) {
      slug = `${slug}-${counter++}`
      slugIsExist = await Prisma.category.findUnique({
        where: { slug },
      });
    }

    await Prisma.category.create({
      data: {
        name: name,
        slug: slug
      }
    })
  }
  console.log("Category seed done.")

  // Product seed
  for (let i = 0; i < 40; i++) {
    let counter = 1
    let name = faker.food.ingredient()
    let slug = CreateSlug(name)
    let slugIsExist = await Prisma.product.findUnique({
      where: { slug },
    });

    if (slugIsExist) {
      slug = `${slug}-${counter++}`
      slugIsExist = await Prisma.product.findUnique({
        where: { slug },
      });
    }

    const categories = await Prisma.category.findMany({ select: { id: true } });
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    await Prisma.product.create({
      data: {
        categoryId: randomCategory.id,
        name: name,
        image: faker.image.urlLoremFlickr({ category: slug }),
        slug: slug,
        price: faker.number.float({ min: 200000, max: 5000000, fractionDigits: 2 })
      }
    })
  }
  console.log("Product seed done.")

  // Order seed
  for (let i = 0; i < 10; i++) {
    const tables = await Prisma.table.findMany({ select: { id: true } })
    const randomTable = tables[Math.floor(Math.random() * tables.length)];
    const total = faker.number.int({ min: 20000, max: 500000 });

    const order = await Prisma.order.create({
      data: {
        tableId: randomTable.id,
        total: total,
      },
    });

    const products = await Prisma.product.findMany({ take: 5 });

    const orderProducts = products.map((product) => ({
      productId: product.id,
      orderId: order.id,
      quantity: Math.floor(Math.random() * 5) + 1,
    }));

    await Prisma.orderProduct.createMany({
      data: orderProducts,
    });
  }
  console.log("Order seeding done.");
}

main().then(async () => await Prisma.$disconnect()).catch(async err => {
  console.error(err)
  await Prisma.$disconnect()
  process.exit(1)
})
