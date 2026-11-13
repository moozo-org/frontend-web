import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { Button, Link } from "../../../atoms"
import { useAuth } from "../../../hooks/useAuth"
import FormPage from "../../../templates/FormPage/FormPage"
import { Form } from "../../../molecules"

const Profile = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    void navigate("/login", { replace: true })
  }

  // TODO: show and edit the personal details, this page only holds the account actions for now
  return (
    <FormPage title={t("profile.title")}>
      <Form>
        <Link to="/profile/password">{t("profile.changePassword")}</Link>
        <Button variant="secondary" fullWidth onClick={handleLogout}>
          {t("profile.logout")}
        </Button>
      </Form>
    </FormPage>
  )
}

export default Profile
