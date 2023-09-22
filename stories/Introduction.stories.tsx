import { ComponentMeta, ComponentStory } from '@storybook/react'

import { DateTime } from 'luxon'
import { GanttChart } from '../src'
import React from 'react'
import tasks from './mocks/tasksData'

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
const Template: ComponentStory<typeof GanttChart> = (args) => (
  <div style={{ width: '100%' }}>
    <div style={{ padding: '10px 0 20px' }}>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry
      standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a
      type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
      remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
      Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions
      of Lorem Ipsum. It is a long established fact that a reader will be distracted by the readable content of a page
      when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of
      letters, as opposed to using Content here, content here, making it look like readable English. Many desktop
      publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem
      ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes
      by accident, sometimes on purpose (injected humour and the like).
    </div>
    <div style={{ width: '100%', height: '350px' }}>
      <GanttChart {...args} />
    </div>
    <div style={{ padding: '20px 0 10px' }}>
      Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin
      literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney
      College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and
      going through the cites of the word in classical literature, discovered the undoubtable source.
    </div>
  </div>
)

export const Default = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  config,
  tasks,
  label: 'Button',
  translations,
  onTaskSelect: (task) => console.info('💥💥💥task selected 💥💥💥 ', task),
  // onTaskCreate: (task) => console.info('💥💥💥task created 💥💥💥 ', task),
}
