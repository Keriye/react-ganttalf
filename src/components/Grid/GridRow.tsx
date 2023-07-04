import { useConfigStore, useTasksStore } from '../../Store'
import { useRef, useState } from 'react'

import Avatar from './Avatar'
import Checkbox from './Checkbox'
import { GridRowStyled } from './Grid.styled'
import { ITask } from '../../types'
import Icon from './SvgIcon'
import TitleCell from './TitleCell'

interface IGridRowProps {
  isFirstItem: boolean
  isLastItem: boolean
  task: ITask
  taskLevel: number
}

export default function GridRow({ taskLevel, isFirstItem, isLastItem, task }: IGridRowProps) {
  const toggleCollapse = useTasksStore((state) => state.toggleCollapse)
  const onStatusChange = useTasksStore((state) => state.onStatusChange)
  const config = useConfigStore((state) => state.config)

  const { rowHeight } = config

  const rowRef = useRef<HTMLDivElement>(null)
  const openSubTasksRef = useRef<NodeJS.Timeout | null>(null)

  const [dragOverPosition, setDragOverPosition] = useState<string | null>(null)

  function onDragStart(event: React.DragEvent<HTMLDivElement>) {
    const element = document.getElementById('c-grid-row-' + task.id)

    if (!element) return

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

  function onDrop() {
    setDragOverPosition(null)
    clearTimeout(openSubTasksRef.current as NodeJS.Timeout)

    openSubTasksRef.current = null
  }

  function renderAddTaskButton(position: string) {
    if (isLastItem && position === 'bottom') return null

    return (
      <div className={`c-grid-add-new-task c-grid-add-new-task-${position}`}>
        <Icon className='c-grid-add-task-icon' width={10} height={10} iconName='Add' />
      </div>
    )
  }

  return (
    <GridRowStyled
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
          {renderAddTaskButton('top')}
          {renderAddTaskButton('bottom')}

          <div draggable onDragStart={onDragStart} className='c-grid-gripper-wrapper'>
            <Icon width={18} height={18} iconName='GripperDotsVertical' />
          </div>
          <div className='c-grid-sort-order'>{task.sortOrder}</div>
        </div>
        <Checkbox onChange={(checked) => onStatusChange(checked, task.id)} defaultChecked={task.status === 1} />
        <TitleCell taskLevel={taskLevel} task={task} />
        <div className='c-grid-avatar-wrapper'>
          <Avatar className='c-grid-avatar' name={task.assignedTo?.name} imgSrc={task.assignedTo?.pictureUrl} />
        </div>
      </div>
      <div className={getDragOverRightClassName()}>
        <Icon className='c-grid-drag-over-icon' width={18} height={18} iconName='PaddingRight' />
      </div>
    </GridRowStyled>
  )
}
