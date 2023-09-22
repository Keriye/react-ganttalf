import { ITask } from '../types'
import { create } from 'zustand'
import { getTemplatedTask } from '../utils/helpers'

interface ITasksState {
  tasks: ITask[]
  setTasks: (tasks: ITask[]) => void
  addTask: (
    task: Partial<ITask>,
    options?: {
      sourceId?: string
      position?: 'before' | 'after'
    },
  ) => void
  updateTask: (task: ITask) => void
  deleteTask: (id: string) => void
  toggleCollapse: (id: string) => void
  onStatusChange: (checked: boolean, id: string) => void
  onTaskDateChange: (id: string, newDates: { startDate?: Date | string; endDate?: Date | string }) => void
  onSubtaskCreate: (id: string) => void
  onSubtaskPromote: (id: string) => void
}

const useTasksStore = create<ITasksState>()((set) => ({
  tasks: [],
  setTasks: (tasks) => set(() => ({ tasks })),
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
  toggleCollapse: (id) =>
    set(({ tasks }) => {
      return {
        tasks: tasks.map((t) => {
          if (t.id === id) {
            return { ...t, collapsed: !t.collapsed }
          }

          return t
        }),
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
}))

export default useTasksStore
