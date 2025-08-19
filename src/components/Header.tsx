import { NavLink } from 'react-router'

const navigations = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/movies', label: 'Movies' },
  { to: '/signin', label: 'Sign In' },
  { to: '/todos', label: 'Todos' }
]
export default function Header() {
  return (
    <header className="flex gap-2.5">
      {navigations.map(nav => (
        <NavLink
          key={nav.to}
          to={nav.to}
          className={({ isActive }) => (isActive ? 'text-red-500' : '')}>
          {nav.label}
        </NavLink>
      ))}
    </header>
  )
}
