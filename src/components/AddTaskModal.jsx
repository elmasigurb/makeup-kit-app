import { useEffect, useState } from 'react'

function AddTaskModal({ onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  function submitTask(event) {
    event.preventDefault()

    if (!title.trim()) {
      setError('Please enter a task.')
      return
    }

    onSave({
      id: `task-${Date.now()}`,
      title: title.trim(),
      notes: notes.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <div className="modal-overlay add-task-overlay" role="presentation">
      <section className="appointment-modal add-task-modal" role="dialog" aria-modal="true" aria-labelledby="add-task-title">
        <div className="modal-title-row">
          <h2 id="add-task-title">Add Task</h2>
          <button className="close-modal" type="button" onClick={onClose} aria-label="Close add task">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg>
          </button>
        </div>

        <form onSubmit={submitTask} noValidate>
          <label className="modal-field">
            <span>Task</span>
            <input value={title} onChange={(event) => { setTitle(event.target.value); setError('') }} placeholder="What needs to be done?" autoFocus />
          </label>
          <label className="modal-field">
            <span>Notes</span>
            <input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add a note" />
          </label>

          <div className="modal-footer add-task-footer">
            <p className="form-error" role="alert">{error}</p>
            <button className="save-appointment" type="submit">Add Task</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddTaskModal
