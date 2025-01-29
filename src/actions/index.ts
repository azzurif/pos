// define all action
import { order } from "./order";
import { product } from "./product"
import { auth } from "./auth"
import { category } from "./category";

export const server = {
  category,
  order,
  product,
  auth,
}
