import { create } from 'zustand'
import { VirtualItem } from '@tanstack/react-virtual'

export type VirtualizationStore = {
  isActive: boolean
  totalHeight: number
  virtualItems?: VirtualItem[]
  setVirtualData: (data: { items: VirtualItem[]; totalHeight?: number }) => void
}

const useVirtualizationStore = create<VirtualizationStore>()((set) => ({
  isActive: true,
  totalHeight: 0,
  virtualItems: undefined,
  setVirtualData: ({ items, totalHeight }) =>
    set((state) => {
      const currentItems = state.virtualItems
      const currentStart = currentItems?.[0]?.start ?? 0
      const currentEnd = currentItems?.at(-1)?.start ?? 0
      const start = items?.[0]?.start ?? 0
      const end = items?.at(-1)?.start ?? 0

      if (currentStart !== start || currentEnd !== end || currentItems?.length !== items?.length) {
        return {
          virtualItems: items,
          totalHeight: totalHeight,
        }
      }

      return {}
    }),
}))

export default useVirtualizationStore
