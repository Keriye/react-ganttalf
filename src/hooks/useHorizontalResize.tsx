import React, { useCallback, useEffect, useRef, useState } from 'react'

const useHorizontalResize = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const initResizePosition = useRef<{ shift: number | null; width: number | null }>({ shift: null, width: null })
  const [isResizing, setIsResizing] = useState(false)

  const handleResizeStart: React.MouseEventHandler<HTMLDivElement> = useCallback((event) => {
    initResizePosition.current = { width: containerRef.current?.clientWidth ?? null, shift: event.clientX }
    setIsResizing(true)
  }, [])

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
  }, [])

  const handleResizeMove = useCallback(
    (event: MouseEvent) => {
      if (isResizing && containerRef.current && typeof initResizePosition.current.shift === 'number') {
        const delta = event.clientX - initResizePosition.current.shift

        containerRef.current.style.width = `${(initResizePosition.current.width ?? 0) + delta}px`
      }
    },
    [isResizing],
  )

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mouseup', handleResizeEnd)
      document.addEventListener('mousemove', handleResizeMove)
    }

    return () => {
      document.removeEventListener('mouseup', handleResizeEnd)
      document.removeEventListener('mousemove', handleResizeMove)
    }
  }, [handleResizeEnd, handleResizeMove, isResizing])

  return {
    isResizing,
    setIsResizing,
    containerRef,
    handleResizeStart,
  }
}

export default useHorizontalResize
