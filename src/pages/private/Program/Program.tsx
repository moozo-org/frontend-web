import { useTranslation } from 'react-i18next'

const Program = () => {
  const { t } = useTranslation()

  return <div>{t('pages.program')}</div>
}

export default Program
