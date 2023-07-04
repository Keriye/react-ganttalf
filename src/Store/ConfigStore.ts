import { IConfig } from '../types'
import { create } from 'zustand'

interface IConfigState {
  config: IConfig
  setConfig: (config: IConfig) => void
}

const useConfigStore = create<IConfigState>()((set) => ({
  config: {
    columnWidth: 36,
    // enddate is 7 days from now
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    rowHeight: 40,
    startDate: new Date(),
    timeLineHeight: 50,
  },
  setConfig: (config) => set(() => ({ config })),
}))

export default useConfigStore
