import { create } from 'zustand'

type DomState = {
  wrapperNode: HTMLDivElement | null
  setWrapperNode: (node: DomState['wrapperNode']) => void
  gridNode: HTMLDivElement | null
  setGridNode: (node: DomState['gridNode']) => void
  headerNode: HTMLDivElement | null
  setHeaderNode: (node: DomState['headerNode']) => void
  modalNode: HTMLDivElement | null
  setModalNode: (node: DomState['modalNode']) => void
  modalShift: { left?: number; right?: number; top?: number; bottom?: number }
}

const useDomStore = create<DomState>()((set) => ({
  wrapperNode: null,
  setWrapperNode: (node: HTMLDivElement | null) => set({ wrapperNode: node }),
  gridNode: null,
  setGridNode: (node: HTMLDivElement | null) => set({ gridNode: node }),
  headerNode: null,
  setHeaderNode: (node: HTMLDivElement | null) => set({ headerNode: node }),
  modalNode: null,
  setModalNode: (node: HTMLDivElement | null) => set({ modalNode: node }),
  modalShift: {
    left: 0,
    top: 0,
  },
}))

export default useDomStore
