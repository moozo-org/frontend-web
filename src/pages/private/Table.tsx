import { useTranslation } from 'react-i18next'

const Table = () => {
  const { t } = useTranslation()

  return <div>{t('pages.table')}</div>
}

export default Table
