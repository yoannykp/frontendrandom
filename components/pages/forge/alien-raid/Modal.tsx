import { Fragment } from "react"
import { InventoryItem } from "@/types"
import { Dialog, Transition } from "@headlessui/react"

import AlienRaid from "."

interface AlienRaidModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (item: InventoryItem) => void
  isPortal2?: boolean
}

const AlienRaidModal = ({
  isOpen,
  onClose,
  onSelect,
  isPortal2,
}: AlienRaidModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/90" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden transition-all">
                <AlienRaid onSelect={onSelect} isPortal2={isPortal2} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default AlienRaidModal
