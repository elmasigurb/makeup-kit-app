function groupClientsByFirstLetter(clientList) {
  const sortedClients = [...clientList].sort((a, b) =>
    a.name.localeCompare(b.name, 'is'),
  )

  return sortedClients.reduce((groups, client) => {
    const letter = client.name.charAt(0).toLocaleUpperCase('is')
    const existingGroup = groups.find((group) => group.letter === letter)

    if (existingGroup) {
      existingGroup.clients.push(client)
    } else {
      groups.push({ letter, clients: [client] })
    }

    return groups
  }, [])
}

function ClientGroup({ letter, groupedClients, onSelectClient }) {
  return (
    <section className="client-group" aria-labelledby={`clients-${letter}`}>
      <h2 id={`clients-${letter}`}>{letter}</h2>
      <div className="client-rows">
        {groupedClients.map((client) => (
          <button className="client-row" type="button" onClick={() => onSelectClient(client.id)} key={client.id}>
            {client.name}
          </button>
        ))}
      </div>
    </section>
  )
}

function ClientListScreen({ clients, isModalOpen, onOpenModal, onSelectClient }) {
  const clientGroups = groupClientsByFirstLetter(clients)

  return (
    <div className={`app-content client-list-screen${isModalOpen ? ' is-locked' : ''}`}>
      <div className="client-title-row">
        <h1>Client List</h1>
        <button className="add-client" type="button" aria-label="Add client" onClick={onOpenModal}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4v16M4 12h16" />
          </svg>
        </button>
      </div>

      <div className="client-list-panel">
        {clientGroups.map((group) => (
          <ClientGroup
            letter={group.letter}
            groupedClients={group.clients}
            onSelectClient={onSelectClient}
            key={group.letter}
          />
        ))}
      </div>
    </div>
  )
}

export default ClientListScreen
