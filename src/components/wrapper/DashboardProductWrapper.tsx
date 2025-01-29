import { actions } from "astro:actions"
import { RupiahFormat } from "@/utils/RupiahFormat";
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import type { Product, Category } from "@prisma/client";
import type { FormResponseType } from "@/types";

const DashboardProductWrapper = () => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [products, setProducts] = useState<(Product & { category: Category })[] | undefined>([])
  const [formResponse, setFormResponse] = useState<FormResponseType>()

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const productId = +e.target.value;
    if (e.target.checked) {
      setSelectedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((id) => id !== productId)
      );
    }
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { error, data } = await actions.product.delete({ products: [...selectedProducts] })
    error?.fields ? setFormResponse({ error: error.fields }) : setFormResponse({ error })
    if (data) setFormResponse({ data })
    setSelectedProducts([])
    handlePage()
  }

  const handlePage = async () => {
    const { data } = await actions.product.getAll()
    setProducts(data?.products);
  };

  useEffect(() => {
    handlePage()
  }, [])
  useEffect(() => {
    const timeOut = setTimeout(() => setFormResponse(undefined), 5000)

    return () => clearTimeout(timeOut)
  }, [formResponse])

  return (
    <>
      <form
        onSubmit={submit}
        className="relative overflow-x-auto shadow-md sm:rounded-lg mb-2"
      >
        <div className={`text-sm ${formResponse?.error ? "text-red-400" : "text-green-400"} py-2 font-medium`}>{formResponse?.error?.message || formResponse?.error?.products?.join(", ") || formResponse?.data?.message}</div>
        <table
          className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-full"
        >
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">
                <button className="text-red-400 uppercase hover:underline" type="submit"> Delete </button>
              </th>
              <th scope="col" className="px-6 py-3"> Category </th>
              <th scope="col" className="px-6 py-3"> Name </th>
              <th scope="col" className="px-6 py-3"> Price </th>
            </tr>
          </thead>
          <tbody>
            {
              products?.map((product) => (
                <tr className={`bg-white -b hover:bg-gray-50 ${product.deletedAt && "text-sky-400"}`} key={product.id}>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <input type="checkbox" value={product.id} onChange={handleCheckboxChange} disabled={product.deletedAt} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {product.category.name}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {product.name} - {product.id}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {RupiahFormat(product.price)}
                  </th>
                </tr>
              ))
            }
          </tbody>
        </table>
      </form>
    </>
  )
}

export default DashboardProductWrapper
