import { DateTime } from 'luxon'
import * as SC from './TimeLineHeader.styled'
import { getDatesBetween } from '../../utils/helpers'
import { useConfigStore } from '../../Store'

type TimeLineDateRangeProps = {
  startDate: Date
  endDate: Date
}

const normalizeRanges = <T = unknown,>(visibleRange: T[], rawRange: T[]) => {
  if (rawRange.length > 3) {
    return [...visibleRange.slice(0, -1), rawRange.at(-1) as T]
  }

  return rawRange
}

export default function TimeLineDateRange({ startDate, endDate }: TimeLineDateRangeProps) {
  const config = useConfigStore((state) => state.config)

  const { columnWidth } = config

  const taskDays = getDatesBetween({ startDate, endDate, includeEndDate: false })

  const taskDaysLength = taskDays.length
  const coefficient = Math.max(Math.round(24 / columnWidth), 1)

  const visibleTaskDays =
    taskDaysLength > 2
      ? getDatesBetween({
          startDate,
          endDate,
          includeEndDate: false,
          splitByValue: { days: coefficient },
        })
      : taskDays

  const daysFromStart = getDatesBetween({
    startDate: config.startDate as Date,
    endDate: startDate,
    includeEndDate: false,
  }).length

  const normalizedTaskDays = normalizeRanges<Date>(visibleTaskDays, taskDays)

  function renderDay(day: Date) {
    // const isCompact = columnWidth < 15
    // const isHidden = isCompact && index !== taskDaysLength - 1 && !!(index % 2)

    return <p key={day.toString()}>{DateTime.fromJSDate(day).day}</p>
  }

  return (
    <SC.TimeLineDateRange daysFromStart={daysFromStart} columnWidth={columnWidth || 36}>
      <SC.TimeLineDaysWrapper
        columnWidth={columnWidth || 36}
        columnCount={taskDaysLength}
        normalizedCount={normalizedTaskDays.length}
      >
        {normalizedTaskDays.map(renderDay)}
        <SC.TimeLineDaysInfo>
          <div>{DateTime.fromJSDate(startDate).toFormat('LLL.')}</div>
          {taskDaysLength > 1 && (
            <>
              {taskDaysLength > 2 && <div>{taskDaysLength}</div>}
              <div>{taskDaysLength > 2 ? DateTime.fromJSDate(endDate).toFormat('LLL.') : taskDaysLength}</div>
            </>
          )}
        </SC.TimeLineDaysInfo>
      </SC.TimeLineDaysWrapper>
    </SC.TimeLineDateRange>
  )
}
