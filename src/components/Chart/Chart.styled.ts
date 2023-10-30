import styled, { css } from 'styled-components'

export const ChartWrapper = styled.div<{ width: number }>`
  width: ${(props) => props.width}px;
  position: absolute;
  top: 50px;
  //top: 0;
`

export const ChartContainer = styled.div`
  width: 100%;
  position: relative;
`

export const ResizeEdge = styled.div<{ endpoint: 'start' | 'end' }>`
  cursor: ew-resize;
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  ${({ endpoint }) =>
    endpoint === 'start'
      ? css`
          left: 0;
        `
      : css`
          right: 0;
        `}
`

export const TodayIndicator = styled.div<{ indicatorPosition: number }>`
  position: absolute;
  width: 1px;
  top: 0;
  bottom: 0;
  z-index: 100;
  pointer-events: none;
  background-color: #f00;
  left: ${({ indicatorPosition }) => indicatorPosition}px;

  //&:before {
  //  position: absolute;
  //  content: ' ';
  //  width: 2px;
  //  height: 2px;
  //  border-radius: 100%;
  //  color: inherit;
  //}
`

export const RowStyled = styled.div<{ type: number; rowHeight: number; segmentWidth: number; isParentTask: boolean }>`
  width: 100%;
  ${({ theme, segmentWidth }) =>
    segmentWidth > 20 &&
    css`
      background: left / ${segmentWidth}px repeat
        linear-gradient(to right, transparent 71.43%, ${theme.neutralLighterAlt} 71.43%);
    `}
  border-bottom: 1px solid ${({ theme }) => theme.neutralLight};

  &:hover {
    background: ${({ theme }) => theme.neutralLighterAlt};

    .c-chart-bar-task {
      height: ${({ rowHeight, isParentTask, type }) => {
        if (isParentTask) return 10

        if (type === 2) return undefined

        return rowHeight * 0.5
      }}px;
      border: 2px solid ${({ theme }) => theme.themePrimary};

      box-shadow: rgb(0 0 0 / 11%) 0px 1.2px 3.6px 0px, rgb(0 0 0 / 13%) 0px 6.4px 14.4px 0px;
    }
  }
`

export const NonWorkingSegment = styled.div<{ index: number; columnWidth: number; chartHeight: number }>`
  background: ${({ theme }) => theme.neutralLighterAlt};
  width: ${({ columnWidth }) => columnWidth}px;
  height: ${({ chartHeight }) => chartHeight}px;
  position: absolute;
  left: ${({ index, columnWidth }) => index * columnWidth}px;
  top: 0px;
`

const TaskPosition = styled.div<{ daysFromStart: number; columnWidth: number }>`
  position: absolute;
  left: ${({ daysFromStart, columnWidth }) => columnWidth * daysFromStart}px;
`

export const Task = styled(TaskPosition)<{
  rowHeight: number
  columnWidth: number
  isParentTask: boolean
  daysLength: number
}>`
  z-index: 110;
  display: flex;
  /* transition: left 0.1s, width 0.1s; */
  align-items: center;
  height: ${({ rowHeight }) => rowHeight}px;
  width: ${({ columnWidth, daysLength }) => columnWidth * daysLength}px;

  &:hover {
    .c-chart-bar-task-link {
      visibility: visible;
    }

    .c-chart-bar-task-link-wrapper {
      background: ${({ theme }) => theme.neutralLighterAlt};
    }
  }

  .c-chart-bar-task-link {
    cursor: pointer;
    visibility: hidden;
    background: transparent;
    min-height: ${({ rowHeight }) => {
      return rowHeight * 0.5
    }}px;
    min-width: ${({ rowHeight }) => rowHeight * 0.5}px;
    align-items: center;
    justify-content: center;
    display: flex;
    border: 2px solid transparent;
    border-radius: 50%;
  }

  .c-chart-bar-task-link-wrapper {
    align-items: center;
    display: flex;
    min-height: ${({ rowHeight }) => rowHeight * 0.7}px;
    min-width: 26px;
    position: absolute;

    &:hover {
      .c-chart-bar-task-link {
        visibility: visible;
        background: ${({ theme }) => theme.neutralLighter};
        border: 2px solid ${({ theme }) => theme.themePrimary};
      }
    }
  }

  .c-chart-bar-task-link-small {
    background: ${({ theme }) => theme.themePrimary};
    height: ${({ rowHeight }) => rowHeight * 0.2}px;
    width: ${({ rowHeight }) => rowHeight * 0.2}px;
    border-radius: 50%;
  }

  .link-start {
    left: -26px;
    min-height: ${({ rowHeight }) => rowHeight * 0.5}px;
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
    justify-content: start;

    &:hover {
      background: ${({ theme }) => theme.neutralLighter};
    }
  }

  .link-end {
    min-height: ${({ rowHeight }) => rowHeight * 0.5}px;
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    justify-content: end;
    right: -26px;

    &:hover {
      background: ${({ theme }) => theme.neutralLighter};
    }
  }

  .c-chart-bar-task {
    transition: height 0.05s;
    cursor: ${({ isParentTask }) => {
      if (isParentTask) return 'ew-resize'

      return 'pointer'
    }};
    background: ${({ theme, isParentTask }) => {
      if (isParentTask) return theme.themePrimary

      return theme.themeLight
    }};
    height: ${({ rowHeight, isParentTask }) => {
      if (isParentTask) return 4

      return rowHeight * 0.5
    }}px;
    border-radius: 3px;
    width: 100%;
    border: 1px solid ${({ theme }) => theme.themePrimary};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .c-chart-bar-task.completed {
    background: ${({ theme }) => {
      return theme.themePrimary
    }};
  }

  .c-chart-bar-task:hover {
    .c-chart-bar-task-draggable-indicator {
      visibility: visible;
    }
  }

  .c-chart-bar-task-draggable-indicator {
    visibility: hidden;
    width: 2px;
    background: ${({ theme }) => theme.themePrimary};
    height: ${({ rowHeight }) => rowHeight * 0.35}px;
    margin: 0 4px;
  }

  .c-chart-bar-task-connector-point {
    height: 1px;
    width: 1px;
    position: absolute;
  }

  .connector-point-start {
    left: 0px;
  }

  .connector-point-end {
    right: 0px;
  }
`

