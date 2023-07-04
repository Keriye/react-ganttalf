import Icon from './SvgIcon'
import styled from 'styled-components'
import { useConfigStore } from '../../Store'

export const AddTaskButtonContainer = styled.div<{ rowHeight: number }>`
  background: ${({ theme }) => theme.white};
  border-bottom: 1px solid ${({ theme }) => theme.neutralLight};
  border-top: 1px solid ${({ theme }) => theme.neutralLight};
  bottom: 0;
  left: 0;
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
    padding-left: 60px;
    width: 360px;

    &:hover {
      box-shadow: rgb(0 0 0 / 13%) 0px 1.6px 3.6px 0px, rgb(0 0 0 / 11%) 0px 0.3px 0.9px 0px;
    }
  }

  .add-task-button__label {
    padding-left: 20px;
  }
`

function AddTaskButton() {
  const config = useConfigStore((state) => state.config)
  return (
    <AddTaskButtonContainer rowHeight={config.rowHeight} className='add-task-button-wrapper'>
      <button className='add-task-button'>
        <Icon width={16} height={16} iconName='Add' />
        <div className='add-task-button__label'>Aufgabe hinzufügen</div>
      </button>
    </AddTaskButtonContainer>
  )
}

export default AddTaskButton
