/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react'

interface IResizeObserverProps {
  taskElement: React.MutableRefObject<HTMLElement | null>
  rowHeight: number
  startElement?: boolean
}

export default function useResizeObserver({
  taskElement,
  rowHeight,
  startElement,
}: IResizeObserverProps): { x: number; y: number } | null {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)

  const getCoords = useCallback(
    (el: HTMLElement) => {
      const parentEl = el.offsetParent
      const container = document.getElementById('react-ganttalf-tasks-container')
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
      const positions = getCoords(el)
      const _coords = {
        x: startElement ? positions.right : positions.left,
        y: positions.top,
      }

      setCoords(_coords)
    },
    [getCoords, startElement],
  )

  const observer = useRef(
    new MutationObserver((entries) => {
      // Only care about the first element, we expect one element ot be watched
      const contentRect = entries[0]

      setStateCoords(contentRect.target as HTMLElement)
    }),
  )

  useEffect(() => {
    if (!coords && taskElement.current) {
      setStateCoords(taskElement.current)
    }
  }, [coords, setStateCoords, taskElement])

  useEffect(() => {
    if (taskElement.current) {
      const config = { attributes: true, childList: false, subtree: false }
      observer.current.observe(taskElement.current, config)
    }

    return () => {
      if (taskElement.current) {
        observer.current?.disconnect()
      }
    }
  }, [taskElement, observer])

  return coords
}
