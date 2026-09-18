const kitCategories = [
  {
    name: 'FACE',
    products: [
      ['Nars', 'Radiant Blush', '12/27'],
      ['Nars', 'Radiant Blush', '12/27'],
      ['Nars', 'Radiant Blush', '12/27'],
    ],
  },
  {
    name: 'EYES',
    products: [
      ['Nars', 'Radiant Blush', '12/27'],
      ['Nars', 'Radiant Blush', '12/27'],
      ['Nars', 'Radiant Blush', '12/27'],
      ['Nars', 'Radiant Blush', '12/27'],
    ],
  },
  {
    name: 'LIPS',
    products: [
      ['Nars', 'Radiant Blush', '12/27'],
      ['Nars', 'Radiant Blush', '12/27'],
      ['Nars', 'Radiant Blush', '12/27'],
      ['Nars', 'Radiant Blush', '12/27'],
    ],
  },
]

function ProductCategory({ name, products }) {
  return (
    <section className="product-category" aria-labelledby={`category-${name.toLowerCase()}`}>
      <h2 id={`category-${name.toLowerCase()}`}>{name}</h2>
      <div className="product-rows">
        {products.map(([brand, product, expiration], index) => (
          <div className="product-row" key={`${name}-${index}`}>
            <span>{brand}</span>
            <span>{product}</span>
            <time>{expiration}</time>
          </div>
        ))}
      </div>
    </section>
  )
}

function getExpiration(dateOpened, lastsFor) {
  const months = Number.parseInt(lastsFor, 10)
  const dateParts = dateOpened.includes('-')
    ? dateOpened.split('-').map(Number)
    : dateOpened.split('.').reverse().map(Number)
  const [year, month, day] = dateParts

  if (!dateOpened || !lastsFor || !year || !month || !day || !Number.isFinite(months)) {
    return ''
  }

  const expiration = new Date(year, month - 1 + months, day)
  const expirationMonth = String(expiration.getMonth() + 1).padStart(2, '0')
  const expirationYear = String(expiration.getFullYear()).slice(-2)
  return `${expirationMonth}/${expirationYear}`
}

function KitListScreen({ addedProducts, isModalOpen, onOpenModal }) {
  const displayedCategories = kitCategories.map((category) => {
    const productsForCategory = addedProducts
      .filter((product) => String(product.productType).toUpperCase() === category.name)
      .map((product) => [
        product.brand,
        product.productName,
        getExpiration(product.dateOpened, product.lastsFor),
      ])

    return {
      ...category,
      products: [...category.products, ...productsForCategory],
    }
  })

  return (
    <div className={`app-content kit-list-screen${isModalOpen ? ' is-locked' : ''}`}>
      <div className="kit-title-row">
        <h1>Kit List</h1>
        <button className="add-product" type="button" aria-label="Add product" onClick={onOpenModal}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4v16M4 12h16" />
          </svg>
        </button>
      </div>

      <div className="kit-list-panel">
        {displayedCategories.map((category) => (
          <ProductCategory name={category.name} products={category.products} key={category.name} />
        ))}
      </div>
    </div>
  )
}

export default KitListScreen
