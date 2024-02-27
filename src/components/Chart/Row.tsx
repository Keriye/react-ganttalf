import * as SC from './Chart.styled'

import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { addDateTime, areDatesEqual, getDatesBetween } from '../../utils/helpers'
import { useConfigStore, useTasksStore } from '../../Store'

import { ActionContext } from '../GanttChart'
import { ITask } from '../../types'
import NewLinkConnector from '../Connectors/NewLinkConnector'
import ReactDOM from 'react-dom'
import TimeLineDateRange from '../TimeLineHeader/TimeLineDateRange'
import useDomStore from '../../Store/DomStore'
import useInteractionStore from '../../Store/InteractionStore'

interface IRowProps {
  task: ITask
  indexKey: number
}

function Row({ task, indexKey }: IRowProps) {
  const config = useConfigStore((state) => state.config)
  const onTaskDateChange = useTasksStore((state) => state.onTaskDateChange)
  const headerNode = useDomStore((state) => state.headerNode)
  const [sourceId, setSourceId] = useInteractionStore((state) => [state.sourceId, state.setSourceId])

  const { rowHeight, columnWidth, startDate } = config

  const { onTaskSelect, onTaskTimeChange, onLinkCreate } = useContext(ActionContext)

  const [displayConnector, setDisplayConnector] = useState(false)

  const [taskDatesChanges, setTaskDatesChanges] = useState({
    startDate: task.startDate,
    endDate: task.endDate,
    startDateDiff: 0,
    endDateDiff: 0,
  })

  const taskRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef(null)
  const initPositionRef = useRef<{ pageX: number; endpoint?: string }>({ pageX: 0 })
  const [isTaskMoving, setIsTaskMoving] = useState(false)
  const [isTaskResizing, setIsTaskResizing] = useState(false)

  const [displayTimeLineDateRange, setDisplayTimeLineDateRange] = useState(false)

  const isParentTask = task.subTaskIds?.length ? task.subTaskIds.length > 0 : false

  const daysFromStart = useMemo(
    () =>
      getDatesBetween({
        startDate: startDate as Date,
        endDate: task.startDate as Date,
        includeEndDate: false,
      }),
    // use JSON.stringify to compare dates because in js Date is an object and it's always a new object
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(startDate), JSON.stringify(task.startDate)],
  )

  const taskDays = useMemo(() => {
    return getDatesBetween({
      startDate: task.startDate as Date,
      endDate: task.endDate as Date,
      includeEndDate: false,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(task.startDate), JSON.stringify(task.endDate)])

  useEffect(() => {
    if (taskRef.current) {
      taskRef.current.style.left = `${daysFromStart.length * columnWidth}px`
      taskRef.current.style.width = `${taskDays.length * columnWidth}px`
    }
  }, [columnWidth, daysFromStart.length, taskDays.length])

  // handle task move
  useEffect(() => {
    const leftPosition = daysFromStart.length * columnWidth
    let currentTaskDatesChanges = taskDatesChanges

    const handleTaskMove = (event: MouseEvent) => {
      let newLeftPosition = leftPosition - (initPositionRef.current.pageX - event.pageX)

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

        if (taskRef.current) {
          taskRef.current.style.left = newLeftPosition + 'px'
        }
      }
    }

    const stopTaskMove = (event: MouseEvent) => {
      const isStatic = Math.abs(initPositionRef.current.pageX - event.pageX) < 5

      const { startDateDiff, endDateDiff } = currentTaskDatesChanges
      if (isStatic) {
        onTaskSelect?.(task)
      } else {
        if (typeof onTaskTimeChange === 'function') {
          onTaskTimeChange(task, { start: startDateDiff, end: endDateDiff })
        } else {
          onTaskDateChange(task.id, currentTaskDatesChanges)
        }
      }

      setIsTaskMoving(false)
    }

    if (isTaskMoving) {
      window.addEventListener('mouseup', stopTaskMove)
      window.addEventListener('mousemove', handleTaskMove)
    }

    return () => {
      window.removeEventListener('mouseup', stopTaskMove)
      window.removeEventListener('mousemove', handleTaskMove)
    }
  }, [isTaskMoving])

  // handle task resize
  useEffect(() => {
    const originalWidth = taskRef.current?.clientWidth ?? 0
    const leftPosition = daysFromStart.length * columnWidth
    let currentTaskDatesChanges = taskDatesChanges

    const handleTaskResize = (event: MouseEvent) => {
      let changedDateSteps = 0

      if (!taskRef.current) return

      const { pageX, endpoint } = initPositionRef.current

      if (endpoint === 'end') {
        let newWidth = event.pageX - taskRef.current.getBoundingClientRect().left

        // snap to grid
        newWidth = Math.round(newWidth / columnWidth) * columnWidth

        if (newWidth < columnWidth) return

        taskRef.current.style.width = newWidth + 'px'

        changedDateSteps = (newWidth - originalWidth) / columnWidth
      }

      if (endpoint === 'start') {
        let newLeftPosition = leftPosition - (pageX - event.pageX)

        // snap to grid
        newLeftPosition = Math.round(newLeftPosition / columnWidth) * columnWidth

        const newWidth = originalWidth + (leftPosition - newLeftPosition)

        if (newWidth < columnWidth) return

        taskRef.current.style.left = newLeftPosition + 'px'
        taskRef.current.style.width = originalWidth + (leftPosition - newLeftPosition) + 'px'

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

    const stopTaskResize = () => {
      onTaskDateChange(task.id, currentTaskDatesChanges)

      setIsTaskResizing(false)

      const { startDateDiff, endDateDiff } = currentTaskDatesChanges
      onTaskTimeChange?.(task, { start: startDateDiff, end: endDateDiff })
    }

    if (isTaskResizing) {
      window.addEventListener('mouseup', stopTaskResize)
      window.addEventListener('mousemove', handleTaskResize)
    }

    return () => {
      window.removeEventListener('mouseup', stopTaskResize)
      window.removeEventListener('mousemove', handleTaskResize)
    }
  }, [isTaskResizing])

  useEffect(() => {
    setTaskDatesChanges({
      startDate: task.startDate,
      endDate: task.endDate,
      startDateDiff: 0,
      endDateDiff: 0,
    })
  }, [task])

  const getStartTaskResizeHandler = useCallback((event: React.MouseEvent, endpoint: 'start' | 'end') => {
    event.preventDefault()
    event.stopPropagation()

    if (!taskRef.current) return

    initPositionRef.current = { pageX: event.pageX, endpoint }
    setIsTaskResizing(true)
  }, [])

  const handleStartTaskMove = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!taskRef.current) return

    initPositionRef.current = { pageX: event.pageX }
    setIsTaskMoving(true)
  }, [])

  function renderDraggableIndicator(endpoint: 'start' | 'end') {
    if (isTaskResizing) return null

    return (
      <SC.ResizeEdge
        onMouseDown={(event) => getStartTaskResizeHandler(event, endpoint)}
        className='c-chart-bar-task-draggable-indicator-wrapper'
        endpoint={endpoint}
        external={taskDays.length * columnWidth < 22}
      >
        <div className='c-chart-bar-task-draggable-indicator' />
      </SC.ResizeEdge>
    )
  }

  function onStartNewLink(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    setDisplayConnector(true)
    setSourceId(task.id)

    window.addEventListener('mouseup', stopNewLink)

    function stopNewLink() {
      setDisplayConnector(false)

      window.removeEventListener('mouseup', stopNewLink)
    }
  }

  const onEndNewLink = useCallback(() => {
    if (sourceId && sourceId !== task.id) {
      onLinkCreate?.(sourceId, task.id)
    }
  }, [onLinkCreate, sourceId, task.id])

  function renderLinkPoint(endpoint: string) {
    if (isTaskResizing) return null

    return (
      <div
        onMouseDown={endpoint === 'end' ? onStartNewLink : undefined}
        onMouseUp={endpoint === 'start' ? onEndNewLink : undefined}
        className={`c-chart-bar-task-link-wrapper link-${endpoint}`}
      >
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

  const renderTask = () => {
    if (task.type === 2) {
      return (
        <SC.MileStone
          isParentTask={isParentTask}
          ref={taskRef}
          data-index={indexKey}
          id={'task-bar-' + task.id}
          daysFromStart={daysFromStart.length}
          columnWidth={columnWidth}
          rowHeight={rowHeight}
        >
          {renderLinkPoint('start')}
          <div
            onMouseDown={handleStartTaskMove}
            className={`c-chart-bar-task ${task.status === 1 ? 'completed' : ''}`}
          ></div>
          {renderLinkPoint('end')}
        </SC.MileStone>
      )
    }

    return (
      <SC.Task
        title={task.title}
        isParentTask={isParentTask}
        ref={taskRef}
        data-index={indexKey}
        id={'task-bar-' + task.id}
        daysFromStart={daysFromStart.length}
        daysLength={taskDays.length}
        columnWidth={columnWidth}
        rowHeight={rowHeight}
      >
        {renderLinkPoint('start')}
        {renderConnectorPoint('start')}
        <div onMouseDown={handleStartTaskMove} className={`c-chart-bar-task ${task.status === 1 ? 'completed' : ''}`}>
          {!isParentTask && (
            <>
              {renderDraggableIndicator('start')}
              {renderDraggableIndicator('end')}
            </>
          )}
        </div>
        {renderConnectorPoint('end')}
        {renderLinkPoint('end')}
      </SC.Task>
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

  const renderTaskDateRange = () => {
    if (!displayTimeLineDateRange || !headerNode) return null

    return ReactDOM.createPortal(
      <TimeLineDateRange startDate={taskDatesChanges.startDate as Date} endDate={taskDatesChanges.endDate as Date} />,
      headerNode,
    )
  }

  return (
    <SC.RowStyled
      isParentTask={isParentTask}
      ref={rowRef}
      type={task.type || 1}
      rowHeight={rowHeight}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={{ height: rowHeight }}
    >
      {displayConnector && <NewLinkConnector task={task} />}
      {renderTaskDateRange()}
      {renderTask()}
    </SC.RowStyled>
  )
}

export default memo(Row, (prevProps, nextProps) => {
  const prevEndDate = JSON.stringify(prevProps.task.endDate)
  const nextEndDate = JSON.stringify(nextProps.task.endDate)
  const prevStartDate = JSON.stringify(prevProps.task.startDate)
  const nextStartDate = JSON.stringify(nextProps.task.startDate)

  return (
    prevProps.task.id === nextProps.task.id &&
    prevEndDate === nextEndDate &&
    prevStartDate === nextStartDate &&
    prevProps.task.type === nextProps.task.type &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.subTaskIds?.length === nextProps.task.subTaskIds?.length &&
    prevProps.indexKey === nextProps.indexKey &&
    prevProps.task.status === nextProps.task.status
  )
})
