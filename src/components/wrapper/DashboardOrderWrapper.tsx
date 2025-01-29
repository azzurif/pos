import { DateFormat } from "@/utils/DateFormat";
import { RupiahFormat } from "@/utils/RupiahFormat";
import { useState, useEffect } from "react";
import type { Order, Table } from "@prisma/client";
import { actions } from "astro:actions";

const DashboardOrderWrapper = () => {
  const [orders, setOrders] = useState<(Order & { table: Table })[] | undefined>([])

  const handlePage = async () => {
    const { data } = await actions.order.getAll()
    setOrders(data?.orders)
  }

  useEffect(() => {
    handlePage()
  }, [])

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-2">
        <table
          className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-full"
        >
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3"> Date </th>
              <th scope="col" className="px-6 py-3"> Table </th>
              <th scope="col" className="px-6 py-3"> Total Price </th>
            </tr>
          </thead>
          <tbody>
            {
              orders?.map((order) => (
                <tr
                  className="bg-white dark:bg-gray-800 dark:-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                  key={order.id}
                // onClick={() => alert("heii")}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {DateFormat(order.createdAt)}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {order.tableId}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {RupiahFormat(order.total)}{" "}
                  </th>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default DashboardOrderWrapper
