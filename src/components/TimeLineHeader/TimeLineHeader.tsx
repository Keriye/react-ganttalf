import * as SC from './TimeLineHeader.styled'

import { DateTime } from 'luxon'
import { useConfigStore } from '../../Store'

type TimeLineHeaderProps = {
  // startDate: Date
  // endDate: Date
  days: Date[] | null
}

function TimeLineHeader({ days }: TimeLineHeaderProps) {
  const config = useConfigStore((state) => state.config)

  // const [days, setDays] = useState<Date[] | null>(null)

  const { columnWidth } = config

  // useEffect(() => {
  //   if (startDate && endDate) {
  //     const _days = getDatesBetween({ startDate, endDate })
  //
  //     setDays(_days)
  //   }
  // }, [endDate, startDate])

  function renderDates() {
    if (!days) return null

    return days.map((day, index) => {
      if (day.getDay() !== 1) return null

      const date = new Date(day)
      const dateString = DateTime.fromJSDate(date).toFormat('LLL. dd')

      return (
        <SC.DateMarking index={index} columnWidth={columnWidth || 36} key={dateString}>
          {dateString}
        </SC.DateMarking>
      )
    })
  }

  const chartWidth = (days?.length ?? 0) * columnWidth

  return (
    <SC.Wrapper id='time-line-header-container' width={chartWidth}>
      {renderDates()}
    </SC.Wrapper>
  )
}

export default TimeLineHeader
