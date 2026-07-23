import { useEffect, useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { profile } from '../data/placeholders'
import { useTheme } from '../context/ThemeContext'

const LINKS = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#skills', label: 'Skills' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#contato', label: 'Contato' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        isScrolled ? 'bg-bg/80 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-lg font-bold text-text">
          BrunoTrevizani<span className="text-gradient">Studio</span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-text-muted transition-colors hover:text-text"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-accent/50 hover:bg-surface"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <a
            href={`mailto:${profile.email}`}
            className="hidden md:inline-flex items-center rounded-full bg-gradient-to-r from-accent-from to-accent-to px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            Fale comigo
          </a>

          <button
            type="button"
            className="md:hidden text-text"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-bg/95 backdrop-blur-md">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-text-muted transition-colors hover:bg-surface hover:text-text"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
