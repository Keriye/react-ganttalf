import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

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
}: UseResizeObserverArgs): { x: number; y: number } | null {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLElement | null>(document.getElementById('react-ganttalf-tasks-container'))

  const getCoords = useCallback(
    (el: HTMLElement) => {
      const parentEl = el.offsetParent
      const container = containerRef.current
      const box = el.getBoundingClientRect()
      const containerBox = container?.getBoundingClientRect()

      if (!containerBox) {
        return { top: 0, right: 0, bottom: 0, left: 0 }
      }

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
        y: isFlat ? positions.top : positions.top + 0.08 * rowHeight * (startElement ? 1 : -1),
      }

      setCoords(_coords)
    },
    [getCoords, isFlat, rowHeight, startElement],
  )

  const observer = useRef(
    new MutationObserver((entries) => {
      // Only care about the first element, we expect one element ot be watched
      const contentRect = entries[0]

      setStateCoords(contentRect.target as HTMLElement)
    }),
  )

  useLayoutEffect(() => {
    containerRef.current = document.getElementById('react-ganttalf-tasks-container')
  }, [])

  useEffect(() => {
    if (!coords && taskElement.current) {
      setStateCoords(taskElement.current)
    }
  }, [coords, setStateCoords, taskElement])

  useEffect(() => {
    const currentTaskElement = taskElement.current
    const currentObserver = observer.current

    if (currentTaskElement) {
      const config = {
        attributes: true,
        childList: false,
        subtree: false,
      }

      currentObserver.observe(currentTaskElement, config)
    }

    return () => {
      // if (currentTaskElement) {
      currentObserver?.disconnect()
      // }
    }
  }, [taskElement])

  if (taskElement.current && !coords) {
    const positions = getCoords(taskElement.current)
    return {
      x: startElement ? positions.right : positions.left,
      y: isFlat ? positions.top : positions.top + 0.08 * rowHeight * (startElement ? 1 : -1),
    }
  }

  return coords
}
