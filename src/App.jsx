import Logo from './components/Logo'
import ThemeToggle from './components/ThemeToggle'
import './App.css'

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-brand">
          <Logo size={24} />
          <span className="app-title">Bible</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="app-main">
        <p className="app-welcome">In the beginning was the Word.</p>
      </main>
    </div>
  )
}
