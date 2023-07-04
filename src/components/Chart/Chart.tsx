import { findParentTask, getDatesBetween } from '../../utils/helpers'
import { useConfigStore, useTasksStore } from '../../Store'
import { useEffect, useRef, useState } from 'react'

import { ChartContainer } from './Chart.styled'
import Connectors from '../Connectors/Connectors'
// import { DateTime } from 'luxon'
import { ITask } from '../../types'
import NonWorkingSegments from './NonWorkingSegments'
import ReactDOM from 'react-dom'
import Row from './Row'

function Chart() {
  const tasks = useTasksStore((state) => state.tasks)
  const config = useConfigStore((state) => state.config)
  const [days, setDays] = useState<Date[] | null>(null)

  const chartRef = useRef(null)

  const { startDate, endDate, rowHeight, columnWidth } = config

  useEffect(() => {
    if (startDate && endDate) {
      const _days = getDatesBetween({ startDate, endDate })

      setDays(_days)
    }
  }, [startDate, endDate])

  function getCollapsedState(givenTask: ITask) {
    let parentTask = findParentTask(givenTask, tasks)

    while (parentTask) {
      if (parentTask.collapsed) return true
      parentTask = findParentTask(parentTask, tasks)
    }

    return false
  }

  function renderTodayDot() {
    const timeLineHeaderContainer = document.getElementById('time-line-header-container')

    if (!timeLineHeaderContainer) return null

    return ReactDOM.createPortal(
      <div
        style={{
          position: 'absolute',
          height: 6,
          width: 6,
          bottom: 0,
          left: todayIndicatorPosition - 2,
          backgroundColor: '#f00',
          borderRadius: '50%',
        }}
      />,
      timeLineHeaderContainer,
    )
  }

  if (!days) return

  const chartWidth = days.length * columnWidth

  const tasksToDisplay = tasks.filter((task) => {
    return !getCollapsedState(task)
  })

  const todayIndicatorPosition =
    getDatesBetween({
      startDate,
      endDate: new Date(),
    }).length *
      columnWidth -
    columnWidth

  return (
    <ChartContainer ref={chartRef} id='react-ganttalf-chart' width={chartWidth}>
      <NonWorkingSegments days={days} />
      <div
        style={{
          position: 'absolute',
          width: 1,
          top: 0,
          zIndex: 100,
          pointerEvents: 'none',
          backgroundColor: '#f00',
          left: todayIndicatorPosition,
          height: tasksToDisplay.length * rowHeight,
        }}
      />
      <div id='react-ganttalf-tasks-container' style={{ position: 'relative' }}>
        <Connectors />
        {tasksToDisplay.map((task) => {
          return <Row key={task.id} task={task} />
        })}
      </div>
      {renderTodayDot()}
    </ChartContainer>
  )
}

export default Chart
