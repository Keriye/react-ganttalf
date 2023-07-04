import { IConfig, ITask, ITheme } from '../types'
import { useConfigStore, useTasksStore } from '../Store'

import AddTaskButton from './Grid/AddTaskButton'
import Chart from './Chart/Chart'
import { DateTime } from 'luxon'
import GanttChartStyled from './GanttChart.styled'
import Grid from './Grid/Grid'
import { ThemeProvider } from 'styled-components'
import TimeLineHeader from './TimeLineHeader/TimeLineHeader'
import { useEffect } from 'react'

interface IConfigContextProps {
  columnWidth: number
  endDate: Date | string
  rowHeight: number
  startDate: Date | string
  timeLineHeight: number
}

export interface IGanttChartProps {
  onTaskDatesChange?: () => void
  config?: IConfig
  theme?: ITheme
  tasks?: ITask[]
}

const startDate = DateTime.local().minus({ days: 15 }).toJSDate()
const endDate = DateTime.fromJSDate(startDate).plus({ days: 7 }).toJSDate()

const defaultConfig: IConfigContextProps = {
  columnWidth: 36,
  endDate,
  rowHeight: 40,
  startDate,
  timeLineHeight: 50,
}

const defaultTheme = {
  themePrimary: '#0078d4',
  themeLighterAlt: '#eff6fc',
  themeLighter: '#deecf9',
  themeLight: '#c7e0f4',
  themeTertiary: '#71afe5',
  themeSecondary: '#2b88d8',
  themeDarkAlt: '#106ebe',
  themeDark: '#005a9e',
  themeDarker: '#004578',
  neutralLighterAlt: '#faf9f8',
  neutralLighter: '#f3f2f1',
  neutralLight: '#edebe9',
  neutralQuaternaryAlt: '#e1dfdd',
  neutralQuaternary: '#d0d0d0',
  neutralTertiaryAlt: '#c8c6c4',
  neutralTertiary: '#a19f9d',
  neutralSecondary: '#605e5c',
  neutralSecondaryAlt: '#8a8886',
  neutralPrimaryAlt: '#3b3a39',
  neutralPrimary: '#323130',
  neutralDark: '#201f1e',
  black: '#000000',
  white: '#ffffff',
}

function GanttChart({ config = defaultConfig, theme = defaultTheme, tasks = [] }: IGanttChartProps) {
  const storeConfig = useConfigStore((state) => state.config)

  const setTasks = useTasksStore((state) => state.setTasks)
  const setConfig = useConfigStore((state) => state.setConfig)

  const { startDate, endDate } = storeConfig

  useEffect(() => {
    setConfig({
      ...defaultConfig,
      ...config,
      // startdate is config.startDate +10 days
      startDate: DateTime.fromJSDate(config.startDate as Date)
        .minus({ days: 10 })
        .toJSDate(),
    })

    setTasks(
      tasks.map((task) => ({
        ...task,
        startDate: new Date(task.startDate as Date),
        endDate: new Date(task.endDate as Date),
      })),
    )
  }, [config, tasks, setTasks, setConfig])

  function onChartScroll(event: React.UIEvent<HTMLDivElement, UIEvent>) {
    const { scrollLeft } = event.target as HTMLDivElement

    const timeLineHeader = document.getElementById('time-line-header-container')

    if (timeLineHeader) timeLineHeader.scrollLeft = scrollLeft
  }

  return (
    <ThemeProvider theme={{ ...defaultTheme, ...theme, ...config }}>
      <GanttChartStyled className='ganttalf-wrapper' id='react-ganttalf'>
        <TimeLineHeader endDate={endDate as Date} startDate={startDate as Date} />
        <div className='ganttalf__body-wrapper'>
          <div className='ganttalf__body' onScroll={onChartScroll}>
            <Chart />
            <Grid />
            <AddTaskButton />
          </div>
        </div>
      </GanttChartStyled>
    </ThemeProvider>
  )
}

export default GanttChart
