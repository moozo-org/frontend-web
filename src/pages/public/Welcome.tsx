import { useTranslation } from 'react-i18next'

const Welcome = () => {
  const { t } = useTranslation()

  return <div>{t('pages.welcome')}</div>
}

export default Welcome
