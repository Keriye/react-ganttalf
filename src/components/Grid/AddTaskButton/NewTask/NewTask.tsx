import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'

import Icon from '../../SvgIcon'
import * as SC from '../AddTaskButton.styled'
import useTranslateStore from '../../../../Store/TranslateStore'
import { useConfigStore } from '../../../../Store'
// import { StyledInput } from '../AddTaskButton.styled'
import { ActionContext } from '../../../GanttChart'
import useDomStore from '../../../../Store/DomStore'

type NewTaskProps = {
  handleEditModeSwitch: () => void
}

const NewTask: FC<NewTaskProps> = ({ handleEditModeSwitch }) => {
  const { onTaskCreate } = useContext(ActionContext)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const config = useConfigStore((state) => state.config)
  const t = useTranslateStore((state) => state.t)
  // const addTask = useTasksStore((state) => state.addTask)
  const wrapperNode = useDomStore((state) => state.wrapperNode)

  const [title, setTitle] = useState('')

  useEffect(() => {
    inputRef?.current?.focus()
  }, [])

  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((ev) => {
    if (ev.target.value) setTitle(ev.target.value)
  }, [])

  const handleTaskCreate = useCallback(() => {
    if (title) {
      // addTask({ title })
      onTaskCreate?.({ title })
    }
    setTitle('')
    setTimeout(() => {
      wrapperNode && (wrapperNode.scrollTop = wrapperNode.scrollHeight)
    }, 50)
  }, [onTaskCreate, title, wrapperNode])

  const handleEnterUp: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        event.stopPropagation()
        handleTaskCreate()
      }
    },
    [handleTaskCreate],
  )

  return (
    <SC.EditWrapper rowHeight={config.rowHeight}>
      <SC.EditLink
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleTaskCreate()
        }}
      >
        <Icon width={16} height={16} iconName='Add' />
      </SC.EditLink>

      <SC.StyledInput
        ref={inputRef}
        type='text'
        placeholder={t('add.task.placeholder')}
        value={title}
        onChange={handleTitleChange}
        onBlur={handleEditModeSwitch}
        onKeyUp={handleEnterUp}
      />
    </SC.EditWrapper>
  )
}

export default NewTask
