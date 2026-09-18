import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import BottomNavigation from './components/BottomNavigation'
import CalendarScreen from './components/CalendarScreen'
import AddAppointmentModal from './components/AddAppointmentModal'
import KitListScreen from './components/KitListScreen'
import AddProductModal from './components/AddProductModal'
import ClientListScreen from './components/ClientListScreen'
import AddClientModal from './components/AddClientModal'
import ClientCard from './components/ClientCard'
import ChecklistScreen from './components/ChecklistScreen'
import AddTaskModal from './components/AddTaskModal'
import initialClients from './data/clients'
import { homeAppointments } from './data/appointments'
import initialChecklist from './data/checklist'
import {
  deleteClientImage,
  getLightweightClients,
  storeClientImages,
} from './data/clientImageStorage'

const calendarWeeks = [
  ['', '1', '2', '3', '4', '5', '6'],
  ['7', '8', '9', '10', '11', '12', '13'],
  ['14', '15', '16', '17', '18', '19', '20'],
  ['21', '22', '23', '24', '25', '26', '27'],
  ['28', '29', '30', '', '', '', ''],
]

function WelcomeCard() {
  return (
    <section className="welcome-card" aria-labelledby="welcome-heading">
      <div className="welcome-copy">
        <h1 id="welcome-heading">Welcome back</h1>
        <p>Your kit is looking good</p>
      </div>
      <div className="kit-summary">
        <p className="kit-title">Your Kit</p>
        <p>157 Products</p>
        <p>12 Products expiring soon</p>
      </div>
    </section>
  )
}

function MiniCalendar() {
  return (
    <div className="mini-calendar" aria-label="September 2026 calendar">
      <div className="calendar-heading">
        <span>September</span>
        <span className="calendar-year">2026</span>
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m4.5 2.5 3 3.5-3 3.5" /></svg>
      </div>
      <div className="calendar-grid calendar-weekdays" aria-hidden="true">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="calendar-grid calendar-days">
        {calendarWeeks.flatMap((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <span className={day === '6' ? 'selected-day' : ''} key={`${weekIndex}-${dayIndex}`}>
              {day}
            </span>
          )),
        )}
      </div>
    </div>
  )
}

function TodayCard({ clients, checklistCount, onOpenChecklist, onSelectClient }) {
  return (
    <section className="today-card" aria-labelledby="today-heading">
      <h2 id="today-heading">Today...</h2>
      <div className="today-content">
        <MiniCalendar />
        <div className="today-details">
          <div className="appointments" aria-label="Today's appointments">
            {homeAppointments.map((appointment) => {
              const client = clients.find(
                (item) => String(item.id) === String(appointment.clientId),
              )

              return (
                <div className="appointment-row" key={appointment.id}>
                  <time>{appointment.time}</time>
                  {client ? (
                    <button type="button" onClick={() => onSelectClient(client.id)}>
                      {client.name}
                    </button>
                  ) : (
                    <span>{appointment.notes}</span>
                  )}
                </div>
              )
            })}
          </div>
          <button className="checklist" type="button" onClick={onOpenChecklist}>
            Checklist ({checklistCount})
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m4.5 2.5 3 3.5-3 3.5" /></svg>
          </button>
        </div>
      </div>
    </section>
  )
}

function normalizeClients(savedClients) {
  if (!Array.isArray(savedClients)) return initialClients

  return savedClients.map((client) => {
    const sampleClient = initialClients.find((sample) => sample.name === client.name)
    const savedImages = Array.isArray(client.images) ? client.images : []
    const isLegacySample = Boolean(sampleClient && !client.notes && savedImages.length === 0)
    return {
      id: client.id,
      name: client.name,
      notes: client.notes || sampleClient?.notes || '',
      images: isLegacySample ? sampleClient.images : savedImages,
    }
  })
}

function normalizeAppointments(savedAppointments, clients) {
  if (!Array.isArray(savedAppointments)) return []

  return savedAppointments.map((appointment, index) => {
    const matchedClient = appointment.clientId
      ? clients.find((client) => String(client.id) === String(appointment.clientId))
      : clients.find((client) => client.name === appointment.client)

    return {
      id: appointment.id ?? `saved-appointment-${index}`,
      date: appointment.date,
      time: appointment.time,
      clientId: matchedClient?.id ?? null,
      notes: appointment.notes ?? '',
    }
  })
}

