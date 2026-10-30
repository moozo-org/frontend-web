import { useTranslation } from 'react-i18next'

const Home = () => {
  const { t } = useTranslation()

  return <div>{t('pages.home')}</div>
}

export default Home
