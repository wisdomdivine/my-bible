import { IconSun, IconMoon } from '@tabler/icons-react'
import { useTheme } from '../hooks/useTheme'
import './ThemeToggle.css'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Appearance">
      <button
        type="button"
        className={`theme-option ${theme === 'light' ? 'is-active' : ''}`}
        onClick={() => setTheme('light')}
        role="radio"
        aria-checked={theme === 'light'}
      >
        <IconSun size={15} stroke={1.5} aria-hidden="true" />
        <span>Light</span>
      </button>
      <button
        type="button"
        className={`theme-option ${theme === 'dark' ? 'is-active' : ''}`}
        onClick={() => setTheme('dark')}
        role="radio"
        aria-checked={theme === 'dark'}
      >
        <IconMoon size={15} stroke={1.5} aria-hidden="true" />
        <span>Dark</span>
      </button>
    </div>
  )
}
