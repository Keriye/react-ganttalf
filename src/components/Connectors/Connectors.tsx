import React, { useMemo } from 'react'

import Connector from './Connector'
import { ConnectorsStyled } from './Connectors.styled'
import { ITask } from '../../types'
import { useTasksStore } from '../../Store'

type ConnectorsProps = {
  tasks: ITask[]
}

interface IConnector {
  taskId: string
  successor: string
  key: string
  hiddenItems?: number
  flatStart?: boolean
  flatEnd?: boolean
}

const Connectors: React.FC<ConnectorsProps> = ({ tasks }) => {
  const visibleTasks = useTasksStore((state) => state.visibleTasks)

  const connectors = useMemo(() => {
    if (!tasks?.length) return []

    return tasks.flatMap((task) => {
      const { successors } = task

      if (!successors?.length) return []

      let amountOfHiddenSuccessors = 0

      const successorConnetions = successors.map((successor) => {
        const successorTask = tasks.find(({ id }) => id === successor)

        if (!successorTask) {
          amountOfHiddenSuccessors++
        }

        return {
          taskId: task.id,
          flatStart: task.type === 2 || !!task.subTaskIds?.length,
          flatEnd: successorTask?.type === 2 || !!successorTask?.subTaskIds?.length,
          successor,
          key: `${task.id}-${successor}-${visibleTasks?.length}`,
        }
      })

      return amountOfHiddenSuccessors
        ? [
            ...successorConnetions,
            {
              taskId: task.id,
              flatStart: true,
              flatEnd: true,
              hiddenItems: amountOfHiddenSuccessors,
              successor: 'hidden',
              key: `${task.id}-hidden-${visibleTasks?.length}`,
            },
          ]
        : successorConnetions
    })
  }, [tasks, visibleTasks])

  const renderConnector = (connector: IConnector) => {
    return (
      <Connector
        key={connector.key}
        startId={connector.taskId}
        endId={connector.successor}
        hiddenItems={connector.hiddenItems}
        flatStart={connector.flatStart}
        flatEnd={connector.flatEnd}
      />
    )
  }

  return (
    <ConnectorsStyled
      id='c-chart-connectors'
      style={{ position: 'absolute', pointerEvents: 'none', inset: 0 }}
      width='100%'
      height='100%'
      xmlns='http://www.w3.org/2000/svg'
    >
      {connectors.map(renderConnector)}
    </ConnectorsStyled>
  )
}

export default Connectors
