import { useEffect, useState } from 'react'

import Connector from './Connector'
import { ConnectorsStyled } from './Connectors.styled'
import { useTasksStore } from '../../Store'
import useVirtualizationStore from '../../Store/VirtualizationStore'

interface IConnector {
  taskId: string
  successor: string
  key: string
}

function Connectors() {
  const tasks = useTasksStore((state) => state.tasks)
  const [connectors, setConnectors] = useState<IConnector[]>([])
  const virtualItems = useVirtualizationStore((state) => state.virtualItems)

  useEffect(() => {
    const visibleTasks = virtualItems ? virtualItems.map(({ index }) => tasks[index]) : tasks

    if (visibleTasks?.length) {
      const _connectors = visibleTasks.flatMap((task) => {
        const { successors } = task

        if (!successors?.length) return []

        return successors.map((successor) => {
          return {
            taskId: task.id,
            successor,
            key: `${task.id}-${successor}-${Math.random()}`,
          }
        })
      })

      setConnectors(_connectors)
    }
  }, [tasks, virtualItems])

  function renderConnector(connector: IConnector) {
    return <Connector key={connector.key} startId={connector.taskId} endId={connector.successor} />
  }

  if (!connectors?.length) return null

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
