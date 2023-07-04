import { ComponentMeta, ComponentStory } from '@storybook/react'

import { DateTime } from 'luxon'
import { GanttChart } from '../src'
import React from 'react'
import tasks from './mocks/tasksData'

// startdate is 10.11.2022
const startDate = new Date('2022-11-10')

// endDate is startDate + 7 days
const endDate = DateTime.fromJSDate(startDate).plus({ days: 70 }).toJSDate()

const config = {
  endDate,
  timeLineHeight: 50,
  startDate,
  rowHeight: 40,
  columnWidth: 36,
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
const Template: ComponentStory<typeof GanttChart> = (args) => <GanttChart {...args} />

export const Default = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  config,
  tasks,
  label: 'Button',
}
