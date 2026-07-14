export interface ChangelogItem {
  title: string
  desc: string
}

export const CHANGELOG: Record<string, ChangelogItem[]> = {
  '0.5': [
    {
      title: 'Описание появится скоро',
      desc: 'Здесь будут собраны изменения и улучшения будущих обновлений ProjectCR.',
    },
  ],
}
