const DATABASE_NAME = 'mk-client-images'
const STORE_NAME = 'images'

function openImageDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is unavailable'))
      return
    }

    const request = window.indexedDB.open(DATABASE_NAME, 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

function waitForTransaction(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
}

export function resizeClientImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error(`Could not read ${file.name}`))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error(`Could not process ${file.name}`))
      image.onload = () => {
        const maxDimension = 720
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))

        const context = canvas.getContext('2d')
        if (!context) {
          reject(new Error(`Could not process ${file.name}`))
          return
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          src: canvas.toDataURL('image/jpeg', 0.74),
        })
      }
      image.src = reader.result
    }

    reader.readAsDataURL(file)
  })
}

export async function storeClientImages(images) {
  const imagesWithSources = images.filter((image) => image.src && !image.placeholder)
  if (!imagesWithSources.length) return true

  try {
    const database = await openImageDatabase()
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    imagesWithSources.forEach((image) => {
      store.put({ id: image.id, name: image.name, src: image.src })
    })

    await waitForTransaction(transaction)
    database.close()
    return true
  } catch {
    return false
  }
}

export async function getClientImageSource(image) {
  if (image.src) return image.src
  if (image.placeholder) return ''

  try {
    const database = await openImageDatabase()
    const source = await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readonly')
      const request = transaction.objectStore(STORE_NAME).get(image.id)
      request.onsuccess = () => resolve(request.result?.src ?? '')
      request.onerror = () => reject(request.error)
    })
    database.close()
    return source
  } catch {
    return ''
  }
}

export async function deleteClientImage(imageId) {
  try {
    const database = await openImageDatabase()
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).delete(imageId)
    await waitForTransaction(transaction)
    database.close()
  } catch {
    // Removing the client reference is enough when image storage is unavailable.
  }
}

export function getLightweightClients(clients) {
  return clients.map((client) => ({
    ...client,
    images: client.images.map(({ id, name, placeholder }) => ({
      id,
      name,
      ...(placeholder ? { placeholder: true } : {}),
    })),
  }))
}
