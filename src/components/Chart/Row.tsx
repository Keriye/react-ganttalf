import { MileStone, RowStyled, Task } from './Chart.styled'
import { addDateTime, areDatesEqual, getDatesBetween } from '../../utils/helpers'
import { useConfigStore, useTasksStore } from '../../Store'
import { useEffect, useRef, useState } from 'react'

import { ITask } from '../../types'
import NewLinkConnector from '../Connectors/NewLinkConnector'
import ReactDOM from 'react-dom'
import TimeLineDateRange from '../TimeLineHeader/TimeLineDateRange'

interface IRowProps {
  task: ITask
}

function Row({ task }: IRowProps) {
  const config = useConfigStore((state) => state.config)
  const onTaskDateChange = useTasksStore((state) => state.onTaskDateChange)

  const { rowHeight, columnWidth, startDate } = config

  const [resizing, setResizing] = useState(false)
  const [displayConnector, setDisplayConnector] = useState(false)

  const isParentTask = task.subTaskIds?.length ? task.subTaskIds.length > 0 : false

  const [taskDatesChanges, setTaskDatesChanges] = useState({
    startDate: task.startDate,
    endDate: task.endDate,
    startDateDiff: 0,
    endDateDiff: 0,
  })
  const taskRef = useRef<HTMLDivElement>(null)

  const rowRef = useRef(null)
  const dragging = useRef(false)

  const [displayTimeLineDateRange, setDisplayTimeLineDateRange] = useState(false)

  useEffect(() => {
    setTaskDatesChanges({
      startDate: task.startDate,
      endDate: task.endDate,
      startDateDiff: 0,
      endDateDiff: 0,
    })
  }, [task])

  const daysFromStart = getDatesBetween({
    startDate: startDate as Date,
    endDate: task.startDate as Date,
    includeStartDate: false,
  })

  const taskDays = getDatesBetween({
    startDate: task.startDate as Date,
    endDate: task.endDate as Date,
  })

  function onTaskClick() {
    if (dragging.current) return
  }

  function onDragTaskRange(event: React.MouseEvent, endpoint: 'start' | 'end') {
    const taskElement = taskRef.current

    if (!taskElement) return

    event.preventDefault()
    event.stopPropagation()
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResize)

    const originalWidth = taskElement.clientWidth
    const original_mouse_x = event.pageX
    const leftPosition = daysFromStart.length * columnWidth
    let currentTaskDatesChanges = taskDatesChanges

    function resize(event: MouseEvent) {
      setResizing(true)

      let changedDateSteps = 0

      if (!taskElement) return

      if (endpoint === 'end') {
        let newWidth = event.pageX - taskElement.getBoundingClientRect().left

        // snap to grid
        newWidth = Math.round(newWidth / columnWidth) * columnWidth

        if (newWidth < columnWidth) return

        taskElement.style.width = newWidth + 'px'

        changedDateSteps = (newWidth - originalWidth) / columnWidth
      }

      if (endpoint === 'start') {
        let newLeftPosition = leftPosition - (original_mouse_x - event.pageX)

        // snap to grid
        newLeftPosition = Math.round(newLeftPosition / columnWidth) * columnWidth

        const newWidth = originalWidth + (leftPosition - newLeftPosition)

        if (newWidth < columnWidth) return

        taskElement.style.left = newLeftPosition + 'px'
        taskElement.style.width = originalWidth + (leftPosition - newLeftPosition) + 'px'

        changedDateSteps = (newLeftPosition - leftPosition) / columnWidth
      }

      const newStartDate = addDateTime(task.startDate as Date, {
        days: changedDateSteps,
      })

      const newEndDate = addDateTime(task.endDate as Date, {
        days: changedDateSteps,
      })

      if (!areDatesEqual(newStartDate, currentTaskDatesChanges.startDate as Date)) {
        currentTaskDatesChanges = {
          startDate: endpoint === 'start' ? newStartDate : currentTaskDatesChanges.startDate,
          endDate: endpoint === 'end' ? newEndDate : currentTaskDatesChanges.endDate,
          startDateDiff: endpoint === 'start' ? changedDateSteps : 0,
          endDateDiff: endpoint === 'end' ? changedDateSteps : 0,
        }

        setTaskDatesChanges(currentTaskDatesChanges)
      }
    }

    function stopResize() {
      setResizing(false)
      onTaskDateChange(task.id, currentTaskDatesChanges)
      window.removeEventListener('mousemove', resize)
    }
  }

  function onDragTaskBar(event: React.MouseEvent) {
    const taskElement = taskRef.current

    event.preventDefault()
    window.addEventListener('mousemove', drag)
    window.addEventListener('mouseup', stopDrag)

    const original_mouse_x = event.pageX
    const leftPosition = daysFromStart.length * columnWidth

    let currentTaskDatesChanges = taskDatesChanges

    function drag(event: MouseEvent) {
      dragging.current = true
      let newLeftPosition = leftPosition - (original_mouse_x - event.pageX)

      // snap to grid
      newLeftPosition = Math.round(newLeftPosition / columnWidth) * columnWidth

      const changedDateSteps = (newLeftPosition - leftPosition) / columnWidth

      const newStartDate = addDateTime(task.startDate as Date, {
        days: changedDateSteps,
      })

      const newEndDate = addDateTime(task.endDate as Date, {
        days: changedDateSteps,
      })

      // check if dates are equal to previous dates
      if (!areDatesEqual(newStartDate, currentTaskDatesChanges.startDate as Date)) {
        currentTaskDatesChanges = {
          startDate: newStartDate,
          endDate: newEndDate,
          startDateDiff: changedDateSteps,
          endDateDiff: changedDateSteps,
        }

        setTaskDatesChanges(currentTaskDatesChanges)

        if (taskElement) {
          taskElement.style.left = newLeftPosition + 'px'
        }
      }
    }

    function stopDrag() {
      onTaskDateChange(task.id, currentTaskDatesChanges)

      setTimeout(() => {
        dragging.current = false
      }, 100)

      window.removeEventListener('mousemove', drag)
    }
  }

  function renderDraggableIndicator(endpoint: 'start' | 'end') {
    if (resizing) return null

    return (
      <div
        onMouseDown={(event) => onDragTaskRange(event, endpoint)}
        className='c-chart-bar-task-draggable-indicator-wrapper'
      >
        <div className='c-chart-bar-task-draggable-indicator' />
      </div>
    )
  }

  function onStartNewLink(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    setDisplayConnector(true)

    window.addEventListener('mouseup', stopNewLink)

    function stopNewLink() {
      setDisplayConnector(false)

      window.removeEventListener('mouseup', stopNewLink)
    }
  }

  function renderLinkPoint(endpoint: string) {
    if (resizing) return null

    return (
      <div onMouseDown={onStartNewLink} className={`c-chart-bar-task-link-wrapper link-${endpoint}`}>
        <div className='c-chart-bar-task-link '>
          <div className='c-chart-bar-task-link-small' />
        </div>
      </div>
    )
  }

  function renderConnectorPoint(endpoint: string) {
    return (
      <div
        id={`${task.id}-connector-point-${endpoint}`}
        className={`c-chart-bar-task-connector-point connector-point-${endpoint}`}
      />
    )
  }

  function renderTask() {
    if (task.type === 2) {
      return (
        <MileStone
          isParentTask={isParentTask}
          ref={taskRef}
          id={'task-bar-' + task.id}
          daysFromStart={daysFromStart.length}
          columnWidth={columnWidth}
          rowHeight={rowHeight}
        >
          {renderLinkPoint('start')}
          <div
            onMouseDown={onDragTaskBar}
            onClick={onTaskClick}
            className={`c-chart-bar-task ${task.status === 1 ? 'completed' : ''}`}
          ></div>
          {renderLinkPoint('end')}
        </MileStone>
      )
    }

    return (
      <Task
        isParentTask={isParentTask}
        ref={taskRef}
        id={'task-bar-' + task.id}
        daysFromStart={daysFromStart.length}
        daysLength={taskDays.length}
        columnWidth={columnWidth}
        rowHeight={rowHeight}
      >
        {renderLinkPoint('start')}
        {renderConnectorPoint('start')}
        <div
          onMouseDown={onDragTaskBar}
          onClick={onTaskClick}
          className={`c-chart-bar-task ${task.status === 1 ? 'completed' : ''}`}
        >
          {!isParentTask && (
            <>
              {renderDraggableIndicator('start')}
              {renderDraggableIndicator('end')}
            </>
          )}
        </div>
        {renderConnectorPoint('end')}
        {renderLinkPoint('end')}
      </Task>
    )
  }

  function onMouseOver() {
    setDisplayTimeLineDateRange(true)

    const connectorsStart = document.querySelectorAll(`svg[start-id="${task.id}"]`)
    const connectorsEnd = document.querySelectorAll(`svg[end-id="${task.id}"]`)

    const allConnectors = [...connectorsStart, ...connectorsEnd]

    allConnectors.forEach((connector) => {
      connector.classList.add('c-connector-hovered')
    })
  }

  function onMouseOut() {
    setDisplayTimeLineDateRange(false)

    const connectorsStart = document.querySelectorAll(`svg[start-id="${task.id}"]`)
    const connectorsEnd = document.querySelectorAll(`svg[end-id="${task.id}"]`)

    const allConnectors = [...connectorsStart, ...connectorsEnd]

    allConnectors.forEach((connector) => {
      connector.classList.remove('c-connector-hovered')
    })
  }

  function renderTaskDateRange() {
    if (!displayTimeLineDateRange) return null

    // get time-line-header-container element element
    const timeLineHeaderContainer = document.getElementById('time-line-header-container')

    if (!timeLineHeaderContainer) return null

    return ReactDOM.createPortal(
      <TimeLineDateRange startDate={taskDatesChanges.startDate as Date} endDate={taskDatesChanges.endDate as Date} />,
      timeLineHeaderContainer,
    )
  }

  function renderConnector() {
    if (displayConnector) {
      return <NewLinkConnector task={task} />
    }

    return null
  }

  return (
    <RowStyled
      isParentTask={isParentTask}
      ref={rowRef}
      type={task.type || 1}
      rowHeight={rowHeight}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={{ height: rowHeight }}
    >
      {renderConnector()}
      {renderTaskDateRange()}
      {renderTask()}
    </RowStyled>
  )
}

export default Row
