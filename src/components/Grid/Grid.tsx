import * as SC from './Grid.styled'
import GridRow from './GridRow'
import { ITask } from '../../types'
import { findParentTask } from '../../utils/helpers'
import { useTasksStore } from '../../Store'
import useHorizontalResize from '../../hooks/useHorizontalResize'
import { VirtualItem } from '@tanstack/react-virtual'
import useVirtualizationStore from '../../Store/VirtualizationStore'

function Grid() {
  const { containerRef, isResizing, handleResizeStart } = useHorizontalResize()

  const tasks = useTasksStore((state) => state.tasks)
  const interaction = useTasksStore((state) => state.interaction)
  const totalHeight = useVirtualizationStore((state) => state.totalHeight)
  const virtualItems = useVirtualizationStore((state) => state.virtualItems)

  function getTaskLevel(givenTask: ITask) {
    let taskLevel = 0
    let parentTask = findParentTask(givenTask, tasks)

    while (parentTask) {
      taskLevel++
      parentTask = findParentTask(parentTask, tasks)
    }

    return taskLevel
  }

  function getCollapsedState(givenTask: ITask) {
    let parentTask = findParentTask(givenTask, tasks)

    while (parentTask) {
      if (!interaction[parentTask.id].expanded) return true
      parentTask = findParentTask(parentTask, tasks)
    }

    return false
  }

  const renderRow = (task: ITask, index: number) => {
    if (!task) return null

    const collapsed = getCollapsedState(task)

    if (collapsed) return null

    const taskLevel = getTaskLevel(task)

    return (
      <GridRow
        taskLevel={taskLevel}
        key={task.id}
        task={task}
        isLastItem={index + 1 === tasks.length}
        isFirstItem={index === 0}
      />
    )
  }

  const renderVirtualRow = ({ index }: VirtualItem) => {
    const task = tasks[index]

    if (!task) return null

    return renderRow(task, index)
  }

  return (
    <SC.Wrapper id='react-ganttalf-grid' ref={containerRef} isResizing={isResizing} totalHeight={totalHeight}>
      {virtualItems ? (
        <>
          <div style={{ height: `${virtualItems[0]?.start ?? 0}px` }} />
          {virtualItems.map(renderVirtualRow)}
        </>
      ) : (
        tasks.map(renderRow)
      )}
      <SC.ResizeLine onMouseDown={handleResizeStart} />
    </SC.Wrapper>
  )
}

export default Grid
