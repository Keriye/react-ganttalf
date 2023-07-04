import Connector from './Connector'
import { ITask } from '../../types'
import ReactDOM from 'react-dom'
import useMousePosition from './useMousePosition'

export default function NewLinkConnector({ task }: { task: ITask }) {
  let mousePosition = useMousePosition()

  const connectorsContainer = document.getElementById('c-chart-connectors')

  if (!connectorsContainer) return null
  const containerBox = connectorsContainer.getBoundingClientRect()

  mousePosition = {
    x: mousePosition.x - containerBox.left,
    y: mousePosition.y - containerBox.top,
  }

  return ReactDOM.createPortal(<Connector startId={task.id} mousePosition={mousePosition} />, connectorsContainer)
}
