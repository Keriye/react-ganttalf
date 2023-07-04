import { useEffect, useState } from 'react'

import Icon from './SvgIcon'
// import completionSound from './completion-sound.mp3'
import styled from 'styled-components'

const CheckboxCellStyled = styled.div<{ checked: boolean }>`
  @keyframes check {
    0%,
    15% {
      width: 0px;
      height: 0px;
    }
  }

  @keyframes bubble {
    15% {
      transform: scale(1);
      border-width: 0.75rem;
    }
    30%,
    100% {
      transform: scale(1);
      border-width: 0;
    }
  }

  @keyframes confettis {
    0%,
    20% {
      opacity: 0;
    }
    25% {
      opacity: 1;
      box-shadow: 0rem -1.3rem 0 -0.05rem #da3b00, 0.8rem -0.8rem 0 -0.05rem #feab43, 0.8rem 0.08rem 0 -0.05rem #00b457,
        0rem 0.5rem 0 -0.05rem #0078d4, -0.8rem 0.08rem 0 -0.05rem #8763b8, -0.8rem -0.8rem 0 -0.05rem #e3008c;
    }
  }
  width: 16px;
  height: 16px;
  margin-right: 5px;
  margin-left: 10px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  .c-grid-checkbox {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid ${({ checked, theme }) => (checked ? theme.themePrimary : theme.neutralSecondary)};
    background-color: ${({ checked, theme }) => (checked ? theme.themePrimary : 'transparent')};
  }

  .c-grid-checkbox:before,
  .c-grid-checkbox:after {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    content: '';
  }

  .c-grid-checkbox:before,
  .c-grid-checkbox:after {
    animation: inherit;
    animation-timing-function: ease-out;
    animation-duration: 0.6s;
  }

  .c-grid-checkbox:before {
    box-sizing: border-box;
    margin: -0.75rem;
    border: solid 0.75rem ${({ theme }) => theme.themePrimary};
    width: 1.5rem;
    height: 1.5rem;
    transform: scale(0);
  }

  .clicked-checked:before {
    will-change: transform, border-width;
    animation-name: bubble;
  }

  .clicked-checked {
    will-change: height, width;
    animation: check 0.6s cubic-bezier(0.1, 1, 0.42, 1.02);
  }

  .c-grid-checkbox:after {
    margin: -0.2rem;
    width: 0.4rem;
    height: 0.4rem;
    box-shadow: 0rem -1.6rem 0 -0.25rem #da3b00, 1rem -1rem 0 -0.25rem #feab43, 1rem 0.2rem 0 -0.25rem #02ad56,
      0rem 0.8rem 0 -0.25rem #0078d4, -1rem 0.2rem 0 -0.25rem #8763b8, -1rem -1rem 0 -0.25rem #e3008c;
    margin-top: 0.16rem;
  }

  .clicked-checked:after {
    will-change: opacity, box-shadow;
    animation-name: confettis;
  }

  .c-grid-checkbox:hover {
    background-color: ${({ checked, theme }) => {
      if (checked) return theme.themeDarkAlt

      return 'transparent'
    }};
    border: 1px solid ${(props) => props.theme.themePrimary};

    .c-grid-checkbox-icon {
      fill: ${({ checked, theme }) => {
        if (checked) return theme.white
        return theme.themePrimary
      }};
    }
  }

  .c-grid-checkbox-icon {
    fill: ${(props) => props.theme.white};
    position: absolute;
    top: -3px;
    left: -1px;
  }
`

interface ICheckboxProps {
  defaultChecked: boolean
  onChange: (checked: boolean) => void
}

export default function Checkbox({ defaultChecked, onChange }: ICheckboxProps) {
  const [checked, setChecked] = useState(defaultChecked)
  // const [audio] = useState(new Audio(completionSound))
  const [clickedChecked, setClickedChecked] = useState(false)

  useEffect(() => {
    setChecked(defaultChecked)
  }, [defaultChecked])

  function handleChange() {
    setChecked((prevState) => {
      if (!prevState) {
        // audio.play()

        setClickedChecked(true)
        setTimeout(() => setClickedChecked(false), 1000)
      }

      onChange && onChange(!prevState)

      return !prevState
    })
  }

  return (
    <CheckboxCellStyled checked={checked} onClick={handleChange}>
      <div className={`c-grid-checkbox ${clickedChecked ? 'clicked-checked' : ''}`}>
        <Icon className='c-grid-checkbox-icon' width={19} height={19} iconName='CheckMark' />
      </div>
    </CheckboxCellStyled>
  )
}
