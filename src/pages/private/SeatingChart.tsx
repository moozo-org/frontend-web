import { useTranslation } from 'react-i18next'

const SeatingChart = () => {
  const { t } = useTranslation()

  return <div>{t('pages.seating')}</div>
}

export default SeatingChart
