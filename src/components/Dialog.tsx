import { Dialog as HeadlessDialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { type Dispatch, type SetStateAction } from 'react'
import SecondaryButton from "./SecondaryButton"

export default function Dialog({ isOpen, setIsOpen, onCancel }: { isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>>; onCancel: () => void }) {
  return (
    <HeadlessDialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={() => setIsOpen(false)} >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-lg font-medium text-black">
              Cancel This Order?
            </DialogTitle>
            <p className="text-black">
              This order will be lost.
            </p>

            <div className="mt-3 flex justify-end">
              <SecondaryButton
                onClick={onCancel}>Yes, I cancel this order</SecondaryButton>
            </div>
          </DialogPanel>
        </div>
      </div>
    </HeadlessDialog>
  )
}

