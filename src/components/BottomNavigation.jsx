function HomeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.5 10.7 8.5-7 8.5 7" /><path d="M5.5 9.2V20h13V9.2M9.4 20v-6h5.2v6" /></svg>
}

function CalendarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5.5h14a1 1 0 0 1 1 1V20H4V6.5a1 1 0 0 1 1-1Z" /><path d="M8 3v5M16 3v5M4 10h16" /></svg>
}

function KitIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.7 14.2 7.5-7.5 3.1 3.1-7.5 7.5a2.2 2.2 0 0 1-3.1 0 2.2 2.2 0 0 1 0-3.1Z" /><path d="m13.3 7.6 2.2-2.2a2.2 2.2 0 0 1 3.1 3.1l-2.2 2.2M5.8 15.2l3 3" /></svg>
}

function ClientsIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.5" r="3" /><path d="M5.5 20v-1.4a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4V20h-13Z" /></svg>
}

const navItems = [
  { label: 'Home', page: 'home', Icon: HomeIcon },
  { label: 'Calendar', page: 'calendar', Icon: CalendarIcon },
  { label: 'Kit', page: 'kit', Icon: KitIcon },
  { label: 'Clients', page: 'clients', Icon: ClientsIcon },
]

function BottomNavigation({ activePage, onNavigate }) {
  return (
    <nav className="bottom-navigation" aria-label="Main navigation">
      {navItems.map(({ label, page, Icon }) => (
        <button
          className={`nav-item${activePage === page ? ' active' : ''}`}
          type="button"
          onClick={page ? () => onNavigate(page) : undefined}
          disabled={!page}
          aria-current={activePage === page ? 'page' : undefined}
          aria-label={label}
          key={label}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNavigation
