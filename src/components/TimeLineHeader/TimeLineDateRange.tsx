import { DateTime } from 'luxon'
import { TimeLineDateRangeStyled } from './TimeLineHeader.styled'
import { getDatesBetween } from '../../utils/helpers'
import { useConfigStore } from '../../Store'

interface ITimeLineDateRangeProps {
  startDate: Date
  endDate: Date
}

export default function TimeLineDateRange({ startDate, endDate }: ITimeLineDateRangeProps) {
  const config = useConfigStore((state) => state.config)

  const { columnWidth } = config

  const taskDays = getDatesBetween({ startDate, endDate })

  const daysFromStart = getDatesBetween({
    startDate: config.startDate as Date,
    endDate: startDate,
    includeStartDate: false,
  }).length

  function renderDay(day: Date, index: number) {
    let classNames = 'c-row-timeline-day'

    if (index === 0) {
      classNames += ' c-row-timeline-day-start'
    } else if (index === taskDays.length - 1) {
      classNames += ' c-row-timeline-day-end'
    }

    return (
      <div key={DateTime.fromJSDate(day).day} className={classNames}>
        {DateTime.fromJSDate(day).day}
      </div>
    )
  }

  return (
    <TimeLineDateRangeStyled daysFromStart={daysFromStart} columnWidth={columnWidth || 36}>
      <div className='c-row-timeline-range'>
        <div>{DateTime.fromJSDate(startDate).toFormat('LLL.')}</div>
        {taskDays.length > 1 && (
          <>
            {taskDays.length > 2 && <div>{taskDays.length}</div>}
            <div>{taskDays.length > 2 ? DateTime.fromJSDate(endDate).toFormat('LLL.') : taskDays.length}</div>
          </>
        )}
      </div>
      <div className='c-row-timeline-days'>{taskDays.map(renderDay)}</div>
    </TimeLineDateRangeStyled>
  )
}
