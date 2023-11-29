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
  const visibleTasks = useTasksStore((state) => state.visibleTasks)
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

  const renderRow = (task: ITask, index: number) => {
    if (!task) return null

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
    const task = visibleTasks[index]

    if (!task) return null

    return renderRow(task, index)
  }

  return (
    <SC.Wrapper id='react-ganttalf-grid' ref={containerRef} isResizing={isResizing}>
      {virtualItems ? (
        <>
          <div style={{ height: `${virtualItems[0]?.start ?? 0}px`, width: '100%', backgroundColor: 'white' }} />
          {virtualItems.map(renderVirtualRow)}
          <div
            style={{
              height: `${totalHeight - (virtualItems.at(-1)?.end ?? 0)}px`,
              width: '100%',
              backgroundColor: 'white',
            }}
          />
        </>
      ) : (
        visibleTasks.map(renderRow)
      )}
      <SC.ResizeLine onMouseDown={handleResizeStart} />
    </SC.Wrapper>
  )
}

export default Grid
