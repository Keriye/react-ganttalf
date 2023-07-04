import { DateTime, DurationLikeObject, Interval } from 'luxon'

import { ITask } from '../types'

export function findParentTask(givenTask: ITask, tasks: ITask[]): ITask | undefined {
  return tasks.find((task) => {
    return task.subTaskIds?.includes(givenTask.id)
  })
}

export function getAllSubTasks(task: ITask, tasks: ITask[]): ITask[] {
  const subTasks: ITask[] = []

  if (!task.subTaskIds) return subTasks

  task.subTaskIds.forEach((subTaskId) => {
    const subTask = tasks.find((task) => task.id === subTaskId)

    if (subTask) {
      subTasks.push(subTask)

      if (subTask.subTaskIds && subTask.subTaskIds.length > 0) {
        subTasks.push(...getAllSubTasks(subTask, tasks))
      }
    }
  })

  return subTasks
}

export function getDatesBetween({
  startDate,
  endDate,
  includeStartDate = true,
  includeEndDate = true,
}: {
  startDate?: Date | string
  endDate?: Date | string
  includeStartDate?: boolean
  includeEndDate?: boolean
}): Date[] {
  if (!startDate || !endDate) return []

  let start = DateTime.fromJSDate(new Date(startDate)).startOf('day')

  if (!includeStartDate) {
    start = start.plus({ days: 1 })
  }

  let end = DateTime.fromJSDate(new Date(endDate)).startOf('day')

  if (includeEndDate) {
    end = end.plus({ days: 1 })
  }

  const dateInterval = Interval.fromDateTimes(start, end)

  // create an array of days between start and end date
  return dateInterval.splitBy({ days: 1 }).map(({ start }) => start?.toJSDate() as Date)
}

export function addDateTime(date: Date, { days = 0, hours = 0, minutes = 0 }: DurationLikeObject): Date {
  return DateTime.fromJSDate(date)
    .plus({
      days,
      hours,
      minutes,
    })
    .toJSDate()
}

export function areDatesEqual(date1: Date, date2: Date): boolean {
  return DateTime.fromJSDate(date1).toISODate() === DateTime.fromJSDate(date2).toISODate()
}
