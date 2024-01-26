import * as SC from './Grid.styled'
import GridRow from './GridRow'
import { ITask } from '../../types'
import { findParentTask } from '../../utils/helpers'
import { useTasksStore } from '../../Store'
import useHorizontalResize from '../../hooks/useHorizontalResize'
import useVirtualizationStore from '../../Store/VirtualizationStore'
import { GanttChartProps } from '../GanttChart'
import React, { useMemo } from 'react'

type GridProps = {
  onRenderGrid: GanttChartProps['onRenderGrid']
}

const Grid: React.FC<GridProps> = ({ onRenderGrid }) => {
  const { containerRef, isResizing, handleResizeStart } = useHorizontalResize()

  const tasks = useTasksStore((state) => state.tasks)
  const addTask = useTasksStore((state) => state.addTask)
  const interaction = useTasksStore((state) => state.interaction)
  const visibleTasks = useTasksStore((state) => state.visibleTasks)
  const scrollToTask = useTasksStore((state) => state.scrollToTask)
  const toggleCollapse = useTasksStore((state) => state.toggleCollapse)
  const invalidateVersion = useTasksStore((state) => state.invalidateVersion)
  const getSubTasks = useTasksStore((state) => state.getSubTasks)
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

  const tasksToDisplay = useMemo(
    () => (virtualItems ? virtualItems.map(({ index }) => visibleTasks[index]) : visibleTasks),
    [virtualItems, visibleTasks],
  )

  // const isLoadedExternaly = typeof onRenderGrid === 'function'

  return (
    <SC.Wrapper id='react-ganttalf-grid' ref={containerRef} isResizing={isResizing}>
      {virtualItems && (
        <div style={{ height: `${virtualItems[0]?.start ?? 0}px`, width: '100%', backgroundColor: 'white' }} />
      )}
      {onRenderGrid
        ? onRenderGrid(tasksToDisplay, {
            interaction,
            scrollToTask,
            toggleCollapse,
            invalidateVersion,
            getSubTasks,
            addTask,
            tasks,
          })
        : tasksToDisplay.map(renderRow)}
      {virtualItems && (
        <div
          style={{
            height: `${totalHeight - (virtualItems.at(-1)?.end ?? 0)}px`,
            width: '100%',
            backgroundColor: 'white',
          }}
        />
      )}
      <SC.ResizeLine onMouseDown={handleResizeStart} />
    </SC.Wrapper>
  )
}

export default Grid
