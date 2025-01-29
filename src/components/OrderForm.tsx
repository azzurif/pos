import { useState, type FormEvent } from 'react';
import { actions } from 'astro:actions';
import { useOrder } from '@/hooks/useOrder';
import { RupiahFormat } from "@/utils/RupiahFormat"
import PrimaryButton from './PrimaryButton'
import ProductOrderCard from "@/components/ProductOrderCard"
import Dialog from './Dialog';
import Spinner from './Spinner';

const OrderForm = () => {
  const [order] = useOrder()
  const [loading, setLoading] = useState(false)
  const [formResponse, setFormResponse] = useState<FormResponseType>()
  const [openDialog, setOpenDialog] = useState(false)

  const handleCancel = () => {
    window.dispatchEvent(
      new CustomEvent("orderUpdated", { detail: { products: [], total: 0 } }),
    );
    window.localStorage.removeItem("order")
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await actions.order.midtrans({ ...order })
    if (error) {
      setLoading(false)
      setFormResponse({ error })
      setTimeout(() => setFormResponse(), 5000);
      return
    }
    window.snap.pay(data.token, {
      onSuccess: () => {
        const createOrder = async () => {
          const { data: orderData, error } = await actions.order.create({ ...order, orderId: data.orderId })
          if (error) {
            setFormResponse({ error })
            return
          }
          setFormResponse({ data: orderData.message })
        }
        createOrder();
        setLoading(false)
        handleCancel()
      },
      onClose: () => {
        handleCancel()
        setLoading(false)
        return
      },
      onError: () => {
        const deleteOrder = async () => {
          await actions.order.delete({ orderId: data.orderId })
        }
        deleteOrder()
      }
    })
  }

  return (
    <form className="flex flex-col grow gap-2 space-y-2 overflow-y-auto mt-3" onSubmit={submit}>

      {formResponse &&
        <div className={`text-sm ${formResponse?.error ? "text-red-400" : "text-green-400"} font-medium`}>{formResponse?.error?.message || formResponse?.error?.products?.join(", ") || formResponse?.data?.message}</div>
      }

      <div className="grow gap-2 space-y-2 overflow-y-auto">
        {
          order.products.length > 0 ?
            order.products.map((product, key) => (
              <ProductOrderCard product={product} order={order} key={key} />
            ))
            :
            <div
              className="rounded-md bg-gray-100 text-sm h-[4.5rem] text-gray-500 flex items-center justify-center border border-gray-400 border-dashed min-h-[4.5rem]"
            >
              No menus added.
            </div>
        }
      </div>

      <div
        className="flex items-center justify-between font-medium bg-gray-100 rounded-lg p-2"
      >
        <p>Total</p>
        <p>{RupiahFormat(order.total)}</p>
      </div>

      <div className="flex gap-2 font-medium">
        <button
          type="button"
          className="rounded-md text-center bg-gray-100 text-red-600 grow py-2"
          onClick={() => setOpenDialog(true)}
          disabled={order.total === 0 || loading}
        >
          Cancel
        </button>
        <PrimaryButton
          disabled={order.total === 0 || loading}
          className="rounded-md bg-blue-500 text-white grow py-2 flex justify-center"
        >
          {loading ? <Spinner /> : "Order"}
        </PrimaryButton>
      </div>

      {
        openDialog ?
          <Dialog isOpen={openDialog} setIsOpen={setOpenDialog} onCancel={() => { handleCancel(); setOpenDialog(false) }} /> : null
      }
    </form>
  );
};

export default OrderForm
