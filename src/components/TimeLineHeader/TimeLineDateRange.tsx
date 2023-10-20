import { DateTime } from 'luxon'
import * as SC from './TimeLineHeader.styled'
import { getDatesBetween } from '../../utils/helpers'
import { useConfigStore } from '../../Store'

type TimeLineDateRangeProps = {
  startDate: Date
  endDate: Date
}

export default function TimeLineDateRange({ startDate, endDate }: TimeLineDateRangeProps) {
  const config = useConfigStore((state) => state.config)

  const { columnWidth } = config

  const taskDays = getDatesBetween({ startDate, endDate, includeEndDate: false })

  const daysFromStart = getDatesBetween({
    startDate: config.startDate as Date,
    endDate: startDate,
    includeEndDate: false,
  }).length

  function renderDay(day: Date, index: number) {
    const isCompact = columnWidth < 15
    const isHidden = isCompact && index !== taskDays.length - 1 && !!(index % 2)

    return <p key={day.toString()}>{!isHidden && DateTime.fromJSDate(day).day}</p>
  }

  return (
    <SC.TimeLineDateRange daysFromStart={daysFromStart} columnWidth={columnWidth || 36}>
      <SC.TimeLineDaysWrapper columnWidth={columnWidth || 36} columnCount={taskDays.length}>
        {taskDays.map(renderDay)}
        <SC.TimeLineDaysInfo>
          <div>{DateTime.fromJSDate(startDate).toFormat('LLL.')}</div>
          {taskDays.length > 1 && (
            <>
              {taskDays.length > 2 && <div>{taskDays.length}</div>}
              <div>{taskDays.length > 2 ? DateTime.fromJSDate(endDate).toFormat('LLL.') : taskDays.length}</div>
            </>
          )}
        </SC.TimeLineDaysInfo>
      </SC.TimeLineDaysWrapper>
    </SC.TimeLineDateRange>
  )
}
