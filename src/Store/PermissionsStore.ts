import { IGanttChartPermissions } from '../types'
import { create } from 'zustand'

interface IPermissionsState {
  permissions: IGanttChartPermissions
  setPermissions: (permissions: IGanttChartPermissions) => void
}

const defaultPermissions: IGanttChartPermissions = {
  canCreateTask: true,
  canCreateLink: true,
  canUpdateTaskDates: true,
}

const usePermissionsStore = create<IPermissionsState>()((set) => ({
  permissions: defaultPermissions,
  setPermissions: (permissions: Partial<IGanttChartPermissions>) =>
    set(() => ({ permissions: { ...defaultPermissions, ...permissions } })),
}))

export default usePermissionsStore
