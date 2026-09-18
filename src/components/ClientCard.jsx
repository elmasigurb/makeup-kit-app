import { useEffect, useState } from 'react'
import { getClientImageSource, resizeClientImage } from '../data/clientImageStorage'

function PlaceholderImage({ image, large = false }) {
  return (
    <div className={`client-photo-placeholder${large ? ' large' : ''}`}>
      <span>MK</span>
      <small>{image.name}</small>
    </div>
  )
}

function ClientCard({ client, onClose, onAddImages, onDeleteImage }) {
  const [displayImages, setDisplayImages] = useState([])
  const [previewImage, setPreviewImage] = useState(null)
  const [isAddingImages, setIsAddingImages] = useState(false)

  useEffect(() => {
    let isCurrent = true

    Promise.all(
      client.images.map(async (image) => ({
        ...image,
        src: image.placeholder ? '' : await getClientImageSource(image),
      })),
    ).then((images) => {
      if (isCurrent) setDisplayImages(images)
    })

    return () => {
      isCurrent = false
    }
  }, [client.images])

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        if (previewImage) setPreviewImage(null)
        else onClose()
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose, previewImage])

  async function addImages(event) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!files.length) return

    setIsAddingImages(true)
    try {
      const images = await Promise.all(files.map(resizeClientImage))
      await onAddImages(client.id, images)
    } finally {
      setIsAddingImages(false)
    }
  }

  async function confirmImageRemoval(image) {
    const shouldDelete = window.confirm('Remove this image from the client?')
    if (!shouldDelete) return

    if (previewImage?.id === image.id) setPreviewImage(null)
    await onDeleteImage(client.id, image.id)
  }

  return (
    <div className="modal-overlay client-card-overlay" role="presentation">
      <section className="client-card" role="dialog" aria-modal="true" aria-labelledby="client-card-title">
        <div className="client-card-title-row">
          <h2 id="client-card-title">{client.name}</h2>
          <button className="close-modal" type="button" onClick={onClose} aria-label="Close client card">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg>
          </button>
        </div>

        <section className="client-card-notes" aria-labelledby="client-notes-title">
          <h3 id="client-notes-title">Notes:</h3>
          <p>{client.notes || 'No notes added.'}</p>
        </section>

        <div className="client-card-images-heading">
          <h3>Images</h3>
          <label className="add-client-images" aria-label="Add images">
            <input type="file" accept="image/*" multiple onChange={addImages} disabled={isAddingImages} />
            <span>{isAddingImages ? '…' : '+'}</span>
          </label>
        </div>

        {displayImages.length > 0 ? (
          <div className="client-card-image-grid">
            {displayImages.map((image) => (
              <div className="client-card-image" key={image.id}>
                <button className="open-client-image" type="button" onClick={() => setPreviewImage(image)}>
                  {image.placeholder || !image.src ? (
                    <PlaceholderImage image={image} />
                  ) : (
                    <img src={image.src} alt={image.name} />
                  )}
                </button>
                <button
                  className="delete-client-image"
                  type="button"
                  onClick={() => confirmImageRemoval(image)}
                  aria-label={`Delete ${image.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-client-images">No images added.</p>
        )}
      </section>

      {previewImage && (
        <div className="client-image-viewer" role="dialog" aria-modal="true" aria-label="Image preview">
          <button type="button" onClick={() => setPreviewImage(null)} aria-label="Close image preview">
            ×
          </button>
          {previewImage.placeholder || !previewImage.src ? (
            <PlaceholderImage image={previewImage} large />
          ) : (
            <img src={previewImage.src} alt={previewImage.name} />
          )}
        </div>
      )}
    </div>
  )
}

export default ClientCard
