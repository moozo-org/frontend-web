import { useTranslation } from 'react-i18next'

const Error = () => {
  const { t } = useTranslation()

  return <div>{t('pages.error')}</div>
}

export default Error
