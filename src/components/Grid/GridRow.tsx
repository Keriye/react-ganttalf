import { useConfigStore, useTasksStore } from '../../Store'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'

// import Avatar from './Avatar'
import Checkbox from './Checkbox'
import * as SC from './Grid.styled'
import { ITask, TaskStatus } from '../../types'
import Icon from './SvgIcon'
import TitleCell from './TitleCell'
import { ActionContext } from '../GanttChart'

interface IGridRowProps {
  isFirstItem: boolean
  isLastItem: boolean
  task: ITask
  taskLevel: number
}

const renderSortOrderColumnDefault = (task: ITask) => task.sortOrder

// const renderAssigneeColumnDefault = (task: ITask) => (
//   <Avatar className='c-grid-avatar' name={task.assignedTo?.name} imgSrc={task.assignedTo?.pictureUrl} />
// )

export default function GridRow({ taskLevel, isFirstItem, isLastItem, task }: IGridRowProps) {
  const addTask = useTasksStore((state) => state.addTask)
  const toggleCollapse = useTasksStore((state) => state.toggleCollapse)
  const onStatusChange = useTasksStore((state) => state.onStatusChange)
  const config = useConfigStore((state) => state.config)

  const { columnsRenderer, columnsOrder, onTaskAppend, onTaskReorder, onTaskStatusChange } = useContext(ActionContext)

  const { rowHeight } = config

  const rowRef = useRef<HTMLDivElement>(null)
  const openSubTasksRef = useRef<NodeJS.Timeout | null>(null)

  const [dragOverPosition, setDragOverPosition] = useState<string | null>(null)

  useEffect(() => {
    if (task?.id?.startsWith?.('temp')) {
      rowRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }
  }, [task.id])

  function onDragStart(event: React.DragEvent<HTMLDivElement>) {
    const element = document.getElementById('c-grid-row-' + task.id)

    if (!element) return

    event.dataTransfer.setData('sourceId', task.id)
    event.dataTransfer.setDragImage(element, 10, 10)
  }

  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.stopPropagation()
    event.preventDefault()

    const { clientY, clientX } = event

    if (!rowRef.current) return

    const { top, left, height, width } = rowRef.current.getBoundingClientRect()

    let position = null

    const isTop = clientY < top + height / 2

    if (isTop) {
      position = 'top'
    } else {
      position = 'bottom'
    }

    // is right side (30% of width)
    const isRight = clientX > left + width * 0.7
    if (isRight) {
      position = 'right'
    }

    setDragOverPosition(position)
  }

  function getContainerClassName() {
    let className = 'c-grid-row-container'

    if (dragOverPosition === 'top') {
      className += ' c-grid-row-container-drag-over-top'
    } else if (dragOverPosition === 'bottom') {
      className += ' c-grid-row-container-drag-over-bottom'
    } else if (dragOverPosition === 'right') {
      className += ' c-grid-row-container-drag-over-right'
    }

    if (dragOverPosition) {
      className += ' c-grid-row-container-drag-over'
    }

    return className
  }

  function getDragOverRightClassName() {
    let className = 'c-grid-drag-over'

    if (dragOverPosition === 'right') {
      className += ' c-grid-drag-over-visible'
    }

    return className
  }

  function onDragEnter() {
    if (openSubTasksRef.current) return

    openSubTasksRef.current = setTimeout(() => {
      if (task.collapsed) {
        toggleCollapse(task.id)
      }
    }, 1000)
  }

  function onDragLeave(event: React.DragEvent<HTMLDivElement>) {
    const { clientY, clientX } = event

    if (!rowRef.current) return

    const { top, left, height, width } = rowRef.current.getBoundingClientRect()

    const isOverRow = clientY > top && clientY < top + height - 3 && clientX > left && clientX < left + width

    if (isOverRow) return

    setDragOverPosition(null)
    clearTimeout(openSubTasksRef.current as NodeJS.Timeout)

    openSubTasksRef.current = null
  }

  function onDrop(event: React.DragEvent) {
    setDragOverPosition(null)
    clearTimeout(openSubTasksRef.current as NodeJS.Timeout)

    const sourceId = event.dataTransfer.getData('sourceId')
    const reorderMode = dragOverPosition === 'top' ? 'before' : dragOverPosition === 'bottom' ? 'after' : undefined

    if (sourceId) {
      onTaskReorder?.(sourceId, task.id, reorderMode)
    }

    openSubTasksRef.current = null
  }

  const getAddTaskHandler =
    (position: 'before' | 'after'): React.MouseEventHandler<HTMLDivElement> =>
    (event) => {
      event.stopPropagation()

      if (onTaskAppend) {
        onTaskAppend(task, { replace: position === 'before' })
      } else {
        addTask({}, { sourceId: task.id, position })
      }
    }

  function renderAddTaskButton(position: 'before' | 'after') {
    if (isLastItem && position === 'after') return null

    return (
      <div className={`c-grid-add-new-task c-grid-add-new-task-${position}`} onClick={getAddTaskHandler(position)}>
        <Icon className='c-grid-add-task-icon' width={10} height={10} iconName='Add' />
      </div>
    )
  }

  const renderSortOrderColumn = () => (
    <div className='c-grid-sort-order'>
      {(columnsRenderer?.sortOrder?.renderer ?? renderSortOrderColumnDefault)(task)}
    </div>
  )
  // const renderAssigneeColumn = () => (
  //   <div className='c-grid-avatar-wrapper'>
  //     {(columnsRenderer?.assignee?.renderer ?? renderAssigneeColumnDefault)(task)}
  //   </div>
  // )

  const handleOnStatusChange: (checked: boolean) => void = useCallback(
    (checked) => {
      onStatusChange(checked, task.id)
      onTaskStatusChange?.({ taskId: task.id, value: !task.status })
    },
    [onStatusChange, onTaskStatusChange, task.id, task.status],
  )

  const renderCustomColumns = () => {
    if (!columnsOrder) {
      return null
    }

    return columnsOrder.map((columnName) => {
      const customRenderer = columnsRenderer?.[columnName]?.renderer

      if (!customRenderer) {
        return null
      }

      return (
        <SC.CustomGridCell key={columnName} className={`c-grid-${columnName}-wrapper`} width={200}>
          {customRenderer(task)}
        </SC.CustomGridCell>
      )
    })
  }

  return (
    <SC.GridRowStyled
      className='c-grid-row-wrapper'
      ref={rowRef}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      id={'c-grid-row-' + task.id}
      isFirstItem={isFirstItem}
      isLastItem={isLastItem}
      height={rowHeight || 40}
    >
      <div className={getContainerClassName()}>
        <div className='c-grid-gripper-sort-order-container'>
          {renderAddTaskButton('before')}
          {renderAddTaskButton('after')}

          <div draggable onDragStart={onDragStart} className='c-grid-gripper-wrapper'>
            <Icon width={18} height={18} iconName='GripperDotsVertical' />
          </div>
          {renderSortOrderColumn()}
        </div>
        <Checkbox onChange={handleOnStatusChange} defaultChecked={task.status === TaskStatus.Completed} />
        <TitleCell taskLevel={taskLevel} task={task} />
        {renderCustomColumns()}
        {/*{renderAssigneeColumn()}*/}
      </div>
      <div className={getDragOverRightClassName()}>
        <Icon className='c-grid-drag-over-icon' width={18} height={18} iconName='PaddingRight' />
      </div>
    </SC.GridRowStyled>
  )
}
