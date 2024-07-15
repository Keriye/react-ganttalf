import * as SC from './AddTaskButton.styled'

import { useCallback, useState } from 'react'
import { useConfigStore, usePermissionsStore } from '../../../Store'

import Icon from '../SvgIcon'
import NewTask from './NewTask/NewTask'
import useTranslateStore from '../../../Store/TranslateStore'

function AddTaskButton() {
  const t = useTranslateStore((state) => state.t)
  const config = useConfigStore((state) => state.config)
  const canCreateTask = usePermissionsStore((state) => state.permissions.canCreateTask)

  const [isEdit, setIsEdit] = useState(false)

  const handleEditModeSwitch = useCallback(() => {
    setIsEdit((prev) => !prev)
  }, [])

  if (!canCreateTask) return null

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
