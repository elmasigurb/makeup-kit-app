import { useEffect, useState } from 'react'
import { resizeClientImage } from '../data/clientImageStorage'

const initialForm = {
  name: '',
  notes: '',
  images: [],
}

function AddClientModal({ onClose, onSave }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isPreparingImages, setIsPreparingImages] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

  async function selectImages(event) {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    setIsPreparingImages(true)
    setError('')

    try {
      const images = await Promise.all(files.map(resizeClientImage))
      setForm((current) => ({ ...current, images: [...current.images, ...images] }))
    } catch {
      setError('One or more images could not be prepared.')
    } finally {
      setIsPreparingImages(false)
    }
  }

  function removeImage(imageId) {
    setForm((current) => ({
      ...current,
      images: current.images.filter((image) => image.id !== imageId),
    }))
  }

  async function submitClient(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('Please enter a client name.')
      return
    }

    setIsSaving(true)
    try {
      await onSave({
        id: Date.now(),
        name: form.name.trim(),
        notes: form.notes.trim(),
        images: form.images,
      })
    } catch {
      setError('The client could not be saved. Please try again.')
      setIsSaving(false)
    }
  }

  return (
    <div className="modal-overlay client-modal-overlay" role="presentation">
      <section className="appointment-modal client-modal" role="dialog" aria-modal="true" aria-labelledby="client-modal-title">
        <div className="modal-title-row">
          <h2 id="client-modal-title">Add Client</h2>
          <button className="close-modal" type="button" onClick={onClose} aria-label="Close add client">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg>
          </button>
        </div>

        <form onSubmit={submitClient} noValidate>
          <label className="modal-field">
            <span>Name</span>
            <input name="name" value={form.name} onChange={updateField} placeholder="Input text" autoFocus />
          </label>

          <label className="modal-field client-notes-field">
            <span>Notes</span>
            <textarea name="notes" value={form.notes} onChange={updateField} placeholder="Input text" rows="3" />
          </label>

          <label className="modal-field client-images-field">
            <span>Add Images</span>
            <input className="client-file-input" type="file" accept="image/*" multiple onChange={selectImages} />
            <span className="client-file-picker">
              {isPreparingImages ? 'Preparing images...' : 'Choose from files'}
            </span>
          </label>

          {form.images.length > 0 && (
            <div className="client-image-previews" aria-label="Selected image previews">
              {form.images.map((image) => (
                <div className="selected-image-preview" key={image.id}>
                  <img src={image.src} alt={image.name} title={image.name} />
                  <button type="button" onClick={() => removeImage(image.id)} aria-label={`Remove ${image.name}`}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="modal-footer client-modal-footer">
            <p className="form-error" role="alert">{error}</p>
            <button className="save-appointment" type="submit" disabled={isPreparingImages || isSaving}>
              {isSaving ? 'Saving...' : 'Save Client'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddClientModal
