import type { Product, Category } from '@prisma/client'
import ProductCard from '../ProductCard'
import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer";

const ProductsWrapper = ({ slug, like }: { slug?: string, like?: string }) => {
  const { ref, inView } = useInView({})
  const [products, setProducts] = useState<(Product & { category: Category })[]>([])
  const [nextCursor, setNextCursor] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const query = [
        slug ? `category=${slug}` : null,
        nextCursor ? `lastCursor=${nextCursor}` : null,
        like ? `like=${encodeURIComponent(like)}` : null
      ]
        .filter(Boolean)
        .join("&");

      const response = await fetch(`/api/products?${query}`);
      if (!response.ok) return

      const res = await response.json()
      setProducts([...products, ...res.products])
      setNextCursor(res.nextCursor)
    }

    if (inView && typeof nextCursor === "string") {
      fetchData()
    }
  }, [inView])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {
        products.map((product, key) => (
          <ProductCard
            key={key}
            product={product}
          />
        ))
      }
      <div ref={ref}></div>
    </div>
  )
}

export default ProductsWrapper
