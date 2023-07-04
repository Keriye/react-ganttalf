import { DateMarking, TimeLineHeaderContainer } from './TimeLineHeader.styled'
import { useEffect, useState } from 'react'

import { DateTime } from 'luxon'
import { getDatesBetween } from '../../utils/helpers'
import { useConfigStore } from '../../Store'

interface ITimeLineHeaderProps {
  startDate: Date
  endDate: Date
}

function TimeLineHeader({ startDate, endDate }: ITimeLineHeaderProps) {
  const config = useConfigStore((state) => state.config)

  const [days, setDays] = useState<Date[] | null>(null)

  const { columnWidth } = config

  useEffect(() => {
    if (startDate && endDate) {
      const _days = getDatesBetween({ startDate, endDate })

      setDays(_days)
    }
  }, [endDate, startDate])

  function renderDates() {
    if (!days) return null

    return days.map((day, index) => {
      if (day.getDay() !== 1) return null

      const date = new Date(day)
      const dateString = DateTime.fromJSDate(date).toFormat('LLL. dd')

      return (
        <DateMarking id='sadadsasd' index={index} columnWidth={columnWidth || 36} key={dateString}>
          {dateString}
        </DateMarking>
      )
    })
  }

  return <TimeLineHeaderContainer id='time-line-header-container'>{renderDates()}</TimeLineHeaderContainer>
}

export default TimeLineHeader
