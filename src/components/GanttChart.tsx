import { IConfig, ITask, ITheme } from '../types'
import { useConfigStore, useTasksStore } from '../Store'

import AddTaskButton from './Grid/AddTaskButton'
import Chart from './Chart/Chart'
import { DateTime } from 'luxon'
import { useVirtualizer } from '@tanstack/react-virtual'
import * as SC from './GanttChart.styled'
import Grid from './Grid/Grid'
import { ThemeProvider } from 'styled-components'
import React, { JSX, useEffect } from 'react'
import useTranslateStore, { TranslateStore } from '../Store/TranslateStore'
import useVirtualizationStore from '../Store/VirtualizationStore'
import useDomStore from '../Store/DomStore'

interface IConfigContextProps {
  columnWidth: number
  endDate: Date | string
  rowHeight: number
  startDate: Date | string
  timeLineHeight: number
}

type ColumnRenderer = {
  renderer: (task: ITask) => JSX.Element
}

export type GanttChartProps = {
  onTaskDatesChange?: () => void
  onTaskCreate?: (task: Partial<ITask>) => void
  onTaskAppend?: (task: Partial<ITask>, options?: { replace?: boolean }) => void
  onTaskSelect?: (task: ITask) => void
  onTaskTitleChange?: (data: { value: string; taskId: string }) => void
  onTaskTimeChange?: (task: ITask, options: { start?: number; end: number }) => void
  onTaskReorder?: (sourceId: string, targetId: string) => void
  config?: IConfig
  theme?: ITheme
  tasks?: ITask[]
  translations?: TranslateStore['translations']
  columnsRenderer?: Record<string, ColumnRenderer>
  columnsOrder?: Array<keyof NonNullable<GanttChartProps['columnsRenderer']>>
  virtualization?: undefined
}

const startDate = DateTime.local().minus({ days: 15 }).toJSDate()
const endDate = DateTime.fromJSDate(startDate).plus({ days: 7 }).toJSDate()

const defaultConfig: IConfigContextProps = {
  startDate,
  endDate,
  rowHeight: 40,
  columnWidth: 36,
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

export const ActionContext = React.createContext<
  Pick<
    GanttChartProps,
    | 'onTaskCreate'
    | 'onTaskAppend'
    | 'onTaskSelect'
    | 'onTaskTitleChange'
    | 'onTaskTimeChange'
    | 'onTaskReorder'
    | 'columnsRenderer'
    | 'columnsOrder'
  > & { modalRef?: React.MutableRefObject<null | HTMLDivElement> }
>({
  columnsRenderer: {},
  columnsOrder: [],
})

function GanttChart({
  config = defaultConfig,
  theme = defaultTheme,
  tasks: initTasks = [],
  translations,
  onTaskCreate,
  onTaskAppend,
  onTaskSelect,
  onTaskTitleChange,
  onTaskTimeChange,
  onTaskReorder,
  columnsRenderer,
  columnsOrder,
  virtualization,
}: GanttChartProps) {
  const storeConfig = useConfigStore((state) => state.config)

  const tasks = useTasksStore((state) => state.tasks)
  const setTasks = useTasksStore((state) => state.setTasks)
  const setConfig = useConfigStore((state) => state.setConfig)
  const setTranslations = useTranslateStore((state) => state.setTranslations)
  const setVirtualData = useVirtualizationStore((store) => store.setVirtualData)
  const [wrapperNode, setWrapperNode] = useDomStore((state) => [state.wrapperNode, state.setWrapperNode])
  const [[modalX, modalY], setModalNode] = useDomStore((state) => [state.modalShift, state.setModalNode])

  const { rowHeight } = storeConfig

  const virtualizer = useVirtualizer({
    count: tasks?.filter((t) => !t.collapsed)?.length,
    getScrollElement: () => wrapperNode,
    estimateSize: () => rowHeight,
    overscan: 15,
  })

  const virtualItems = virtualizer.getVirtualItems()

  //init translations store
  useEffect(() => {
    translations && setTranslations(translations)
  }, [setTranslations, translations])

  useEffect(() => {
    if (virtualization) {
      setVirtualData({ items: virtualItems, totalHeight: virtualizer.getTotalSize() })
    }
  }, [setVirtualData, virtualization, virtualItems?.[0]?.index, virtualItems?.[virtualItems.length - 1]?.index])

  useEffect(() => {
    const startDay = new Date(config.startDate).getDay()
    const daysDelta = 14 + startDay - 1

    setConfig({
      ...defaultConfig,
      ...config,
      // startdate is config.startDate + ~10 days (first Monday)
      startDate: DateTime.fromJSDate(config.startDate as Date)
        .minus({ days: daysDelta })
        .toJSDate(),
    })

    setTasks(
      initTasks.map((task) => ({
        ...task,
        startDate: new Date(task.startDate as Date),
        endDate: new Date(task.endDate as Date),
      })),
    )
  }, [config, initTasks, setTasks, setConfig])

  return (
    <ThemeProvider theme={{ ...defaultTheme, ...theme, ...config }}>
      <ActionContext.Provider
        value={{
          onTaskCreate,
          onTaskAppend,
          onTaskSelect,
          onTaskTitleChange,
          onTaskTimeChange,
          onTaskReorder,
          columnsRenderer,
          columnsOrder,
        }}
      >
        <SC.Wrapper>
          <SC.ScrollWrapper ref={setWrapperNode} className='ganttalf-wrapper' id='react-ganttalf'>
            <Chart />
            <Grid />
            <AddTaskButton />
          </SC.ScrollWrapper>
          <SC.ModalWrapper ref={setModalNode} x={modalX} y={modalY} />
        </SC.Wrapper>
      </ActionContext.Provider>
    </ThemeProvider>
  )
}

export default GanttChart
