import * as SC from './TimeLineHeader.styled'

import { DateTime } from 'luxon'
import { getDatesBetween } from '../../utils/helpers'
import { useConfigStore } from '../../Store'
import useDomStore from '../../Store/DomStore'

enum Period {
  Months = 'months',
  Days = 'days',
  Weeks = 'weeks',
}

type TimeLineHeaderProps = {
  // startDate: Date
  // endDate: Date
  days: Date[] | null
}

const getPeriodData = (columnWidth: number): { period: Period; range: number; format: string } => {
  if (columnWidth === 1) {
    return {
      period: Period.Weeks,
      range: 12,
      format: 'LLL. yyyy',
    }
  }

  if (columnWidth === 2) {
    return {
      period: Period.Weeks,
      range: 8,
      format: 'LLL. yyyy',
    }
  }

  if (columnWidth < 10) {
    return {
      period: Period.Months,
      range: 1,
      format: 'LLL.',
    }
  }

  if (columnWidth < 20) {
    return {
      period: Period.Weeks,
      range: 3,
      format: 'LLL. dd',
    }
  }

  if (columnWidth < 30) {
    return {
      period: Period.Weeks,
      range: 2,
      format: 'LLL. dd',
    }
  }

  return {
    period: Period.Weeks,
    range: 1,
    format: 'LLL. dd',
  }
}

function TimeLineHeader({ days }: TimeLineHeaderProps) {
  const config = useConfigStore((state) => state.config)
  const setHeaderNodeRef = useDomStore((state) => state.setHeaderNode)

  const { columnWidth, startDate, endDate } = config

  const { period, range, format } = getPeriodData(columnWidth)

  const periods = getDatesBetween({
    startDate,
    endDate,
    splitByValue: { [period]: range },
  })

  function renderDates() {
    if (!periods) return null

    const periodWidth = Math.round(range * columnWidth * (period === Period.Months ? 30.4 : 7)) ?? 36

    return periods.map((day, index) => {
      const date = new Date(day)
      const dateString = DateTime.fromJSDate(date).toFormat(format)

      return (
        <SC.DateMarking index={index} columnWidth={periodWidth} key={date.toString()}>
          {dateString}
        </SC.DateMarking>
      )
    })
  }

  const chartWidth = (days?.length ?? 0) * columnWidth

  return (
    <SC.Wrapper id='time-line-header-container' ref={setHeaderNodeRef} width={chartWidth}>
      {renderDates()}
    </SC.Wrapper>
  )
}

export default TimeLineHeader
