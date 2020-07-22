import React, { useState, useEffect } from "react";
import Table from "./Table";
import PacketDetailsViewer from "./PacketDetailsViewer";
import "./Dashboard.css";

const WebSocket_API = "ws://localhost:3030";
const socketClient = new WebSocket(WebSocket_API);

const Dashboard = () => {
  const [streamMessage, setStreamMessage] = useState("");
  const [packet, setPacket] = useState(null);
  const [selectedPacket, setSelectedPacket] = useState(null);

  useEffect(() => {
    console.log("mounting");
  }, []);

  socketClient.onopen = (e) => {
    console.log("connection opened");
  };

  socketClient.onmessage = (e) => {
    setPacket(e.data);
  };

  const stream = (message) => {
    setStreamMessage(message);
    socketClient.send(message);
  };

  const getSelectedPacket = (packet) => {
    setSelectedPacket(packet);
  };

  return (
    <div>
      <h2 className="dashboard-header">
        Packet Viewer by <span className="dashboard-company">hyphenOs</span>
      </h2>
      <div className="dashboard-toolbar">
        <button
          className="dashboard-button"
          data-testid="button-start"
          disabled={streamMessage === "start"}
          onClick={() => stream("start")}
        >
          Start
        </button>
        <button
          className="dashboard-button"
          data-testid="button-stop"
          disabled={streamMessage === "stop"}
          onClick={() => stream("stop")}
        >
          Stop
        </button>
      </div>
      {packet && (
        <Table getSelectedPacket={setSelectedPacket} packet={packet} />
      )}
      {selectedPacket && (
        <PacketDetailsViewer selectedPacket={selectedPacket} />
      )}
    </div>
  );
};
export default Dashboard;
