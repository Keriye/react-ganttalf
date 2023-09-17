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
    set((state) => ({ virtualItems: items, totalHeight: totalHeight ?? state.totalHeight })),
}))

export default useVirtualizationStore
