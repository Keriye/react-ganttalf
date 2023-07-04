import { ButtonOverflow, IconButtonStyled } from './Grid.styled'
import { useCallback, useEffect, useRef, useState } from 'react'

import Icon from './SvgIcon'
import ReactDOM from 'react-dom'

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

  const handleClick = useCallback((event: MouseEvent) => {
    const buttonWrapper = buttonWrapperRef.current

    if (!buttonWrapper?.contains(event.target as Node)) {
      setIsOverflowOpen(false)
    }
  }, [])

  useEffect(() => {
    if (isOverflowOpen) {
      document.addEventListener('click', handleClick)
    }

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [handleClick, isOverflowOpen])

  function onButtonClick() {
    if (overflowItems) {
      setIsOverflowOpen((prevState) => !prevState)
    }

    if (onClick) {
      onClick()
    }
  }

  function renderOverflowItems() {
    if (!isOverflowOpen) return null
    if (!buttonWrapperRef.current) return null

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
      buttonWrapperRef.current,
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
