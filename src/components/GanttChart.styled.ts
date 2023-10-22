import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  line-height: 20px;
  position: relative;
  max-height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.neutralPrimary};

  * {
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
      'Droid Sans', 'Helvetica Neue', sans-serif;
  }
`

export const ScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: auto;

  //-ms-overflow-style: none; /* IE and Edge */
  //scrollbar-width: none; /* Firefox */
  //
  //&::-webkit-scrollbar {
  //  display: none;
  //}
`

export const ModalWrapper = styled.div<{ left?: number; right?: number; top?: number; bottom?: number }>`
  position: absolute;
  z-index: 150;
  ${({ top }) =>
    top &&
    css`
      top: ${top}px;
    `}
  ${({ bottom }) =>
    bottom &&
    css`
      bottom: ${bottom}px;
    `}
  ${({ left }) =>
    left &&
    css`
      left: ${left}px;
    `}
  ${({ right }) =>
    right &&
    css`
      right: ${right}px;
    `}
`
