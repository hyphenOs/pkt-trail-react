/**
 * Top Level `Dashboard` Component.
 *
 * @author Mayur Borse <mayur@hyphenos.io>
 */
import React, { useState, useCallback } from 'react'
import defaultConfig from '../constants/defaultConfig'
import Table from './Table'
import PacketDetailsViewer from './PacketDetailsViewer'

const Dashboard = ({ packets, config }) => {
  /**
   * selectedPacket will be rendered by PacketDetailsViewer if not empty
   */
  const [selectedPacket, setSelectedPacket] = useState(null)

  /**
   * Toggles selected packet between received packet object or empty object {}
   * @param {object} packet - Selected packet object
   * useCallback hook invokes this functions only when packet is selected in Table.
   */
  const getSelectedPacket = useCallback((packet) => {
    setSelectedPacket(selectedPacket ? null : packet)
  }, [])

  /**
   *  Current config state
   */
  const [currentConfig, setCurrentConfig] = useState(() =>
    config ? mergeConfig(defaultConfig, config) : defaultConfig
  )

  function mergeConfig(oldConfig, newConfig) {
    let mergedConfig = {}
    for (let key in newConfig) {
      mergedConfig[key] = { ...oldConfig[key], ...newConfig[key] }
    }
    return mergedConfig
  }

  /**
   * Config objects are passed to respective components.
   */
  const { dashboardConfig, tableConfig, detailsConfig } = currentConfig

  if (!packets) return <h2>No packets provided</h2>

  return (
    <div className='packet-dashboard'>
      {packets && (
        <Table
          getSelectedPacket={getSelectedPacket}
          packets={packets}
          config={tableConfig}
        />
      )}

      {dashboardConfig?.showSelectedDetails && selectedPacket && (
        <PacketDetailsViewer
          selectedPacket={selectedPacket}
          config={detailsConfig}
        />
      )}
    </div>
  )
}
export default Dashboard
