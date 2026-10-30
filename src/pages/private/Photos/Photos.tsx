import { useTranslation } from 'react-i18next'

const Photos = () => {
  const { t } = useTranslation()

  return <div>{t('pages.photos')}</div>
}

export default Photos
