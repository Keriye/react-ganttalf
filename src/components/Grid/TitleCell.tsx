import { ITask, TaskStatus } from '../../types'
import React, { useCallback, useContext, useEffect, useState } from 'react'

import { ActionContext } from '../GanttChart'
import Icon from './SvgIcon'
import IconButton from './IconButton'
import { TitleCellStyled } from './Grid.styled'
import { useTasksStore } from '../../Store'
import useTranslateStore from '../../Store/TranslateStore'

// import useDomStore from '../../Store/DomStore'

interface ITitleCellProps {
  task: ITask
  taskLevel: number
}

export default function TitleCell({ taskLevel, task }: ITitleCellProps) {
  const [title, setTitle] = useState(task.title)
  const t = useTranslateStore((store) => store.t)

  const {
    onTaskSelect,
    onTaskDelete,
    onTaskTitleChange,
    onTaskStatusChange,
    onSubtaskCreate,
    // onSubtaskMove,
    // onSubtaskPromote,
    onLinkDelete,
    onLoadSubTasks,
    onLinksDelete,
  } = useContext(ActionContext)

  const interaction = useTasksStore((state) => state.interaction)
  const getSubTasks = useTasksStore((state) => state.getSubTasks)
  const scrollToTask = useTasksStore((state) => state.scrollToTask)
  const toggleCollapse = useTasksStore((state) => state.toggleCollapse)
  const toggleLoading = useTasksStore((state) => state.toggleLoading)
  const onStatusChange = useTasksStore((state) => state.onStatusChange)
  // const invalidateVersion = useTasksStore((state) => state.invalidateVersion)

  const isLoading = interaction[task.id]?.isLoading

  useEffect(() => {
    setTitle(task.title)
  }, [task.title])

  // const wrapperNode = useDomStore((store) => store.wrapperNode)
  // const gridNode = useDomStore((store) => store.gridNode)

  // const hasParent = !!task.predecessors?.length
  const hasSubTasks = task.subTaskIds?.length ? task.subTaskIds.length > 0 : false

  function onCollapseButtonClick() {
    if (isLoading) return

    toggleCollapse(task.id)

    if (onLoadSubTasks) {
      // if onLoadSubTasks is defined, we check if all subtasks are in state
      // if not, we load them
      const subTasks = getSubTasks(task.subTaskIds ?? [])

      if (subTasks.length !== task.subTaskIds?.length) {
        // only load subtasks if not all subtasks are in state
        toggleLoading(task.id, true)
        onLoadSubTasks(task).finally(() => toggleLoading(task.id, false))
      }
    }
  }

  const renderCollapseButton = () => {
    if (!hasSubTasks) return null

    return (
      <button className='c-grid-title-collapse-button' onClick={onCollapseButtonClick}>
        <Icon width={10} height={10} className='c-grid-title-collapse-icon' iconName='ChevronRightMed' />
      </button>
    )
  }

  const handleTaskSelect = useCallback(() => {
    if (!isLoading && onTaskSelect) {
      onTaskSelect(task)
    }
  }, [isLoading, onTaskSelect, task])

  const handleTaskDelete = useCallback(() => {
    onTaskDelete?.(task)
  }, [onTaskDelete, task])

  const handleStatusChange = useCallback(() => {
    onStatusChange(!task.status, task.id)
    onTaskStatusChange?.({ taskId: task.id, value: !task.status })
  }, [onStatusChange, onTaskStatusChange, task.id, task.status])

  const handleSubtaskCreate = useCallback(() => {
    toggleCollapse(task.id, true)
    onSubtaskCreate?.(task)
  }, [onSubtaskCreate, task, toggleCollapse])

  // const handleSubtaskMove = useCallback(async () => {
  //   if (onSubtaskMove) {
  //     await onSubtaskMove(task)
  //     toggleCollapse(task.id, true)
  //     invalidateVersion()
  //   }
  // }, [invalidateVersion, onSubtaskMove, task, toggleCollapse])

  // const handleSubtaskPromote = useCallback(async () => {
  //   if (onSubtaskPromote) {
  //     await onSubtaskPromote(task)
  //     toggleCollapse(task.id, true)
  //     invalidateVersion()
  //   }
  // }, [invalidateVersion, onSubtaskPromote, task, toggleCollapse])

  const handleScrollToTask = useCallback(() => {
    if (!task.startDate) return

    scrollToTask(task.startDate)
  }, [scrollToTask, task?.startDate])

  const handleTaskTitleChange = useCallback(
    async (value: string) => {
      if (onTaskTitleChange) {
        toggleLoading(task.id, true)
        await onTaskTitleChange({ value, taskId: task.id })
        toggleLoading(task.id, false)
      }
    },
    [onTaskTitleChange, task.id, toggleLoading],
  )

  const handleEnterPress: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
    async (event) => {
      if (event.key === 'Enter' && event.currentTarget?.value) {
        void handleTaskTitleChange(event.currentTarget?.value)
      }
    },
    [handleTaskTitleChange],
  )

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = useCallback(
    async (event) => {
      if (event.currentTarget?.value) {
        void handleTaskTitleChange(event.currentTarget?.value)
      }
    },
    [handleTaskTitleChange],
  )

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = useCallback(() => {
    handleScrollToTask()
  }, [handleScrollToTask])

  // TODO: should be common value instead of function
  function shouldDisplayStatusItem() {
    if (typeof task.permissions?.updateStatus === 'boolean') {
      return task.permissions.updateStatus
    }

    return true
  }

  useEffect(() => {
    return () => {
      toggleLoading(task.id, false)
    }
  }, [task.id, toggleLoading])

  return (
    <TitleCellStyled
      taskLevel={taskLevel}
      completed={task.status === 1}
      collapsed={!interaction[task.id]?.expanded}
      isParentTask={hasSubTasks}
    >
      {renderCollapseButton()}
      <input
        className='c-grid-title-input'
        onChange={(event) => {
          setTitle(event.target.value)
        }}
        onKeyUp={handleEnterPress}
        onBlur={handleBlur}
        onFocus={handleFocus}
        value={title}
        type='text'
      />
      <div className='c-grid-title-icons-wrapper'>
        <IconButton onClick={handleTaskSelect} iconName='Info' className='c-grid-title-icon-button-info' />
        <IconButton
          overflowItems={[
            {
              iconName: 'HorizontalTabKey',
              key: 'HorizontalTabKey',
              disabled: !task.startDate,
              text: t('menu.scroll.to.task'),
              onClick: handleScrollToTask,
            },
            {
              iconName: 'Info',
              key: 'Info',
              text: t('menu.open.details'),
              onClick: handleTaskSelect,
            },
            {
              iconName: 'Insert',
              key: 'Subtusk',
              text: t('menu.make.subtask'),
              onClick: handleSubtaskCreate,
            },
            // {
            //   iconName: 'PaddingRight',
            //   key: 'SubtuskMove',
            //   text: t('menu.make.subtask'),
            //   onClick: handleSubtaskMove,
            // },
            // ...(task.parentTaskId && interaction[task.parentTaskId]
            //   ? [
            //       {
            //         iconName: 'PaddingLeft',
            //         key: 'Promote',
            //         text: t('menu.promote.subtask'),
            //         onClick: handleSubtaskPromote,
            //       },
            //     ]
            //   : []),
            { key: 'devider-1', type: 'divider' },
            // {
            //   iconName: 'Cut',
            //   key: 'Cut',
            //   text: 'Aufgabe ausschneiden',
            //   disabled: true,
            //   onClick: () => {
            //     console.log('Add to favorites')
            //   },
            // },
            // {
            //   iconName: 'Copy',
            //   key: 'Copy',
            //   text: 'Aufgabe kopieren',
            //   disabled: true,
            //   onClick: () => {
            //     console.log('Add to favorites')
            //   },
            // },
            // {
            //   iconName: 'Paste',
            //   key: 'Paste',
            //   text: 'Aufgabe einfügen',
            //   disabled: true,
            //   onClick: () => {
            //     console.log('Add to favorites')
            //   },
            // },
            // {
            //   iconName: 'Insert',
            //   key: 'Insert',
            //   text: 'Vorgang oben einfügen',
            //   disabled: true,
            //   onClick: () => {
            //     console.log('Add to favorites')
            //   },
            // },
            {
              iconName: 'Delete',
              key: 'Delete',
              text: t('menu.delete.task'),
              onClick: handleTaskDelete,
            },
            // {
            //   iconName: 'Link',
            //   key: 'Link',
            //   text: 'Link zu Vorgang kopieren',
            //   disabled: true,
            //   onClick: () => {
            //     console.log('Add to favorites')
            //   },
            // },
            { key: 'devider-2', type: 'divider' },
            // {
            //   iconName: 'DependencyAdd',
            //   key: 'DependencyAdd',
            //   text: 'Abhängigkeit hinzufügen',
            //   disabled: true,
            //   onClick: () => {
            //     console.log('Add to favorites')
            //   },
            // },
            ...(task.predecessors?.map((predecessor) => ({
              iconName: 'DependencyRemove',
              key: `DependencyRemove-from-${predecessor}`,
              text: `${t('menu.delete.link.from')} ${interaction[predecessor]?.sortOrder}`,
              onClick: () => onLinkDelete?.(predecessor, task.id),
            })) ?? []),
            ...(task.successors?.map((successor) => ({
              iconName: `DependencyRemove`,
              key: `DependencyRemove-to-${successor}`,
              text: `${t('menu.delete.link.to')} ${interaction[successor]?.sortOrder}`,
              onClick: () => onLinkDelete?.(task.id, successor),
            })) ?? []),
            ...(task.successors?.length || task.predecessors?.length
              ? [
                  {
                    iconName: 'DependencyRemove',
                    key: 'DependencyRemove',
                    text: `Delete all links`,
                    onClick: () => onLinksDelete?.(task.id),
                  },
                ]
              : []),
            ...(shouldDisplayStatusItem()
              ? [
                  { key: 'devider-3', type: 'divider' },
                  {
                    iconName: task.status === TaskStatus.Completed ? 'RevToggleKey' : 'Completed',
                    key: 'Status',
                    text:
                      task.status === TaskStatus.Completed ? t('menu.status.reactivate') : t('menu.status.complete'),
                    onClick: handleStatusChange,
                  },
                ]
              : []),
          ]}
          iconName='MoreVertical'
          className='c-grid-title-icon-button-moreVertical'
        />
      </div>
    </TitleCellStyled>
  )
}
