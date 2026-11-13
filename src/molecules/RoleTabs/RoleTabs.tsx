import { useTranslation } from "react-i18next"
import { NavLink } from "react-router"
import styles from "./RoleTabs.module.css"

const RoleTabs = () => {
  const { t } = useTranslation()

  return (
    <nav className={styles.tabs}>
      <NavLink to="/register" end className={styles.tab}>
        {t("auth.register.organizer")}
      </NavLink>
      <NavLink to="/register/provider" className={styles.tab}>
        {t("auth.register.vendor")}
      </NavLink>
    </nav>
  )
}

export default RoleTabs
