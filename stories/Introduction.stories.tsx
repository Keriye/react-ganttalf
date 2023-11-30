import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useEffect, useState } from 'react'
import tasks, { subTasks } from './mocks/tasksData'

import { DateTime } from 'luxon'
import { GanttChart } from '../src'

// startdate is 10.11.2022
const startDate = new Date('2023-07-30')

// endDate is startDate + 7 days
const endDate = DateTime.fromJSDate(startDate).plus({ days: 70 }).toJSDate()

const config = {
  endDate,
  timeLineHeight: 50,
  startDate,
  rowHeight: 40,
  columnWidth: 36,
}

const translations = {
  'default.task.title': 'Невідоме завдання',
  'add.task.label': 'Додати завдання',
  'add.task.placeholder': 'Name',
  'menu.scroll.to.task': 'Перейдіть до завдання',
  'menu.open.details': 'Bідкрити деталі',
  'menu.delete.task': 'Aufgabe löschen',
  'menu.status.complete': 'Aufgabe abschließen',
  'menu.status.reactivate': 'Aufgabe erneut aktivieren',
  'menu.make.subtask': 'Teilaufgabe erstellen',
  'menu.promote.subtask': 'Teilaufgabe hervorheben',
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Main/Gantt',
  component: GanttChart,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof GanttChart>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GanttChart> = (args) => {
  const [tasks, setTasks] = useState(args.tasks)

  // useEffect(() => {
  //   setTimeout(() => {
  //     setTasks((prev) => {
  //       return prev.map((task) => {
  //         return {
  //           ...task,
  //           startDate: new Date('2023-07-31T23:00:00.000Z'),
  //         }
  //       })
  //     })
  //   }, 1000)
  // }, [])

  return (
    <div style={{ width: '100%' }}>
      <div style={{ padding: '10px 0 20px' }}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry
      </div>
      <div style={{ width: '100%', height: '350px' }}>
        <GanttChart {...args} tasks={tasks} />
      </div>
      <div style={{ padding: '20px 0 10px' }}>
        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin
      </div>
    </div>
  )
}

export const Default = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  config,
  tasks,
  label: 'Button',
  translations,
  onTaskSelect: (task) => console.info('💥💥💥task selected 💥💥💥 ', task),
  onLoadSubTasks: (task) => {
    console.info('onLoadSubTasks 💥💥💥 ', task)
    return new Promise((resolve) => setTimeout(() => resolve(subTasks), 4000))
  },
  // onTaskCreate: (task) => console.info('💥💥💥task created 💥💥💥 ', task),
}
