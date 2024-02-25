import * as SC from './Chart.styled'

import { useConfigStore, useTasksStore } from '../../Store'
import { useMemo, useRef } from 'react'

import Connectors from '../Connectors/Connectors'
import Row from './Row'
import TimeLineHeader from '../TimeLineHeader/TimeLineHeader'
import { getDatesBetween } from '../../utils/helpers'
import useVirtualizationStore from '../../Store/VirtualizationStore'

function Chart() {
  // const tasks = useTasksStore((state) => state.tasks)
  const visibleTasks = useTasksStore((state) => state.visibleTasks)
  // const interaction = useTasksStore((state) => state.interaction)
  const virtualItems = useVirtualizationStore((state) => state.virtualItems)
  const totalHeight = useVirtualizationStore((state) => state.totalHeight)
  const config = useConfigStore((state) => state.config)

  const chartRef = useRef(null)

  const { startDate, endDate, columnWidth } = config

  const days = useMemo(() => {
    if (startDate && endDate) {
      return getDatesBetween({ startDate, endDate })
    }

    return null
  }, [startDate, endDate])

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

  const tasksToDisplay = useMemo(
    () => (virtualItems ? virtualItems.map(({ index }) => visibleTasks[index]) : visibleTasks),
    [virtualItems, visibleTasks],
  )

  if (!days) return

  const chartWidth = days.length * columnWidth

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
        <SC.ChartContainer id='react-ganttalf-tasks-container' segmentWidth={columnWidth * 7}>
          <Connectors tasks={tasksToDisplay} />
          {virtualItems && <div className='placeholder' style={{ height: `${virtualItems[0]?.start ?? 0}px` }} />}
          {tasksToDisplay.map((task, index) => (
            <Row key={task.id} task={task} index={index} />
          ))}
          {virtualItems && (
            <div className='placeholder' style={{ height: `${totalHeight - (virtualItems.at(-1)?.end ?? 0)}px` }} />
          )}
        </SC.ChartContainer>
      </SC.ChartWrapper>
    </>
  )
}

export default Chart
