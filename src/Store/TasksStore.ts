import { ITask } from '../types'
import { create } from 'zustand'
import { getDatesBetween, getTemplatedTask } from '../utils/helpers'
import { useConfigStore } from './index'
import useDomStore from './DomStore'

type TasksStore = {
  tasks: ITask[]
  visibleTasks: ITask[]
  interaction: Record<
    string,
    {
      expanded?: boolean
      isLoading?: boolean
      parentId?: string
      sortOrder: number
    }
  >
  setTasks: (tasks: ITask[]) => void
  setVisibleTasks: (tasks: ITask[]) => void
  addTask: (
    task: Partial<ITask>,
    options?: {
      sourceId?: string
      position?: 'before' | 'after'
    },
  ) => void
  updateTask: (task: ITask) => void
  deleteTask: (id: string) => void
  scrollToTask: (date?: Date | string) => void
  toggleCollapse: (id: string, value?: boolean) => void
  toggleLoading: (id: string, value?: boolean) => void
  onStatusChange: (checked: boolean, id: string) => void
  onTaskDateChange: (id: string, newDates: { startDate?: Date | string; endDate?: Date | string }) => void
  onSubtaskCreate: (id: string) => void
  onSubtaskPromote: (id: string) => void
  getSubTasks: (ids: string[]) => ITask[]
  version: number
  invalidateVersion: () => void
}

const useTasksStore = create<TasksStore>()((set) => ({
  tasks: [],
  visibleTasks: [],
  interaction: {},
  setTasks: (tasks) =>
    set(({ interaction }) => {
      const updatedInteraction: TasksStore['interaction'] = {}

      tasks.forEach(({ id, parentTaskId, sortOrder }) => {
        updatedInteraction[id] = {
          ...interaction[id],
          expanded: interaction[id]?.expanded ?? false,
          parentId: parentTaskId,
          sortOrder,
        }
      })

      return {
        tasks,
        interaction: updatedInteraction,
      }
    }),
  setVisibleTasks: (tasks) => set({ visibleTasks: tasks }),
  addTask: (taskData, options) =>
    set(({ tasks }) => {
      const { sourceId, position = 'after' } = options ?? {}
      const newTask = taskData

      if (sourceId) {
        const sourceTask = tasks.find((t) => t.id === sourceId)

        if (sourceTask) {
          newTask.sortOrder = position === 'before' ? sourceTask.sortOrder : sourceTask.sortOrder + 1
        }
      }

      const task = getTemplatedTask(newTask)

      if (typeof newTask.sortOrder === 'number') {
        const normalizedTasks: ITask[] = []

        tasks.forEach((t) => {
          if (t.sortOrder < newTask.sortOrder!) {
            return normalizedTasks.push(t)
          }

          if (t.sortOrder === newTask.sortOrder) {
            normalizedTasks.push(task)
          }

          return normalizedTasks.push({ ...t, sortOrder: t.sortOrder + 1 })
        })

        return {
          tasks: normalizedTasks,
        }
      }

      return {
        tasks: [...tasks, task],
      }
    }),
  updateTask: (task) =>
    set(({ tasks }) => ({
      tasks: tasks.map((t) => (t.id === task.id ? task : t)),
    })),
  deleteTask: (id) =>
    set(({ tasks }) => ({
      tasks: tasks.filter((t) => t.id !== id),
    })),
  scrollToTask: (date) => {
    const scrollDate = date || new Date()

    const config = useConfigStore.getState().config
    const diff = getDatesBetween({ startDate: config.startDate, endDate: scrollDate }).length
    const gridNode = document.querySelector('#react-ganttalf-grid')
    const scrollLeft = diff * config.columnWidth - (gridNode?.clientWidth ?? 350) - 80

    const wrapperNode = useDomStore.getState().wrapperNode
    wrapperNode?.scrollTo(scrollLeft, wrapperNode.scrollTop)
  },
  toggleCollapse: (id, value) =>
    set(({ interaction }) => {
      return {
        interaction: {
          ...interaction,
          [id]: {
            ...interaction[id],
            expanded: typeof value === 'boolean' ? value : !interaction[id]?.expanded,
          },
        },
      }
    }),
  toggleLoading: (id, value) =>
    set(({ interaction }) => {
      return {
        interaction: {
          ...interaction,
          [id]: {
            ...interaction[id],
            isLoading: typeof value === 'boolean' ? value : !interaction[id]?.isLoading,
          },
        },
      }
    }),
  onStatusChange: (checked, id) =>
    set(({ tasks }) => {
      return {
        tasks: tasks.map((t) => {
          if (t.id === id) {
            return { ...t, status: checked ? 1 : 0 }
          }

          return t
        }),
      }
    }),
  onTaskDateChange: (id, newDates) =>
    set(({ tasks }) => {
      return {
        tasks: tasks.map((t) => {
          if (t.id === id) {
            return { ...t, startDate: newDates.startDate, endDate: newDates.endDate }
          }

          return t
        }),
      }
    }),
  onSubtaskCreate: (id) =>
    set(({ tasks }) => {
      const currentTaskIndex = tasks.findIndex((task) => task.id === id)

      const parentTask = tasks[currentTaskIndex - 1]

      const parentTaskId = parentTask?.predecessors?.[0]

      return {
        tasks: tasks.map((t) => {
          if (t.id === parentTaskId) {
            return { ...t, subTaskIds: [...(t.subTaskIds ?? []), id] }
          }

          return t
        }),
      }
    }),
  onSubtaskPromote: () => null,
  getSubTasks: (ids: string[]) => {
    const { tasks } = useTasksStore.getState() as { tasks: ITask[] }

    return tasks.filter((task: ITask) => ids.includes(task.id))
  },
  version: 0,
  invalidateVersion: () => set((store) => ({ version: store.version + 1 })),
}))

export default useTasksStore
