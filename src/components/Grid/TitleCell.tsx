import { ITask } from '../../types'
import Icon from './SvgIcon'
import IconButton from './IconButton'
import { TitleCellStyled } from './Grid.styled'
import { useState } from 'react'
import { useTasksStore } from '../../Store'

interface ITitleCellProps {
  task: ITask
  taskLevel: number
}

export default function TitleCell({ taskLevel, task }: ITitleCellProps) {
  const [title, setTitle] = useState(task.title)

  const toggleCollapse = useTasksStore((state) => state.toggleCollapse)

  const hasSubTasks = task.subTaskIds?.length ? task.subTaskIds.length > 0 : false

  function renderCollapseButton() {
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
        value={title}
        type='text'
      />
      <div className='c-grid-title-icons-wrapper'>
        <IconButton
          onClick={() => {
            console.log(123)
          }}
          iconName='Info'
          className='c-grid-title-icon-button-info'
        />
        <IconButton
          overflowItems={[
            {
              iconName: 'HorizontalTabKey',
              key: 'HorizontalTabKey',
              text: 'Scrollen Sie zur Aufgabe',
              onClick: () => {
                console.log('Add to favorites')
              },
            },
            {
              iconName: 'Info',
              key: 'Info',
              text: 'Details öffnen',
              onClick: () => {
                console.log('Add to favorites')
              },
            },
            { key: 'devider-1', type: 'divider' },
            {
              iconName: 'Cut',
              key: 'Cut',
              text: 'Aufgabe ausschneiden',
              onClick: () => {
                console.log('Add to favorites')
              },
            },
            {
              iconName: 'Copy',
              key: 'Copy',
              text: 'Aufgabe kopieren',
              onClick: () => {
                console.log('Add to favorites')
              },
            },
            {
              iconName: 'Paste',
              key: 'Paste',
              text: 'Aufgabe einfügen',
              onClick: () => {
                console.log('Add to favorites')
              },
            },
            {
              iconName: 'Insert',
              key: 'Insert',
              text: 'Vorgang oben einfügen',
              onClick: () => {
                console.log('Add to favorites')
              },
            },
            {
              iconName: 'Delete',
              key: 'Delete',
              text: 'Aufgabe löschen',
              onClick: () => {
                console.log('Add to favorites')
              },
            },
            {
              iconName: 'Link',
              key: 'Link',
              text: 'Link zu Vorgang kopieren',
              onClick: () => {
                console.log('Add to favorites')
              },
            },
            { key: 'devider-2', type: 'divider' },
            {
              iconName: 'DependencyAdd',
              key: 'DependencyAdd',
              text: 'Abhängigkeit hinzufügen',
              onClick: () => {
                console.log('Add to favorites')
              },
            },
            {
              iconName: 'DependencyRemove',
              key: 'DependencyRemove',
              text: 'Abhängigkeit entfernen',
              onClick: () => {
                console.log('Add to favorites')
              },
            },
            {
              iconName: 'Completed',
              key: 'Completed',
              text: 'Vorgang erledigen',
              onClick: () => {
                console.log('Add to favorites')
              },
            },
          ]}
          iconName='MoreVertical'
          className='c-grid-title-icon-button-moreVertical'
        />
      </div>
    </TitleCellStyled>
  )
}
