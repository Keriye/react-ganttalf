import { create } from 'zustand'

const defaultTranslations = {
  'default.task.title': 'Untitled task',
  'add.task.label': 'Add task',
  'add.task.placeholder': 'Name',
  'menu.scroll.to.task': 'Scroll to the task',
  'menu.open.details': 'Open details',
  'menu.delete.task': 'Delete task',
  'menu.delete.link.to': 'Delete link to',
  'menu.delete.link.from': 'Delete link from',
  'menu.delete.links': 'Delete links',
  'menu.status.complete': 'Complete task',
  'menu.status.reactivate': 'Reactivate task',
  'menu.make.subtask': 'Make subtask',
  'menu.promote.subtask': 'Promote subtask',
}

export type TranslateStore = {
  translations: Partial<Record<keyof typeof defaultTranslations, string>>
  setTranslations: (translations: Partial<Record<keyof typeof defaultTranslations, string>>) => void
  t: (value: keyof typeof defaultTranslations) => string
}

const useTranslateStore = create<TranslateStore>()((set, get) => ({
  translations: {
    // 'default.task.title': 'Unbenannte Aufgabe',
    // 'add.task.label': 'Aufgabe hinzufügen',
    // 'add.task.placeholder': 'Name',
    // 'menu.scroll.to.task': 'Scrollen Sie zur Aufgabe',
    // 'menu.open.details': 'Details öffnen',
    // 'menu.delete.task': 'Aufgabe löschen',
    // 'menu.status.complete': 'Aufgabe abschließen',
    // 'menu.status.reactivate': 'Aufgabe erneut aktivieren',
    // 'menu.make.subtask': 'Teilaufgabe erstellen',
    // 'menu.promote.subtask': 'Teilaufgabe hervorheben',
  },
  setTranslations: (translations) => set({ translations }),
  t: (value) => {
    const translations = get().translations

    const translationValue = translations[value]
    if (translationValue) {
      return translationValue
    }

    const defaultTranslationValue = defaultTranslations[value]
    if (defaultTranslationValue) {
      console.warn(`Missed translation for "${value}"!!`)

      return defaultTranslationValue
    }

    return value
  },
}))

export default useTranslateStore