export const MileStone = styled(TaskPosition)<{
  rowHeight: number
  isParentTask: boolean
}>`
  display: flex;
  /* transition: left 0.1s, width 0.1s; */
  align-items: center;
  /* transform: rotate(45deg); */
  z-index: 110;
  justify-content: center;
  height: ${({ rowHeight }) => {
    return rowHeight
  }}px;
  width: ${({ rowHeight }) => rowHeight * 0.8}px;

  &:hover {
    .c-chart-bar-task-link {
      visibility: visible;
    }

    .c-chart-bar-task-link-wrapper {
      background: ${({ theme }) => theme.neutralLighterAlt};
    }
  }

  .c-chart-bar-task-link {
    cursor: pointer;
    visibility: hidden;
    background: transparent;
    min-height: ${({ rowHeight }) => {
      return rowHeight * 0.5
    }}px;
    min-width: ${({ rowHeight }) => rowHeight * 0.5}px;
    align-items: center;
    justify-content: center;
    display: flex;
    border: 2px solid transparent;
    border-radius: 50%;
  }

  .c-chart-bar-task-link-wrapper {
    align-items: center;
    display: flex;
    min-height: ${({ rowHeight }) => rowHeight * 0.7}px;
    min-width: 26px;
    position: absolute;

    &:hover {
      .c-chart-bar-task-link {
        visibility: visible;
        background: ${({ theme }) => theme.neutralLighter};
        border: 2px solid ${({ theme }) => theme.themePrimary};
      }
    }
  }

  .c-chart-bar-task-link-small {
    background: ${({ theme }) => theme.themePrimary};
    height: ${({ rowHeight }) => rowHeight * 0.2}px;
    width: ${({ rowHeight }) => rowHeight * 0.2}px;
    border-radius: 50%;
  }

  .link-start {
    left: -26px;
    min-height: ${({ rowHeight }) => rowHeight * 0.5}px;
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
    justify-content: start;

    &:hover {
      background: ${({ theme }) => theme.neutralLighter};
    }
  }

  .link-end {
    min-height: ${({ rowHeight }) => rowHeight * 0.5}px;
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    justify-content: end;
    right: -26px;

    &:hover {
      background: ${({ theme }) => theme.neutralLighter};
    }
  }

  .c-chart-bar-task {
    transition: height 0.05s;
    cursor: ${({ isParentTask }) => {
      if (isParentTask) return 'ew-resize'

      return 'pointer'
    }};
    background: ${({ theme, isParentTask }) => {
      if (isParentTask) return theme.themePrimary

      return theme.themeLight
    }};
    transform: rotate(45deg);
    height: ${({ rowHeight }) => {
      return rowHeight * 0.6
    }}px;
    border-radius: 3px;
    width: ${({ rowHeight }) => {
      return rowHeight * 0.6
    }}px;
    border: 1px solid ${({ theme }) => theme.themePrimary};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .c-chart-bar-task.completed {
    background: ${({ theme }) => {
      return theme.themePrimary
    }};
  }

  .c-chart-bar-task:hover {
    .c-chart-bar-task-draggable-indicator {
      visibility: visible;
    }
  }

  .c-chart-bar-task-draggable-indicator {
    visibility: hidden;
    width: 2px;
    background: ${({ theme }) => theme.themePrimary};
    height: ${({ rowHeight }) => rowHeight * 0.35}px;
    margin: 0 4px;
  }

  .c-chart-bar-task-connector-point {
    height: 1px;
    width: 1px;
    position: absolute;
  }

  .connector-point-start {
    left: 0px;
  }

  .connector-point-end {
    right: 0px;
  }
`
