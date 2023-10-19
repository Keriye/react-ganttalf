import { ButtonOverflow, IconButtonStyled } from './Grid.styled'
import { useCallback, useEffect, useRef, useState } from 'react'

import Icon from './SvgIcon'
import ReactDOM from 'react-dom'
// import { ActionContext } from '../GanttChart'
import useDomStore from '../../Store/DomStore'

interface IOverflowItem {
  iconName?: string
  key: string
  text?: string
  disabled?: boolean
  type?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

interface IIconButoonProps {
  onClick?: () => void
  iconName?: string
  overflowItems?: IOverflowItem[]
  className?: string
}

export default function IconButton({ onClick, iconName, overflowItems, className }: IIconButoonProps) {
  const [isOverflowOpen, setIsOverflowOpen] = useState(false)
  const buttonWrapperRef = useRef<HTMLDivElement>(null)

  const modalNode = useDomStore((state) => state.modalNode)
  const wrapperNode = useDomStore((state) => state.wrapperNode)

  const handleClick = useCallback((event: Event) => {
    const buttonWrapper = buttonWrapperRef.current

    if (!buttonWrapper?.contains(event.target as Node)) {
      setIsOverflowOpen(false)
    }
  }, [])

  useEffect(() => {
    if (isOverflowOpen) {
      document.addEventListener('click', handleClick)
      wrapperNode?.addEventListener('scroll', handleClick, { once: true })
    }

    return () => {
      document.removeEventListener('click', handleClick)
      wrapperNode?.removeEventListener('scroll', handleClick)
    }
  }, [handleClick, isOverflowOpen, wrapperNode])

  function onButtonClick() {
    if (overflowItems) {
      const { left: wrapperLeft = 0, top: wrapperTop = 0 } = wrapperNode?.getBoundingClientRect() ?? {}
      const { right = 0, top = 0 } = buttonWrapperRef.current?.getBoundingClientRect() ?? {}

      const toBottom = top + 490 > window.innerHeight
      const toRight = right + 220 > window.innerWidth

      const modalPosition = {
        ...(toBottom ? { bottom: 500 } : { top: top - wrapperTop }),
        ...(toRight ? { right: 220 } : { left: right + 5 - wrapperLeft }),
      }

      useDomStore.setState({ modalShift: modalPosition })

      setIsOverflowOpen((prevState) => !prevState)
    }

    if (onClick) {
      onClick()
    }
  }

  function renderOverflowItems() {
    if (!isOverflowOpen) return null
    // if (!buttonWrapperRef.current) return null
    if (!modalNode) return null

    return ReactDOM.createPortal(
      <ButtonOverflow>
        {overflowItems?.map((item) => {
          if (item.type === 'divider') {
            return <div key={item.key} className='c-grid-button-overflow-divider' />
          }

          return (
            <button
              disabled={item.disabled}
              className='c-grid-icon-button-overflow-item'
              key={item.key}
              onClick={(event) => {
                item.onClick?.(event)
              }}
            >
              {item.iconName && (
                <Icon
                  width={16}
                  height={16}
                  className='c-grid-icon-button-overflow-item-icon'
                  iconName={item.iconName}
                />
              )}
              {item.text}
            </button>
          )
        })}
      </ButtonOverflow>,
      modalNode,
    )
  }

  return (
    <div ref={buttonWrapperRef}>
      <IconButtonStyled isOverflowOpen={isOverflowOpen} onClick={onButtonClick} className={className}>
        <Icon width={16} height={16} iconName={iconName} />
      </IconButtonStyled>
      {renderOverflowItems()}
    </div>
  )
}
