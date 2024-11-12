import React from 'react'
import ClientSidebar from './sidebar/ClientSidebar'
import ClientHeader from './header/ClientHeader'
import './ClientPayment.css'

function ClientPayment() {
  return (
    <div className="client-dashboard">
      <ClientSidebar />
      <div className="client-main-dashboard">
        <ClientHeader />
        <div>PAyment Phass gai aye galay vich</div>
      </div>
    </div>
  )
}

export default ClientPayment