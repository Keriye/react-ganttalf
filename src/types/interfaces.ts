import { TaskStatus, TaskType } from './enums'

export interface IUser {
  email?: string
  id?: string
  login?: string
  name?: string
  pictureUrl?: string
  rolename?: string
  tenantId?: string
  userId?: string
}

export interface ITask {
  assignedTo?: IUser
  id: string
  sortOrder: number
  startDate?: Date | string
  endDate?: Date | string
  status: TaskStatus
  subTaskIds?: string[]
  predecessors?: string[]
  successors?: string[]
  title?: string
  type?: TaskType
  collapsed?: boolean
  parentTaskId?: string
}

export interface IConfig {
  columnWidth: number
  endDate: Date | string
  rowHeight: number
  startDate: Date | string
  timeLineHeight: number
  zoom?: number
}

export interface ITheme {
  themePrimary?: string
  themeLighterAlt?: string
  themeLighter?: string
  themeLight?: string
  themeTertiary?: string
  themeSecondary?: string
  themeDarkAlt?: string
  themeDark?: string
  themeDarker?: string
  neutralLighterAlt?: string
  neutralLighter?: string
  neutralLight?: string
  neutralQuaternaryAlt?: string
  neutralQuaternary?: string
  neutralTertiaryAlt?: string
  neutralTertiary?: string
  neutralSecondary?: string
  neutralSecondaryAlt?: string
  neutralPrimaryAlt?: string
  neutralPrimary?: string
  neutralDark?: string
  black?: string
  white?: string
}

export interface ISvgIcon {
  className?: string
  iconName?: string
  width: number
  height: number
}
