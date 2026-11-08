import { Spinner } from '../../atoms'
import styles from './PageLoader.module.css'

const PageLoader = () => (
  <main className={styles.page} aria-busy="true">
    <Spinner size={24} />
  </main>
)

export default PageLoader
