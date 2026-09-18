function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m15 5-7 7 7 7" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  )
}

function ChecklistScreen({ tasks, incompleteCount, isModalOpen, onBack, onOpenModal, onToggleTask, onDeleteTask }) {
  return (
    <div className={`app-content checklist-screen${isModalOpen ? ' is-locked' : ''}`}>
      <div className="checklist-title-row">
        <button className="checklist-back" type="button" onClick={onBack} aria-label="Back to Home">
          <BackIcon />
        </button>
        <h1>Checklist <span>({incompleteCount})</span></h1>
        <button className="add-checklist-task" type="button" onClick={onOpenModal} aria-label="Add task">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16" /></svg>
        </button>
      </div>

      <section className="checklist-panel" aria-label="Checklist tasks">
        {tasks.length > 0 ? (
          <div className="checklist-items">
            {tasks.map((task) => (
              <article className={`checklist-item${task.completed ? ' completed' : ''}`} key={task.id}>
                <button className="checklist-task-main" type="button" onClick={() => onToggleTask(task.id)}>
                  <span className="custom-check" aria-hidden="true">
                    {task.completed && (
                      <svg viewBox="0 0 16 16"><path d="m3 8.5 3 3 7-7" /></svg>
                    )}
                  </span>
                  <span className="checklist-task-copy">
                    <strong>{task.title}</strong>
                    {task.notes && <small>{task.notes}</small>}
                  </span>
                </button>
                <button className="delete-task" type="button" onClick={() => onDeleteTask(task.id)} aria-label={`Delete ${task.title}`}>
                  <TrashIcon />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-checklist">Your checklist is clear.</p>
        )}
      </section>
    </div>
  )
}

export default ChecklistScreen
