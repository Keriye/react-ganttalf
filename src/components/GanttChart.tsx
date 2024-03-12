import { IConfig, ITask, ITheme } from '../types'
import { useConfigStore, useTasksStore } from '../Store'

import AddTaskButton from './Grid/AddTaskButton'
import Chart from './Chart/Chart'
import { DateTime } from 'luxon'
import { useVirtualizer, elementScroll, type VirtualizerOptions } from '@tanstack/react-virtual'
import * as SC from './GanttChart.styled'
import Grid from './Grid/Grid'
import { ThemeProvider } from 'styled-components'
import React, { JSX, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import useTranslateStore, { TranslateStore } from '../Store/TranslateStore'
import useVirtualizationStore from '../Store/VirtualizationStore'
import useDomStore from '../Store/DomStore'

interface IConfigContextProps {
  columnWidth: number
  endDate: Date | string
  rowHeight: number
  startDate: Date | string
  timeLineHeight: number
  zoom?: number
}

type ColumnRenderer = {
  renderer: (task: ITask) => JSX.Element
}

export type GanttChartProps = {
  onRenderGrid?: (
    tasks: ITask[],
    actions: {
      interaction?: Record<
        string,
        {
          expanded?: boolean
          isLoading?: boolean
          parentId?: string
          sortOrder: number
        }
      >
      scrollToTask?: () => void
      toggleCollapse?: (id: string, value?: boolean) => void
      invalidateVersion?: () => void
      getSubTasks?: (ids: string[]) => ITask[]
      addTask?: (task: Partial<ITask>, options?: { sourceId?: string; position?: 'before' | 'after' }) => void
      tasks?: ITask[]
    },
  ) => React.ReactNode
  onTaskDatesChange?: () => void
  onTaskCreate?: (task: Partial<ITask>) => Promise<boolean>
  onTaskDelete?: (task: Partial<ITask>) => void
  onSubtaskCreate?: (task: Partial<ITask>) => void
  onSubtaskPromote?: (task: ITask) => Promise<boolean>
  onSubtaskMove?: (task: ITask) => Promise<boolean>
  onTaskAppend?: (task: Partial<ITask>, options?: { replace?: boolean }) => void
  onTaskSelect?: (task: ITask) => void
  onTaskStatusChange?: (data: { value: boolean; taskId: string }) => void
  onTaskTitleChange?: (data: { value: string; taskId: string }) => Promise<boolean>
  onTaskTimeChange?: (task: ITask, options: { start?: number; end: number }) => void
  onTaskReorder?: (sourceId: string, targetId: string, mode?: 'before' | 'after' | 'child') => Promise<void>
  onLinkCreate?: (sourceId: string, targetId: string) => void
  onLinkDelete?: (sourceId: string, targetId: string) => void
  onLinksDelete?: (sourceId: string) => void
  onLoadSubTasks?: (task: ITask) => Promise<ITask[]>
  config?: IConfig
  theme?: ITheme
  tasks?: ITask[]
  translations?: TranslateStore['translations']
  columnsRenderer?: Record<string, ColumnRenderer>
  columnsOrder?: Array<keyof NonNullable<GanttChartProps['columnsRenderer']>>
  virtualization?: undefined
  inProgress?: boolean
  customGrid?: React.ReactNode
}

const startDate = DateTime.local().minus({ days: 15 }).toJSDate()
const endDate = DateTime.fromJSDate(startDate).plus({ days: 7 }).toJSDate()

const defaultConfig: IConfigContextProps = {
  startDate,
  endDate,
  rowHeight: 40,
  columnWidth: 36,
  timeLineHeight: 50,
  zoom: 1,
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
    | 'columnsOrder'
    | 'columnsRenderer'
    | 'onLoadSubTasks'
    | 'onLinkCreate'
    | 'onLinkDelete'
    | 'onLinksDelete'
    | 'onSubtaskCreate'
    | 'onSubtaskPromote'
    | 'onSubtaskMove'
    | 'onTaskAppend'
    | 'onTaskCreate'
    | 'onTaskDelete'
    | 'onTaskReorder'
    | 'onTaskSelect'
    | 'onTaskStatusChange'
    | 'onTaskTimeChange'
    | 'onTaskTitleChange'
  > & { modalRef?: React.MutableRefObject<null | HTMLDivElement> }
>({
  columnsRenderer: {},
  columnsOrder: [],
})

const easeInOutQuint = (t: number) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t)

function GanttChart({
  inProgress,
  columnsOrder,
  columnsRenderer,
  config = defaultConfig,
  onLoadSubTasks,
  onLinkCreate,
  onLinkDelete,
  onLinksDelete,
  onSubtaskCreate,
  onSubtaskMove,
  onSubtaskPromote,
  scrollContainerRef,
  onTaskAppend,
  onTaskCreate,
  onTaskDelete,
  onTaskReorder,
  onTaskSelect,
  onTaskStatusChange,
  onTaskTimeChange,
  onTaskTitleChange,
  tasks: initTasks = [],
  theme = defaultTheme,
  translations,
  virtualization,
  customGrid,
}: GanttChartProps) {
  const storeConfig = useConfigStore((state) => state.config)

  const tasks = useTasksStore((state) => state.tasks)
  const setTasks = useTasksStore((state) => state.setTasks)
  const setVisibleTasks = useTasksStore((state) => state.setVisibleTasks)
  const scrollToTask = useTasksStore((state) => state.scrollToTask)
  const setConfig = useConfigStore((state) => state.setConfig)
  const setTranslations = useTranslateStore((state) => state.setTranslations)
  const setVirtualData = useVirtualizationStore((store) => store.setVirtualData)
  const [wrapperNode, setWrapperNode] = useDomStore((state) => [state.wrapperNode, state.setWrapperNode])
  const [modalShift, setModalNode] = useDomStore((state) => [state.modalShift, state.setModalNode])

  const [isInitialized, setIsInitialized] = useState(false)
  const scrollingRef = React.useRef<number>()

  const { rowHeight } = storeConfig

  function convertTasksDates(tasks: ITask[]): ITask[] {
    return tasks.map((task) => ({
      ...task,
      startDate: new Date(task.startDate as Date),
      endDate: new Date(task.endDate as Date),
    }))
  }

  const visibleTasks = useMemo(
    // () => tasks?.filter(({ parentTaskId }) => checkParentVisibility(parentTaskId)),
    () => tasks?.filter(({ hidden }) => !hidden),
    [tasks],
  )

  useEffect(() => {
    setVisibleTasks(visibleTasks)
  }, [setVisibleTasks, visibleTasks])

  const scrollToFn: VirtualizerOptions<HTMLDivElement, Element>['scrollToFn'] = useCallback(
    (offset, canSmooth, instance) => {
      const duration = 1000
      const start = wrapperNode?.scrollTop ?? 0
      const startTime = (scrollingRef.current = Date.now())

      const run = () => {
        if (scrollingRef.current !== startTime) return
        const now = Date.now()
        const elapsed = now - startTime
        const progress = easeInOutQuint(Math.min(elapsed / duration, 1))
        const interpolated = start + (offset - start) * progress

        if (elapsed < duration) {
          elementScroll(interpolated, canSmooth, instance)
          requestAnimationFrame(run)
        } else {
          elementScroll(interpolated, canSmooth, instance)
        }
      }

      requestAnimationFrame(run)
    },
    [wrapperNode],
  )

  const virtualizer = useVirtualizer({
    count: visibleTasks?.length,
    getScrollElement: () => (virtualization ? wrapperNode : null),
    estimateSize: () => rowHeight,
    overscan: 25,
    scrollToFn,
  })

  const virtualItems = virtualizer.getVirtualItems()

  useEffect(() => {
    return () => {
      useTasksStore.setState({
        interaction: {},
        tasks: [],
        visibleTasks: [],
      })
      useVirtualizationStore.setState({
        isActive: true,
        totalHeight: 0,
        virtualItems: undefined,
      })
    }
  }, [])

  //init translations store
  useEffect(() => {
    translations && setTranslations(translations)
  }, [setTranslations, translations])

  useEffect(() => {
    if (virtualization) {
      setVirtualData({ items: virtualItems, totalHeight: virtualizer.getTotalSize() })
    }
  }, [setVirtualData, virtualization, virtualItems?.[0]?.index, virtualItems?.at(-1)?.index])

  useEffect(() => {
    const startDay = new Date(config.startDate).getDay()
    const weeks = Math.round(600 / ((config?.columnWidth ?? 10) * 7) + 0.5)
    const daysDelta = Math.floor(weeks * 7) + startDay - 1

    setConfig({
      ...defaultConfig,
      ...config,
      // startdate is config.startDate + ~10 days (first Monday)
      startDate: DateTime.fromJSDate(config.startDate as Date)
        .minus({ days: daysDelta })
        .toJSDate(),
    })

    setTasks(convertTasksDates(initTasks)?.sort((a, b) => a.sortOrder - b.sortOrder))
    initTasks?.length && setIsInitialized(true)
  }, [config, initTasks, setTasks, setConfig])

  useLayoutEffect(() => {
    if (isInitialized) {
      if (inProgress) {
        scrollToTask()
      } else if (tasks?.[0]?.startDate) {
        scrollToTask(tasks[0].startDate)
      }
    }
  }, [isInitialized, inProgress, scrollToTask])

  async function loadSubTasks(task: ITask) {
    if (onLoadSubTasks) {
      return onLoadSubTasks(task).then((subTasks) => {
        const subTasksWithDates = convertTasksDates(subTasks)

        setTasks([...tasks, ...subTasksWithDates]?.sort((a, b) => a.sortOrder - b.sortOrder))

        return subTasksWithDates
      })
    }

    return Promise.reject(new Error('onLoadSubTasks is not defined'))
  }

  return (
    <ThemeProvider theme={{ ...defaultTheme, ...theme, ...config }}>
      <ActionContext.Provider
        value={{
          columnsOrder,
          columnsRenderer,
          onLoadSubTasks: onLoadSubTasks ? (task) => loadSubTasks(task) : undefined,
          onLinkCreate,
          onLinkDelete,
          onLinksDelete,
          onSubtaskCreate,
          onSubtaskMove,
          onSubtaskPromote,
          onTaskAppend,
          onTaskCreate,
          onTaskDelete,
          onTaskReorder,
          onTaskSelect,
          onTaskStatusChange,
          onTaskTimeChange,
          onTaskTitleChange,
        }}
      >
        <SC.Wrapper>
          <SC.ScrollWrapper ref={setWrapperNode} className='ganttalf-wrapper' id='react-ganttalf'>
            <Chart />
            <Grid customGrid={customGrid} />

            <AddTaskButton />
          </SC.ScrollWrapper>
          <SC.ModalWrapper ref={setModalNode} {...modalShift} />
        </SC.Wrapper>
      </ActionContext.Provider>
    </ThemeProvider>
  )
}

export default GanttChart
