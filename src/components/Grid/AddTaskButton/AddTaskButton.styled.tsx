import styled from 'styled-components'

export const Wrapper = styled.div<{ rowHeight: number }>`
  background: ${({ theme }) => theme.white};
  border-bottom: 1px solid ${({ theme }) => theme.neutralLight};
  border-top: 1px solid ${({ theme }) => theme.neutralLight};
  z-index: 111;
  bottom: 0;
  left: 0;
  right: 0;
  position: sticky;
  width: 100%;

  .add-task-button {
    align-items: center;
    background: ${({ theme }) => theme.white};
    border-right: 1px solid ${({ theme }) => theme.neutralLight};
    border: none;
    color: ${({ theme }) => theme.themePrimary};
    cursor: pointer;
    display: flex;
    fill: ${({ theme }) => theme.themePrimary};
    height: ${({ rowHeight }) => rowHeight}px;
    max-width: 360px;
    padding-left: 80px;
    width: 360px;

    &:hover {
      box-shadow: rgb(0 0 0 / 13%) 0px 1.6px 3.6px 0px, rgb(0 0 0 / 11%) 0px 0.3px 0.9px 0px;
    }
  }

  .add-task-button__label {
    padding-left: 20px;
  }
`

export const EditWrapper = styled.div<{ rowHeight: number }>`
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  padding-left: 80px;
  position: relative;
  box-sizing: border-box;
  min-height: ${({ rowHeight }) => rowHeight}px;
  box-shadow: rgba(0, 0, 0, 0.133) 0 3.2px 7.2px 0, rgba(0, 0, 0, 0.11) 0 0.6px 1.8px 0;
`

export const StyledInput = styled.input`
  margin-left: 20px;
  padding: 9px 5px;
`
