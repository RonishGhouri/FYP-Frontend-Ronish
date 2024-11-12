import React from 'react'
import ClientSidebar from './sidebar/ClientSidebar'
import ClientHeader from './header/ClientHeader'
import './ClientBrowserArtist.css'

function ClientBrowserArtist() {
  return (
    <div className="client-dashboard">
      <ClientSidebar />
      <div className="client-main-dashboard">
        <ClientHeader />

      </div>
    </div>
  )
}

export default ClientBrowserArtist