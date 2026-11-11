import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Button, Card, Link, Title } from '../../../atoms'
import { useAuth } from '../../../hooks/useAuth'
import styles from '../../FormPage.module.css'

const Profile = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // TODO: show and edit the personal details, this page only holds the account actions for now
  return (
    <main className={styles.page}>
      <Card>
        <div className={styles.header}>
          <Title>{t('profile.title')}</Title>
        </div>

        <div className={styles.form}>
          <Link to="/profile/password">{t('profile.changePassword')}</Link>
          <Button variant="secondary" fullWidth onClick={handleLogout}>
            {t('profile.logout')}
          </Button>
        </div>
      </Card>
    </main>
  )
}

export default Profile
