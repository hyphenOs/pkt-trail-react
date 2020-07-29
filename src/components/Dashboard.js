/**
 * Top Level `Dashboard` Component.
 *
 * @author Mayur Borse <mayur@hyphenos.io>
 */
import React, { useState } from "react";
import Table from "./Table";
import PacketDetailsViewer from "./PacketDetailsViewer";
import "./Dashboard.css";

const Dashboard = ({ packets, config }) => {
  const [selectedPacket, setSelectedPacket] = useState(null);

  const getSelectedPacket = (packet) => {
    setSelectedPacket(packet);
  };

  const { dashboardConfig, tableConfig, detailsConfig } = config;

  return (
    <div className="packet-dashboard">
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
  );
};
export default Dashboard;
