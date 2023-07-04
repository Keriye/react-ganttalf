import { GridContainer } from './Grid.styled'
import GridRow from './GridRow'
import { ITask } from '../../types'
import { findParentTask } from '../../utils/helpers'
import { useTasksStore } from '../../Store'

function Grid() {
  const tasks = useTasksStore((state) => state.tasks)

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
      if (parentTask.collapsed) return true
      parentTask = findParentTask(parentTask, tasks)
    }

    return false
  }

  function renderRow(task: ITask, index: number) {
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

  return <GridContainer>{tasks.map(renderRow)}</GridContainer>
}

export default Grid
