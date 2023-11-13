/* eslint-disable react/no-unknown-property */
import { useLayoutEffect, useRef, useState } from 'react'

import Arrow from './Arrow'
import { IConfig } from '../../types'
import { useConfigStore } from '../../Store'
import useResizeObserver from './useResizeObserver'
import { useTheme } from 'styled-components'

type ConnectorProps = {
  startId: string
  endId?: string
  mousePosition?: { x: number; y: number }
  hiddenItems?: number
  flatStart?: boolean
  flatEnd?: boolean
}

export default function Connector({ startId, endId, mousePosition, hiddenItems, flatStart, flatEnd }: ConnectorProps) {
  const config = useConfigStore((state) => state.config)
  const isCommon = !hiddenItems && !mousePosition

  const element1 = useRef<HTMLElement | null>(null)
  const element2 = useRef<HTMLElement | null>(null)

  const theme = useTheme()

  const [initialized, setInitialized] = useState(false)
  const { rowHeight } = config

  const coordsStart = useResizeObserver({ taskElement: element1, rowHeight, startElement: true, isFlat: flatStart })
  const coordsEnd = useResizeObserver({ taskElement: element2, rowHeight, startElement: false, isFlat: flatEnd })

  useLayoutEffect(() => {
    if (!initialized) {
      const el1 = document.getElementById('task-bar-' + startId)
      const el2 = document.getElementById('task-bar-' + endId)

      if ((el1 && el2) || (el1 && !isCommon)) {
        element1.current = el1

        if (el2) {
          element2.current = el2
        }
      }

      setInitialized(true)
    }
  }, [initialized, startId, endId, isCommon])

  if (!initialized) return null

  if (isCommon && (!element1.current || !element2.current)) return null

  if (isCommon && (!coordsEnd || !coordsStart)) return null

  if (!isCommon && !coordsStart) return null

  if (!coordsStart) return null

  const endPoint = (coordsEnd || mousePosition || { ...coordsStart, x: coordsStart.x + 40 }) as { x: number; y: number }

  return (
    <>
      <NarrowSConnector
        stroke={theme.neutralSecondaryAlt}
        strokeWidth={1}
        endPoint={endPoint}
        startId={startId}
        endId={endId}
        startPoint={coordsStart}
        roundCorner={true}
        config={config}
        endArrow={true}
        arrowSize={5}
      />
      {!!hiddenItems && (
        <text x={endPoint.x + 6} y={endPoint.y + 4}>
          +{hiddenItems}
        </text>
      )}
    </>
  )
}

interface INarrowSConnectorProps {
  stroke?: string
  strokeWidth: number
  endPoint: { x: number; y: number }
  startId?: string
  endId?: string
  startPoint: { x: number; y: number }
  roundCorner: boolean
  config: IConfig
  endArrow: boolean
  arrowSize: number
  direction?: string
  stem?: number
  grids?: number
  minStep?: number
}

function NarrowSConnector(props: INarrowSConnectorProps) {
  const coordinates = {
    start: props.startPoint,
    end: props.endPoint,
  }

  const distanceX = coordinates.end.x - coordinates.start.x
  const distanceY = coordinates.end.y - coordinates.start.y

  const stem = props.stem || 8
  const grids = props.grids || 5

  const stepX = distanceX / grids
  const stepY = distanceY / grids

  // if (stem >= Math.abs(distanceX)) {
  //   stem = Math.abs(distanceX) - Math.abs(stepX);
  // }

  let step = Math.min(Math.abs(stepX), Math.abs(stepY))

  step = Math.min(step, props.minStep || step)

  if (step > 8) {
    step = 8
  }

  const cArrowSize = props.arrowSize || (props.strokeWidth ? props.strokeWidth * 3 : 10)

  function corner12() {
    const factor = distanceX * distanceY >= 0 ? 1 : -1

    const path = `M
                    ${coordinates.start.x} ${coordinates.start.y} 
                    h ${stem}
                    q ${step} 0 
                    ${step} ${step * factor}
                    V ${coordinates.end.y - step * factor}
                    q ${0} ${step * factor}
                    ${step} ${step * factor}
                    H ${coordinates.end.x}
                  `

    return (
      <svg end-id={props.endId} start-id={props.startId} width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
        <path d={path} stroke={props.stroke || 'orange'} strokeWidth={props.strokeWidth || 3} fill='transparent' />
        <Arrow tip={coordinates.end} size={cArrowSize} rotateAngle={0} stroke={props.stroke || 'orange'} />
      </svg>
    )
  }

  function corner34() {
    let factor = distanceX * distanceY > 0 ? 1 : -1
    step = 8

    const belowAndFirst20px = factor === 1 && distanceX > 0 && distanceX < 20
    const aboveAndFirst20px = factor === -1 && distanceX > 0 && distanceX < 20

    if (belowAndFirst20px) {
      factor = -1
    } else if (aboveAndFirst20px) {
      factor = 1
    }

    const above = factor === 1
    const below = factor === -1

    // calc endpoint of first vertical line

    // original is full height / 2
    let endPoint = distanceY / 2 + step * 2 * factor

    // max point is end of row
    const maxEndpoint = props.config.rowHeight / 2 + step * 2 * factor
    const maxEndpointAbove = (props.config.rowHeight / 2 + step * -2 * factor) * -1

    if (below && endPoint >= maxEndpoint) {
      endPoint = maxEndpoint
    } else if (above && endPoint <= maxEndpointAbove) {
      endPoint = maxEndpointAbove
    }

    const pathr2l = `M
                    ${coordinates.start.x} ${coordinates.start.y} 
                    h ${stem} 
                    q ${step} 0 
                    ${step} ${-step * factor}
                    v ${endPoint}
                    q 0 ${-step * factor}
                    ${-step} ${-step * factor}
                    h ${distanceX - stem * 2}
                    q ${-step} 0
                    ${-step} ${-step * factor}
                    V ${coordinates.end.y + step * factor}
                    q 0 ${-step * factor}
                    ${step} ${-step * factor}
                    H ${coordinates.end.x}
                  `

    const path = pathr2l // default

    return (
      <svg start-id={props.startId} end-id={props.endId} width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
        <path d={path} stroke={props.stroke || 'orange'} strokeWidth={props.strokeWidth || 3} fill='transparent' />
        <Arrow
          tip={coordinates.end}
          size={cArrowSize}
          rotateAngle={props.direction === 'r2r' ? 180 : 0}
          stroke={props.stroke || 'orange'}
        />
      </svg>
    )
  }

  // corner 1 & 2
  // if (distanceX >= 25) {
  if (distanceX >= 20) {
    return corner12()
  }

  // corner 4 & 3
  else {
    return corner34()
  }
}