function App() {
  const [activePage, setActivePage] = useState('home')
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [clients, setClients] = useState(() => {
    try {
      const savedClients = window.localStorage.getItem('mk-clients')
      const parsedClients = savedClients ? JSON.parse(savedClients) : initialClients
      return normalizeClients(parsedClients)
    } catch {
      return initialClients
    }
  })
  const [checklist, setChecklist] = useState(() => {
    try {
      const savedChecklist = window.localStorage.getItem('mk-checklist')
      const parsedChecklist = savedChecklist ? JSON.parse(savedChecklist) : initialChecklist
      return Array.isArray(parsedChecklist) ? parsedChecklist : initialChecklist
    } catch {
      return initialChecklist
    }
  })
  const [addedAppointments, setAddedAppointments] = useState(() => {
    try {
      const savedAppointments = window.localStorage.getItem('mk-appointments')
      const parsedAppointments = savedAppointments ? JSON.parse(savedAppointments) : []
      const normalizedAppointments = normalizeAppointments(parsedAppointments, clients)
      try {
        window.localStorage.setItem('mk-appointments', JSON.stringify(normalizedAppointments))
      } catch {
        // Keep migrated appointments available for this session.
      }
      return normalizedAppointments
    } catch {
      return []
    }
  })
  const [addedProducts, setAddedProducts] = useState(() => {
    try {
      const savedProducts = window.localStorage.getItem('mk-products')
      const parsedProducts = savedProducts ? JSON.parse(savedProducts) : []
      return Array.isArray(parsedProducts) ? parsedProducts : []
    } catch {
      return []
    }
  })

  function saveAppointment(appointment) {
    const nextAppointments = [...addedAppointments, appointment]
    setAddedAppointments(nextAppointments)
    window.localStorage.setItem('mk-appointments', JSON.stringify(nextAppointments))
    setIsAppointmentModalOpen(false)
  }

  function updateChecklist(nextChecklist) {
    setChecklist(nextChecklist)
    try {
      window.localStorage.setItem('mk-checklist', JSON.stringify(nextChecklist))
    } catch {
      // Keep checklist changes available for this session if storage is unavailable.
    }
  }

  function addChecklistTask(task) {
    updateChecklist([...checklist, task])
    setIsTaskModalOpen(false)
  }

  function toggleChecklistTask(taskId) {
    updateChecklist(
      checklist.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function deleteChecklistTask(taskId) {
    updateChecklist(checklist.filter((task) => task.id !== taskId))
  }

  function saveProduct(product) {
    const nextProducts = [...addedProducts, product]
    setAddedProducts(nextProducts)
    window.localStorage.setItem('mk-products', JSON.stringify(nextProducts))
    setIsProductModalOpen(false)
  }

  function persistClients(nextClients, imageDataIsStored = true) {
    const clientsToStore = imageDataIsStored ? getLightweightClients(nextClients) : nextClients

    try {
      window.localStorage.setItem('mk-clients', JSON.stringify(clientsToStore))
    } catch {
      const withoutImages = getLightweightClients(
        nextClients.map((client) => ({ ...client, images: [] })),
      )
      try {
        window.localStorage.setItem('mk-clients', JSON.stringify(withoutImages))
      } catch {
        // Client data remains available for this session if storage is unavailable.
      }
    }
  }

  async function saveClient(client) {
    const nextClients = [...clients, client]
    const imageDataIsStored = await storeClientImages(
      nextClients.flatMap((savedClient) => savedClient.images),
    )
    persistClients(nextClients, imageDataIsStored)
    setClients(nextClients)
    setIsClientModalOpen(false)
  }

  async function addImagesToClient(clientId, images) {
    const nextClients = clients.map((client) =>
      client.id === clientId
        ? { ...client, images: [...client.images, ...images] }
        : client,
    )
    const imageDataIsStored = await storeClientImages(
      nextClients.flatMap((client) => client.images),
    )
    persistClients(nextClients, imageDataIsStored)
    setClients(nextClients)
  }

  async function removeImageFromClient(clientId, imageId) {
    const nextClients = clients.map((client) =>
      client.id === clientId
        ? { ...client, images: client.images.filter((image) => image.id !== imageId) }
        : client,
    )
    persistClients(nextClients)
    setClients(nextClients)
    await deleteClientImage(imageId)
  }

  const selectedClient = clients.find((client) => client.id === selectedClientId)
  const incompleteChecklistCount = checklist.filter((task) => !task.completed).length

  return (
    <main className="app-shell">
      <Header />
      {activePage === 'home' && (
        <div className={`app-content dashboard-content${selectedClient ? ' is-locked' : ''}`}>
          <WelcomeCard />
          <TodayCard
            clients={clients}
            checklistCount={incompleteChecklistCount}
            onOpenChecklist={() => setActivePage('checklist')}
            onSelectClient={setSelectedClientId}
          />
        </div>
      )}
      {activePage === 'checklist' && (
        <ChecklistScreen
          tasks={checklist}
          incompleteCount={incompleteChecklistCount}
          isModalOpen={isTaskModalOpen}
          onBack={() => setActivePage('home')}
          onOpenModal={() => setIsTaskModalOpen(true)}
          onToggleTask={toggleChecklistTask}
          onDeleteTask={deleteChecklistTask}
        />
      )}
      {activePage === 'calendar' && (
        <CalendarScreen
          addedAppointments={addedAppointments}
          clients={clients}
          isModalOpen={isAppointmentModalOpen || Boolean(selectedClient)}
          onOpenModal={() => setIsAppointmentModalOpen(true)}
          onSelectClient={setSelectedClientId}
        />
      )}
      {activePage === 'kit' && (
        <KitListScreen
          addedProducts={addedProducts}
          isModalOpen={isProductModalOpen}
          onOpenModal={() => setIsProductModalOpen(true)}
        />
      )}
      {activePage === 'clients' && (
        <ClientListScreen
          clients={clients}
          isModalOpen={isClientModalOpen || Boolean(selectedClient)}
          onOpenModal={() => setIsClientModalOpen(true)}
          onSelectClient={setSelectedClientId}
        />
      )}
      <BottomNavigation
        activePage={activePage === 'checklist' ? 'home' : activePage}
        onNavigate={setActivePage}
      />
      {isAppointmentModalOpen && (
        <AddAppointmentModal
          clients={clients}
          onClose={() => setIsAppointmentModalOpen(false)}
          onSave={saveAppointment}
        />
      )}
      {isProductModalOpen && (
        <AddProductModal
          onClose={() => setIsProductModalOpen(false)}
          onSave={saveProduct}
        />
      )}
      {isClientModalOpen && (
        <AddClientModal
          onClose={() => setIsClientModalOpen(false)}
          onSave={saveClient}
        />
      )}
      {selectedClient && (
        <ClientCard
          client={selectedClient}
          onClose={() => setSelectedClientId(null)}
          onAddImages={addImagesToClient}
          onDeleteImage={removeImageFromClient}
        />
      )}
      {isTaskModalOpen && (
        <AddTaskModal
          onClose={() => setIsTaskModalOpen(false)}
          onSave={addChecklistTask}
        />
      )}
    </main>
  )
}

export default App
