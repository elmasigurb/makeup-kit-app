import { useEffect, useState } from 'react'

const initialForm = {
  date: '',
  time: '',
  clientId: '',
  notes: '',
}

function AddAppointmentModal({ clients, onClose, onSave }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (error) setError('')
  }

  function submitAppointment(event) {
    event.preventDefault()

    if (!form.date.trim() || !form.time.trim() || !form.clientId) {
      setError('Please complete date, time and client name.')
      return
    }

    onSave({
      id: Date.now(),
      date: form.date.trim(),
      time: form.time.trim(),
      clientId: form.clientId,
      notes: form.notes.trim(),
    })
  }

  return (
    <div className="modal-overlay" role="presentation">
      <section className="appointment-modal" role="dialog" aria-modal="true" aria-labelledby="appointment-modal-title">
        <div className="modal-title-row">
          <h2 id="appointment-modal-title">Add Appointment</h2>
          <button className="close-modal" type="button" onClick={onClose} aria-label="Close add appointment">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m5 5 14 14M19 5 5 19" />
            </svg>
          </button>
        </div>

        <form onSubmit={submitAppointment} noValidate>
          <label className="modal-field">
            <span>Date</span>
            <input name="date" value={form.date} onChange={updateField} placeholder="DD.MM.YYYY" autoFocus />
          </label>

          <label className="modal-field">
            <span>Time</span>
            <input name="time" value={form.time} onChange={updateField} placeholder="HH:MM" />
          </label>

          <label className="modal-field">
            <span>Name Of Client</span>
            <select name="clientId" value={form.clientId} onChange={updateField}>
              <option value="" disabled>Input Text or Dropdown</option>
              {clients.map((client) => (
                <option value={client.id} key={client.id}>{client.name}</option>
              ))}
            </select>
          </label>

          <label className="modal-field">
            <span>Notes</span>
            <input name="notes" value={form.notes} onChange={updateField} placeholder="Input text" />
          </label>

          <div className="modal-footer">
            <p className="form-error" role="alert">{error}</p>
            <button className="save-appointment" type="submit">Save Appointment</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddAppointmentModal
