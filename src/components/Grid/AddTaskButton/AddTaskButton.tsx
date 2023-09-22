import Icon from '../SvgIcon'
import { useConfigStore } from '../../../Store'
import useTranslateStore from '../../../Store/TranslateStore'
import * as SC from './AddTaskButton.styled'
import { useCallback, useState } from 'react'
import NewTask from './NewTask/NewTask'

function AddTaskButton() {
  const t = useTranslateStore((state) => state.t)
  const config = useConfigStore((state) => state.config)

  const [isEdit, setIsEdit] = useState(false)

  const handleEditModeSwitch = useCallback(() => {
    setIsEdit((prev) => !prev)
  }, [])

  return (
    <SC.Wrapper rowHeight={config.rowHeight} className='add-task-button-wrapper'>
      {isEdit ? (
        <NewTask handleEditModeSwitch={handleEditModeSwitch} />
      ) : (
        <button className='add-task-button' onClick={handleEditModeSwitch}>
          <Icon width={16} height={16} iconName='Add' />
          <div className='add-task-button__label'>{t('add.task.label')}</div>
        </button>
      )}
    </SC.Wrapper>
  )
}

export default AddTaskButton
