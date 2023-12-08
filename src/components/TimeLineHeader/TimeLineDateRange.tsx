import { DateTime } from 'luxon'
import * as SC from './TimeLineHeader.styled'
import { getDatesBetween } from '../../utils/helpers'
import { useConfigStore } from '../../Store'

type TimeLineDateRangeProps = {
  startDate: Date
  endDate: Date
}

const ESTIMATED_WIDTH = 24
const DEFAULT_COLUMN_WIDTH = 36

export default function TimeLineDateRange({ startDate, endDate }: TimeLineDateRangeProps) {
  const config = useConfigStore((state) => state.config)

  const { columnWidth = DEFAULT_COLUMN_WIDTH } = config

  const taskDays = getDatesBetween({ startDate, endDate, includeEndDate: false })

  const taskDaysLength = taskDays.length
  const taskWorkingDaysLength = taskDays.filter((day) => ![6, 7].includes(DateTime.fromJSDate(day).weekday)).length
  let coefficient = Math.max(Math.round(ESTIMATED_WIDTH / columnWidth), 1)
  let visibleCount = taskDaysLength

  if (taskDaysLength * columnWidth < 30) {
    visibleCount = taskDaysLength === 1 ? 1 : 2
    coefficient = taskDaysLength
  } else if (coefficient !== 1 && taskDaysLength > 2) {
    const availableSpace = Math.max(taskDaysLength * columnWidth - ESTIMATED_WIDTH * 2, 0)
    const availableAmount = Math.floor(availableSpace / ESTIMATED_WIDTH)
    if (availableAmount) {
      visibleCount = 2 + availableAmount
      coefficient = Math.floor((taskDaysLength - 2) / availableAmount)
    }
  }

  const daysFromStart = getDatesBetween({
    startDate: config.startDate as Date,
    endDate: startDate,
    includeEndDate: false,
  }).length

  return (
    <SC.TimeLineDateRange daysFromStart={daysFromStart} columnWidth={columnWidth}>
      <SC.TimeLineDaysWrapper
        columnWidth={columnWidth}
        columnCount={taskDaysLength}
        visibleCount={visibleCount}
        coefficient={coefficient}
      >
        {taskDays.map((day) => (
          <p key={day.toString()}>{DateTime.fromJSDate(day).day}</p>
        ))}
        <SC.TimeLineDaysInfo>
          <div>
            <div>{DateTime.fromJSDate(startDate).toFormat('LLL.')}</div>
            {taskDaysLength > 1 && (
              <>
                {taskDaysLength > 2 && <div>{taskWorkingDaysLength}</div>}
                <div>{taskDaysLength > 2 ? DateTime.fromJSDate(endDate).toFormat('LLL.') : taskDaysLength}</div>
              </>
            )}
          </div>
        </SC.TimeLineDaysInfo>
      </SC.TimeLineDaysWrapper>
    </SC.TimeLineDateRange>
  )
}
