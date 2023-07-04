import { useConfigStore, useTasksStore } from '../../Store'

import { NonWorkingSegment } from './Chart.styled'

export default function NonWorkingSegments({ days }: { days: Date[] }) {
  const config = useConfigStore((state) => state.config)
  const tasks = useTasksStore((state) => state.tasks)

  const { rowHeight, columnWidth } = config

  const nonWorkingSegments = days.map((day, index) => {
    if (day.getDay() !== 0 && day.getDay() !== 6) return null

    return (
      <NonWorkingSegment
        index={index}
        columnWidth={columnWidth}
        chartHeight={rowHeight * tasks.length}
        key={index * columnWidth}
      />
    )
  })

  return (
    <div id='nonWorkingSegments' style={{ position: 'relative' }}>
      {nonWorkingSegments}
    </div>
  )
}
