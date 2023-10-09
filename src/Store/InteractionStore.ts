import { create } from 'zustand'

export type InteractionStore = {
  sourceId?: string
  setSourceId: (id: string) => void
}

const useInteractionStore = create<InteractionStore>()((set) => ({
  setSourceId: (id) => set({ sourceId: id }),
}))

export default useInteractionStore
