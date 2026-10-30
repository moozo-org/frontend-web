import { useTranslation } from 'react-i18next'
import { languages } from '../../i18n'
import Pill from '../Pill/Pill'
import styles from './LanguageSwitch.module.css'

const LanguageSwitch = () => {
  const { t, i18n } = useTranslation()

  return (
    <div aria-label={t('language.label')} className={styles.group}>
      {languages.map((lang) => (
        <Pill
          key={lang}
          selected={i18n.resolvedLanguage === lang}
          onClick={() => i18n.changeLanguage(lang)}
        >
          {t(`language.${lang}`)}
        </Pill>
      ))}
    </div>
  )
}

export default LanguageSwitch
