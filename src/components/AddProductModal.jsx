import { useEffect, useState } from 'react'

const initialForm = {
  brand: '',
  productName: '',
  productType: '',
  color: '',
  dateOpened: '',
  lastsFor: '',
  photoName: '',
  notes: '',
}

function BarcodeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5v14M7 5v14M10 5v14M14 5v14M17 5v14M20 5v14" />
      <path d="M3 3h4M3 3v4M21 3h-4M21 3v4M3 21h4M3 21v-4M21 21h-4M21 21v-4" />
    </svg>
  )
}

function AddProductModal({ onClose, onSave }) {
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

  function selectPhoto(event) {
    const file = event.target.files?.[0]
    setForm((current) => ({ ...current, photoName: file?.name ?? '' }))
  }

  function submitProduct(event) {
    event.preventDefault()

    if (!form.brand.trim() || !form.productName.trim() || !form.productType) {
      setError('Please complete brand, product name and product type.')
      return
    }

    onSave({
      ...form,
      id: Date.now(),
      brand: form.brand.trim(),
      productName: form.productName.trim(),
      color: form.color.trim(),
      dateOpened: form.dateOpened.trim(),
      lastsFor: form.lastsFor.trim(),
      notes: form.notes.trim(),
    })
  }

  return (
    <div className="modal-overlay product-modal-overlay" role="presentation">
      <section className="appointment-modal product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
        <div className="modal-title-row">
          <h2 id="product-modal-title">Add Product</h2>
          <button className="close-modal" type="button" onClick={onClose} aria-label="Close add product">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg>
          </button>
        </div>

        <div className="barcode-row">
          <button className="scan-barcode" type="button">
            <BarcodeIcon />
            <span>Scan Barcode</span>
          </button>
          <span className="barcode-or">or</span>
        </div>

        <form onSubmit={submitProduct} noValidate>
          <label className="modal-field">
            <span>Brand</span>
            <input name="brand" value={form.brand} onChange={updateField} placeholder="Input text" autoFocus />
          </label>
          <label className="modal-field">
            <span>Product Name</span>
            <input name="productName" value={form.productName} onChange={updateField} placeholder="Input text" />
          </label>
          <label className="modal-field">
            <span>Product Type</span>
            <select name="productType" value={form.productType} onChange={updateField}>
              <option value="" disabled>Choose Product Type</option>
              <option value="Face">Face</option>
              <option value="Eyes">Eyes</option>
              <option value="Lips">Lips</option>
            </select>
          </label>
          <label className="modal-field">
            <span>Color</span>
            <input name="color" value={form.color} onChange={updateField} placeholder="Input text" />
          </label>

          <div className="product-date-row">
            <label className="modal-field">
              <span>Date Opened</span>
              <input name="dateOpened" value={form.dateOpened} onChange={updateField} placeholder="DD.MM.YYYY" />
            </label>
            <label className="modal-field">
              <span>Lasts for</span>
              <input name="lastsFor" value={form.lastsFor} onChange={updateField} placeholder="12M" />
            </label>
          </div>

          <label className="modal-field photo-field">
            <span>Add Photo</span>
            <input className="product-file-input" type="file" accept="image/*" onChange={selectPhoto} />
            <span className={`file-picker${form.photoName ? ' has-file' : ''}`}>
              {form.photoName || 'Choose from files'}
            </span>
          </label>

          <label className="modal-field">
            <span>Notes</span>
            <textarea name="notes" value={form.notes} onChange={updateField} placeholder="Input text" rows="2" />
          </label>

          <div className="modal-footer product-modal-footer">
            <p className="form-error" role="alert">{error}</p>
            <button className="save-appointment" type="submit">Save Product</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddProductModal
