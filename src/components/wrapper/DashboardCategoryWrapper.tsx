import { actions } from "astro:actions"
import { DateFormat } from "@/utils/DateFormat";
import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import type { FormResponseType } from "@/types"
import type { Category } from "@prisma/client";

const DashboardCategoryWrapper = () => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [formResponse, setFormResponse] = useState<FormResponseType>()
  const [categories, setCategories] = useState<Category[] | undefined>()

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const categoryId = +e.target.value;
    if (e.target.checked) {
      setSelectedCategories((prevSelected) => [...prevSelected, categoryId]);
    } else {
      setSelectedCategories((prevSelected) =>
        prevSelected.filter((id) => id !== categoryId)
      );
    }
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { error, data } = await actions.category.delete({ categories: [...selectedCategories] })
    error?.fields ? setFormResponse({ error: error.fields }) : setFormResponse({ error })
    if (data) setFormResponse({ data })
    handlePage()
  }

  const handlePage = async () => {
    const { data } = await actions.category.getAll()
    setCategories(data?.categories);
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
        <div className={`text-sm ${formResponse?.error ? "text-red-400" : "text-green-400"} py-2 font-medium`}>{formResponse?.error?.message || formResponse?.error?.categories?.join(", ") || formResponse?.data?.message}</div>
        <table
          className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-full"
        >
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 w-full">
            <tr>
              <th scope="col" className="px-6 py-3">
                <button className="text-red-400 uppercase hover:underline" type="submit"> Delete </button>
              </th>
              <th scope="col" className="px-6 py-3"> Name </th>
              <th scope="col" className="px-6 py-3"> Created at </th>
            </tr>
          </thead>
          <tbody>
            {
              categories?.map((category) => (
                <tr className="bg-white -b dark:bg-gray-800 dark:-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={category.id}>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <input type="checkbox" value={category.id} onChange={handleCheckboxChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {category.name}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {DateFormat(category.createdAt)}
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

export default DashboardCategoryWrapper
