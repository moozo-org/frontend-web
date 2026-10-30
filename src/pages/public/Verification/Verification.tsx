import { useTranslation } from 'react-i18next'

const Verification = () => {
  const { t } = useTranslation()

  // Check de la communication phone or email (complete the phone number or email address) and send verification code to the user. The user will then enter the code in the input field and submit it to verify their identity.
  return <div>{t('pages.verification')}</div>
}

export default Verification
