import styled from 'styled-components'

export const TimeLineHeaderContainer = styled.div`
  min-height: 50px;
  display: flex;
  flex-direction: row;
  position: relative;
  overflow: auto;
  width: 100%;
  pointer-events: none;
  border-bottom: 1px solid #edebe9;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none;
  }
`

export const DateMarking = styled.div<{
  columnWidth: number
  index: number
}>`
  bottom: 3px;
  font-size: 11px;
  width: 100%;
  left: ${({ columnWidth, index }) => index * columnWidth}px;
  position: absolute;
  text-align: left;
`

export const TimeLineDateRangeStyled = styled.div<{
  columnWidth: number
  daysFromStart: number
}>`
  position: absolute;
  left: ${({ daysFromStart, columnWidth }) => daysFromStart * columnWidth}px;
  bottom: 6px;
  background: ${({ theme }) => theme.white};

  .c-row-timeline-range {
    font-size: 12px;
    color: ${({ theme }) => theme.themePrimary};
    font-weight: 600;
    display: flex;
    margin-left: 3px;
    margin-right: 3px;
    justify-content: space-between;
  }

  .c-row-timeline-days {
    box-shadow: 0 2px 3px 0 rgb(0 0 0 / 10%);

    background: ${({ theme }) => theme.white};
    border: 1px solid ${({ theme }) => theme.themePrimary};
    height: 22px;

    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  .c-row-timeline-day {
    width: ${({ columnWidth }) => columnWidth}px;
    text-align: center;
    font-size: 12px;
  }

  .c-row-timeline-day-end,
  .c-row-timeline-day-start {
    background: ${({ theme }) => theme.themePrimary};
    color: ${({ theme }) => theme.white};
  }
`
