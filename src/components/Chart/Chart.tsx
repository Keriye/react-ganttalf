import { findParentTask, getDatesBetween } from '../../utils/helpers'
import { useConfigStore, useTasksStore } from '../../Store'
import { useMemo, useRef } from 'react'

import * as SC from './Chart.styled'
import Connectors from '../Connectors/Connectors'
import { ITask } from '../../types'
import Row from './Row'
import TimeLineHeader from '../TimeLineHeader/TimeLineHeader'
import useVirtualizationStore from '../../Store/VirtualizationStore'

function Chart() {
  const tasks = useTasksStore((state) => state.tasks)
  const virtualItems = useVirtualizationStore((state) => state.virtualItems)
  const config = useConfigStore((state) => state.config)

  const chartRef = useRef(null)

  const { startDate, endDate, columnWidth } = config

  const days = useMemo(() => {
    if (startDate && endDate) {
      return getDatesBetween({ startDate, endDate })
    }

    return null
  }, [startDate, endDate])

  function getCollapsedState(givenTask: ITask) {
    let parentTask = findParentTask(givenTask, tasks)

    while (parentTask) {
      if (parentTask.collapsed) return true
      parentTask = findParentTask(parentTask, tasks)
    }

    return false
  }

  // TODO:  add dot
  // function renderTodayDot() {
  //   const timeLineHeaderContainer = document.getElementById('time-line-header-container')
  //
  //   if (!timeLineHeaderContainer) return null
  //
  //   return ReactDOM.createPortal(
  //     <div
  //       style={{
  //         position: 'absolute',
  //         height: 6,
  //         width: 6,
  //         bottom: 0,
  //         left: todayIndicatorPosition - 2,
  //         backgroundColor: '#f00',
  //         borderRadius: '50%',
  //       }}
  //     />,
  //     timeLineHeaderContainer,
  //   )
  // }

  if (!days) return

  const chartWidth = days.length * columnWidth

  const tasksToDisplay = (virtualItems ? virtualItems.map(({ index }) => tasks[index]) : tasks).filter((task) => {
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
    <>
      <TimeLineHeader days={days} />
      <SC.ChartWrapper ref={chartRef} id='react-ganttalf-chart' width={chartWidth}>
        <SC.TodayIndicator indicatorPosition={todayIndicatorPosition} />
        <SC.ChartContainer id='react-ganttalf-tasks-container'>
          <Connectors tasks={tasksToDisplay} />
          {virtualItems && <div style={{ height: `${virtualItems[0]?.start ?? 0}px` }} />}
          {tasksToDisplay.map((task) => (
            <Row key={task.id} task={task} />
          ))}
        </SC.ChartContainer>
      </SC.ChartWrapper>
    </>
  )
}

export default Chart
