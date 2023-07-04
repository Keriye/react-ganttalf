import styled from 'styled-components'

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  if (result) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
  }

  return { r: 0, g: 0, b: 0 }
}

export const GridContainer = styled.div`
  border-right: ${(props) => '1px solid ' + props.theme.neutralLight};
  position: sticky;
  left: 0;
  width: 360px;
  z-index: 110;
`

export const TitleCellStyled = styled.div<{
  taskLevel: number
  isParentTask: boolean
  completed: boolean
  collapsed?: boolean
}>`
  flex-grow: 2;
  margin-left: 8px;
  margin-right: 8px;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: ${({ taskLevel, isParentTask }) => {
    if (!isParentTask) {
      return taskLevel * 10 + 12
    }

    return taskLevel * 10
  }}px;

  &:hover {
    .c-grid-title-icons-wrapper {
      visibility: visible;
    }
  }

  .c-grid-title-input {
    &:focus {
      outline: none;
    }
    text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
    font-weight: ${(props) => (props.isParentTask ? 'bold' : 'normal')};
    color: ${(props) => props.theme.neutralPrimary};

    width: 100%;
    height: 100%;
    border: none;
  }

  .c-grid-title-collapse-button {
    cursor: pointer;
    padding: 0;
    margin-right: 2px;
    border: none;
    background: transparent;
  }

  .c-grid-title-collapse-icon {
    transform: ${({ collapsed }) => (collapsed ? 'rotate(0)' : 'rotate(90deg)')};
    transition: transform 0.1s;
  }

  .c-grid-title-icons-wrapper {
    display: flex;
    visibility: hidden;
    background: ${(props) => props.theme.white};
    position: absolute;
    right: 0;
  }
`

export const IconButtonStyled = styled.button<{
  isOverflowOpen: boolean
}>`
  width: 24px;
  visibility: ${(props) => (props.isOverflowOpen ? 'visible' : 'inerhit')};
  height: 24px;
  cursor: pointer;
  border: none;
  background-color: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  fill: ${(props) => props.theme.themePrimary};
  border-radius: 3px;
  transition: background-color 0.1s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.neutralLight};
  }
`

export const ButtonOverflow = styled.div`
  z-index: 100;
  visibility: visible;
  position: absolute;
  background-color: ${(props) => props.theme.white};
  width: 210px;
  box-shadow: 0 8px 10px rgb(0 0 0 / 10%);
  padding: 8px 0;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.neutralLight};

  .c-grid-icon-button-overflow-layer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .c-grid-icon-button-overflow-item {
    display: flex;
    align-items: center;
    padding: 0px 8px;
    width: 100%;
    height: 36px;
    border: none;
    background-color: transparent;
    cursor: pointer;

    &:hover {
      background-color: ${(props) => props.theme.neutralLighter};
      fill: ${(props) => props.theme.themePrimary};
    }
  }

  .c-grid-icon-button-overflow-item-icon {
    margin-right: 8px;
  }

  .c-grid-button-overflow-divider {
    height: 1px;
    width: 100%;
    background-color: ${(props) => props.theme.neutralLight};
  }
`

export const GridRowStyled = styled.div<{
  height: number
  isFirstItem: boolean
  isLastItem: boolean
}>`
  position: relative;

  .c-grid-row-container {
    height: ${(props) => props.height}px;
    display: flex;
    width: 100%;
    align-items: center;
    background: ${(props) => props.theme.white};
    height: ${(props) => props.height}px;

    border-right: none;
    border-top: 1px solid ${(props) => (props.isFirstItem ? 'none' : 'transparent')};
    border-bottom: 1px solid ${(props) => (props.isLastItem ? props.theme.neutralLight : 'transparent')};

    &:hover {
      border-top: 1px solid ${(props) => props.theme.neutralLight};
      border-bottom: 1px solid ${(props) => props.theme.neutralLight};

      .c-grid-add-new-task {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .c-grid-drag-over {
    position: relative;
    visibility: hidden;
    top: 0;
    fill: ${(props) => props.theme.black};
    right: 0;
    transition: background 0.3s ease-in-out;
    position: absolute;
    height: 40px;
    width: 30%;

    background: ${(props) => {
      const rgb = hexToRgb(props.theme.themeSecondary || '')

      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`
    }};
  }

  .c-grid-drag-over-background {
  }

  .c-grid-drag-over-visible {
    visibility: visible;
  }

  .c-grid-drag-over-icon {
    fill: ${(props) => props.theme.neutralPrimaryAlt};
    position: absolute;
    height: 100%;
    left: 10px;
    opacity: 1;
  }

  .c-grid-row-container-drag-over-top {
    border-top: 1px solid ${(props) => props.theme.themePrimary};
  }

  .c-grid-row-container-drag-over-bottom {
    border-bottom: 1px solid ${(props) => props.theme.themePrimary};
  }

  .c-grid-row-container-drag-over,
  .c-grid-row-container-drag-over * {
    pointer-events: none !important;
  }

  .c-grid-add-new-task {
    display: none;

    border: 1px solid ${(props) => props.theme.neutralTertiary};
    height: 6px;
    width: 6px;
    background: ${(props) => props.theme.white};
    border-radius: 50%;
    position: absolute;
    z-index: 100;
    left: 20px;
    cursor: pointer;

    &:hover {
      height: 16px;
      width: 16px;
      left: 15px;
      border: 1px solid ${(props) => props.theme.themePrimary};

      .c-grid-add-task-icon {
        display: inline;
      }
    }
  }

  .c-grid-add-new-task-top {
    top: -3px;

    &:hover {
      top: -8px;
    }
  }

  .c-grid-add-new-task-bottom {
    bottom: -3px;

    &:hover {
      bottom: -8px;
    }
  }

  .c-grid-add-task-icon {
    display: none;
    fill: ${(props) => props.theme.themePrimary};
  }

  .c-grid-gripper-sort-order-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 70px;

    &:hover {
      .c-grid-gripper-wrapper {
        opacity: 1;
      }
    }
  }

  .c-grid-gripper-wrapper {
    display: flex;
    align-items: center;
    fill: ${(props) => props.theme.neutralTertiary};
    transition: background 0.1s ease-in-out, opacity 0.1s ease-in-out;
    opacity: 0;
    cursor: grab;
    border-radius: 3px;

    &:hover {
      opacity: 1;
      background: ${(props) => props.theme.neutralLight};
    }
  }

  .c-grid-sort-order {
    color: ${(props) => props.theme.neutralPrimary};
    font-size: 12px;
    font-weight: 400;
    height: 100%;
    min-width: 24px;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
  }

  .c-grid-avatar-wrapper {
    padding-right: 16px;
  }
`
