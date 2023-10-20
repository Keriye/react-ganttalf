import { ITask, TaskStatus } from '../../types'
import Icon from './SvgIcon'
import IconButton from './IconButton'
import { TitleCellStyled } from './Grid.styled'
import React, { useCallback, useContext, useState } from 'react'
import { useConfigStore, useTasksStore } from '../../Store'
import { ActionContext } from '../GanttChart'
import useTranslateStore from '../../Store/TranslateStore'
import { getDatesBetween } from '../../utils/helpers'
import useDomStore from '../../Store/DomStore'
// import useDomStore from '../../Store/DomStore'

interface ITitleCellProps {
  task: ITask
  taskLevel: number
}

export default function TitleCell({ taskLevel, task }: ITitleCellProps) {
  const [title, setTitle] = useState(task.title)
  const t = useTranslateStore((store) => store.t)
  const wrapperNode = useDomStore((store) => store.wrapperNode)

  const { onTaskSelect, onTaskTitleChange, onTaskStatusChange } = useContext(ActionContext)

  const toggleCollapse = useTasksStore((state) => state.toggleCollapse)
  const deleteTask = useTasksStore((state) => state.deleteTask)
  const onStatusChange = useTasksStore((state) => state.onStatusChange)
  // const onSubtaskCreate = useTasksStore((state) => state.onSubtaskCreate)
  const config = useConfigStore((state) => state.config)

  const { startDate, columnWidth } = config

  // const wrapperNode = useDomStore((store) => store.wrapperNode)
  // const gridNode = useDomStore((store) => store.gridNode)

  // const hasParent = !!task.predecessors?.length
  const hasSubTasks = task.subTaskIds?.length ? task.subTaskIds.length > 0 : false

  const renderCollapseButton = () => {
    if (!hasSubTasks) return null

    return (
      <button
        className='c-grid-title-collapse-button'
        onClick={() => {
          toggleCollapse(task.id)
        }}
      >
        <Icon width={10} height={10} className='c-grid-title-collapse-icon' iconName='ChevronRightMed' />
      </button>
    )
  }

  const handleTaskSelect = useCallback(() => {
    onTaskSelect?.(task)
  }, [onTaskSelect, task])

  const handleTaskDelete = useCallback(() => {
    deleteTask(task.id)
  }, [deleteTask, task.id])

  const handleStatusChange = useCallback(() => {
    onStatusChange(!task.status, task.id)
    onTaskStatusChange?.({ taskId: task.id, value: !task.status })
  }, [onStatusChange, onTaskStatusChange, task.id, task.status])

  // const handleSubtaskCreate = useCallback(() => {
  //   onSubtaskCreate(task.id)
  // }, [onSubtaskCreate, task.id])

  const handleScrollToTask = useCallback(() => {
    if (!task.startDate) return

    const diff = getDatesBetween({ startDate, endDate: task.startDate }).length
    // const ganttChart = document.querySelector(`div[class^=Chart-module_chart]`);
    const gridNode = document.querySelector('#react-ganttalf-grid')
    const scrollLeft = diff * columnWidth - (gridNode?.clientWidth ?? 350) - 80

    wrapperNode?.scrollTo(scrollLeft, wrapperNode.scrollTop)
  }, [columnWidth, startDate, task.startDate, wrapperNode])

  const handleEnterPress: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.key === 'Enter' && event.currentTarget?.value) {
        onTaskTitleChange?.({ value: event.currentTarget.value, taskId: task.id })
      }
    },
    [onTaskTitleChange, task.id],
  )

  return (
    <TitleCellStyled
      taskLevel={taskLevel}
      completed={task.status === 1}
      collapsed={task.collapsed}
      isParentTask={hasSubTasks}
    >
      {renderCollapseButton()}
      <input
        className='c-grid-title-input'
        onChange={(event) => {
          setTitle(event.target.value)
        }}
        onKeyUp={handleEnterPress}
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
            // {
            //   iconName: 'PaddingRight',
            //   key: 'Subtusk',
            //   text: t('menu.make.subtask'),
            //   onClick: handleSubtaskCreate,
            // },
            // {
            //   iconName: 'PaddingLeft',
            //   key: 'Promote',
            //   text: t('menu.promote.subtask'),
            //   onClick: handleSubtaskCreate,
            // },
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
            // {
            //   iconName: 'DependencyRemove',
            //   key: 'DependencyRemove',
            //   text: 'Abhängigkeit entfernen',
            //   disabled: true,
            //   onClick: () => {
            //     console.log('Add to favorites')
            //   },
            // },
            {
              iconName: task.status === TaskStatus.Completed ? 'RevToggleKey' : 'Completed',
              key: 'Status',
              text: task.status === TaskStatus.Completed ? t('menu.status.complete') : t('menu.status.reactivate'),
              onClick: handleStatusChange,
            },
          ]}
          iconName='MoreVertical'
          className='c-grid-title-icon-button-moreVertical'
        />
      </div>
    </TitleCellStyled>
  )
}
