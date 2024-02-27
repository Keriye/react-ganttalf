/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react'

import { flushSync } from 'react-dom'

type UseResizeObserverArgs = {
  taskElement: React.MutableRefObject<HTMLElement | null>
  rowHeight: number
  startElement?: boolean
  isFlat?: boolean
}

export default function useResizeObserver({
  taskElement,
  rowHeight,
  startElement,
  isFlat,
  startId,
}: UseResizeObserverArgs): { x: number; y: number } | null {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLElement | null>(document.getElementById('react-ganttalf-tasks-container'))

  const getCoords = useCallback(
    (el: HTMLElement) => {
      const parentEl = el.offsetParent
      const container = containerRef.current
      const box = el.getBoundingClientRect()
      const containerBox = container?.getBoundingClientRect()

      if (!containerBox) return { top: 0, right: 0, bottom: 0, left: 0 }

      return {
        top:
          rowHeight / 2 +
          box.top +
          // window.pageYOffset +
          (parentEl?.scrollTop || 0) -
          containerBox.top,
        right:
          box.right +
          // window.pageXOffset +
          (parentEl?.scrollLeft || 0) -
          containerBox.left,
        bottom: box.bottom + window.pageYOffset + (parentEl?.scrollTop || 0),
        left:
          box.left +
          // window.pageXOffset +
          (parentEl?.scrollLeft || 0) -
          containerBox.left,
      }
    },
    [rowHeight],
  )

  const setStateCoords = useCallback(
    (el: HTMLElement) => {
      if (startId === '77a49494-d8e5-4088-ad51-4a2353c87b10') {
        console.timeLog('getCoords', 3)
      }
      const positions = getCoords(el)
      if (startId === '77a49494-d8e5-4088-ad51-4a2353c87b10') {
        console.timeLog('getCoords', 4)
      }
      const _coords = {
        x: startElement ? positions.right : positions.left,
        y: isFlat ? positions.top : positions.top + 0.08 * rowHeight * (startElement ? 1 : -1),
      }

      if (startId === '77a49494-d8e5-4088-ad51-4a2353c87b10') {
        console.timeLog('getCoords', 5)
      }

      queueMicrotask(() => {
        setCoords(_coords)
      })
      // flushSync(() => {
      //   setCoords(_coords)
      // })
    },
    [getCoords, startElement],
  )

  const observer = useRef(
    new MutationObserver((entries) => {
      if (startId === '77a49494-d8e5-4088-ad51-4a2353c87b10') {
        console.time('getCoords')
      }

      // Only care about the first element, we expect one element ot be watched
      const contentRect = entries[0]

      if (startId === '77a49494-d8e5-4088-ad51-4a2353c87b10') {
        console.timeLog('getCoords', 1)
      }

      setStateCoords(contentRect.target as HTMLElement)
      if (startId === '77a49494-d8e5-4088-ad51-4a2353c87b10') {
        console.timeLog('getCoords', 2)
      }
    }),
  )

  useEffect(() => {
    if (!coords && taskElement.current) {
      setStateCoords(taskElement.current)
    }
  }, [coords, setStateCoords, taskElement])

  useEffect(() => {
    if (taskElement.current) {
      const config = {
        attributes: true,
        childList: false,
        subtree: false,
      }

      observer.current.observe(taskElement.current, config)
    }

    return () => {
      if (taskElement.current) {
        observer.current?.disconnect()
      }
    }
  }, [])

  if (taskElement.current && !coords) {
    const positions = getCoords(taskElement.current)
    return {
      x: startElement ? positions.right : positions.left,
      y: isFlat ? positions.top : positions.top + 0.08 * rowHeight * (startElement ? 1 : -1),
    }
  }

  return coords
}
