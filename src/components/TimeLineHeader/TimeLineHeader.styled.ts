import styled from 'styled-components'

export const Wrapper = styled.div<{ width: number }>`
  height: 50px;
  width: ${(props) => props.width}px;
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  position: sticky;
  top: 0;
  z-index: 120;
  pointer-events: none;
  border-bottom: 1px solid #edebe9;
  background-color: white;
`

export const DateMarking = styled.div<{
  columnWidth: number
  index: number
}>`
  bottom: 3px;
  font-size: 11px;
  left: ${({ columnWidth, index }) => index * columnWidth}px;
  position: absolute;
  text-align: left;
  white-space: nowrap;
`

export const TimeLineDateRange = styled.div<{
  columnWidth: number
  daysFromStart: number
}>`
  position: absolute;
  left: ${({ daysFromStart, columnWidth }) => daysFromStart * columnWidth}px;
  bottom: 6px;
  background: ${({ theme }) => theme.white};
`

export const TimeLineDaysWrapper = styled.div<{
  columnWidth: number
  columnCount: number
  visibleCount: number
  coefficient: number
}>`
  box-shadow: 0 2px 3px 0 rgb(0 0 0 / 10%);

  background: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.themePrimary};
  width: ${({ columnWidth, columnCount, visibleCount }) =>
    Math.max(columnWidth * columnCount, visibleCount === 2 ? 32 : 14)}px;
  height: 22px;

  border-radius: 3px;
  display: flex;
  flex: 0 0 auto;
  position: relative;
  align-items: center;
  justify-content: space-between;

  gap: ${({ visibleCount, columnCount }) => (visibleCount === 2 && visibleCount !== columnCount ? 4 : 0)}px;

  & > p {
    display: none;
    justify-content: center;
    text-align: center;
    font-size: 12px;
    flex: 1 1 ${({ columnWidth }) => columnWidth}px;

    &:nth-child(${({ coefficient }) => coefficient}n + 1),
    &:last-of-type {
      display: flex;
    }

    &:first-of-type,
    &:last-of-type {
      background: ${({ theme }) => theme.themePrimary};
      color: ${({ theme }) => theme.white};
    }
  }
`
export const TimeLineDaysInfo = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  top: -104%;

  & > div {
    display: flex;
    min-width: 100%;
    flex-wrap: nowrap;
    justify-content: space-between;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.themePrimary};
  }
`
