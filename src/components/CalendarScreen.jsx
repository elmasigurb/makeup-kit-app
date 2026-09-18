import calendarAppointments from '../data/appointments'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthWeeks = [
  ['', '', '1', '2', '3', '4', '5'],
  ['6', '7', '8', '9', '10', '11', '12'],
  ['13', '14', '15', '16', '17', '18', '19'],
  ['20', '21', '22', '23', '24', '25', '26'],
  ['27', '28', '29', '30', '', '', ''],
]

function getWeekday(dateValue) {
  const [day, month, year] = dateValue.split('.').map(Number)
  const date = new Date(year, month - 1, day)

  if (
    !day ||
    !month ||
    !year ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return ''
  }

  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

function groupAppointments(appointments) {
  const groups = new Map()

  appointments.forEach((appointment) => {
    if (!groups.has(appointment.date)) groups.set(appointment.date, [])
    groups.get(appointment.date).push(appointment)
  })

  return Array.from(groups, ([date, groupedAppointments]) => ({
    date,
    label: `${date.slice(0, 5)} ${getWeekday(date)}`.trim(),
    appointments: groupedAppointments.sort((a, b) => a.time.localeCompare(b.time)),
  })).sort((a, b) => {
    const [aDay, aMonth, aYear] = a.date.split('.').map(Number)
    const [bDay, bMonth, bYear] = b.date.split('.').map(Number)
    return new Date(aYear, aMonth - 1, aDay) - new Date(bYear, bMonth - 1, bDay)
  })
}

function CalendarScreen({ addedAppointments, clients, isModalOpen, onOpenModal, onSelectClient }) {
  const displayedGroups = groupAppointments([...calendarAppointments, ...addedAppointments])

  return (
    <div className={`app-content calendar-screen${isModalOpen ? ' is-locked' : ''}`}>
      <section className="month-section" aria-labelledby="calendar-title">
        <div className="month-title-row">
          <h1 id="calendar-title">September 2026</h1>
          <button className="add-appointment" type="button" aria-label="Add appointment" onClick={onOpenModal}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v16M4 12h16" />
            </svg>
          </button>
        </div>

        <div className="month-grid month-weekdays" aria-hidden="true">
          {weekdays.map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="month-grid month-dates" aria-label="September 2026 dates">
          {monthWeeks.flatMap((week, weekIndex) =>
            week.map((date, dayIndex) => (
              <span className={date === '6' ? 'month-selected-date' : ''} key={`${weekIndex}-${dayIndex}`}>
                {date}
              </span>
            )),
          )}
        </div>
      </section>

      <section className="next-up-section" aria-labelledby="next-up-title">
        <h2 id="next-up-title">Next up...</h2>
        <div className="appointment-groups">
          {displayedGroups.map((group) => (
            <article className="appointment-card" key={group.date}>
              <h3>{group.label}</h3>
              {group.appointments.map((appointment) => {
                const client = clients.find(
                  (item) => String(item.id) === String(appointment.clientId),
                )

                return (
                  <div className="calendar-appointment" key={appointment.id}>
                    <time>{appointment.time}</time>
                    {client ? (
                      <button type="button" onClick={() => onSelectClient(client.id)}>
                        {client.name}
                      </button>
                    ) : (
                      <span>Client unavailable</span>
                    )}
                  </div>
                )
              })}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default CalendarScreen
