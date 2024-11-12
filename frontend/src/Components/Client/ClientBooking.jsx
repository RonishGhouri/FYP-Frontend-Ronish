import React from 'react'
import ClientSidebar from './sidebar/ClientSidebar'
import ClientHeader from './header/ClientHeader'
import './ClientBooking.css'

function ClientBooking() {
  return (
    <div className="client-dashboard">
      <ClientSidebar />
      <div className="client-main-dashboard">
        <ClientHeader />

      </div>
    </div>
  )
}

export default ClientBooking