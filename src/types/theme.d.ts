import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
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
}
