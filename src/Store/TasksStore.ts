import { ITask } from '../types'
import { create } from 'zustand'

interface ITasksState {
  tasks: ITask[]
  setTasks: (tasks: ITask[]) => void
  addTask: (task: ITask) => void
  updateTask: (task: ITask) => void
  deleteTask: (id: string) => void
  toggleCollapse: (id: string) => void
  onStatusChange: (checked: boolean, id: string) => void
  onTaskDateChange: (id: string, newDates: { startDate?: Date | string; endDate?: Date | string }) => void
}

const useTasksStore = create<ITasksState>()((set) => ({
  tasks: [],
  setTasks: (tasks) => set(() => ({ tasks })),
  addTask: (task) => set(({ tasks }) => ({ tasks: [...tasks, task] })),
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
}))

export default useTasksStore
