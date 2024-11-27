import React from 'react'
import ClientSidebar from './sidebar/ClientSidebar'
import ClientHeader from './header/ClientHeader'
import './ClientEvent.css'

function ClientEvent() {
  return (
    <div className="client-dashboard">
      <ClientSidebar />
      <div className="client-main-dashboard">
        <ClientHeader />
        <div>Event</div>
      </div>
    </div>
  )
}

export default ClientEvent