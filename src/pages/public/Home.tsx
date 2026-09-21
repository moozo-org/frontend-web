import Switch from '../../atoms/Switch'
import { useTheme } from '../../hooks/useTheme'

const Home = () => {
  const { theme, setTheme } = useTheme()

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <div>
      <div>Home</div>
      <Switch
        id="theme"
        label="Dark mode"
        checked={isDark}
        onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      />
    </div>
  )
}

export default Home
