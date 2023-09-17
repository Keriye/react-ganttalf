import { create } from 'zustand'

type DomState = {
  wrapperNode: HTMLDivElement | null
  setWrapperNode: (node: DomState['wrapperNode']) => void
  gridNode: HTMLDivElement | null
  setGridNode: (node: DomState['gridNode']) => void
  modalNode: HTMLDivElement | null
  setModalNode: (node: DomState['modalNode']) => void
  modalShift: [number, number]
}

const useDomStore = create<DomState>()((set) => ({
  wrapperNode: null,
  setWrapperNode: (node: HTMLDivElement | null) => set({ wrapperNode: node }),
  gridNode: null,
  setGridNode: (node: HTMLDivElement | null) => set({ gridNode: node }),
  modalNode: null,
  setModalNode: (node: HTMLDivElement | null) => set({ modalNode: node }),
  modalShift: [0, 0],
}))

export default useDomStore
