import React, { useState, useEffect } from "react";
import Table from "./Table";
import PacketDetailsViewer from "./PacketDetailsViewer";
import "./Dashboard.css";

const WebSocket_API = "ws://localhost:3030";
const socketClient = new WebSocket(WebSocket_API);

const Dashboard = () => {
  const [streamMessage, setStreamMessage] = useState("");
  const [packets, setPackets] = useState(null);
  const [selectedPacket, setSelectedPacket] = useState(null);

  useEffect(() => {
    return () => {
      console.log("Unmounting dashboard");
      localStorage.clear();
    };
  }, []);

  socketClient.onopen = (e) => {
    console.log("connection opened");
  };

  socketClient.onmessage = (e) => {
    setPackets(e.data);
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
      {packets && (
        <Table getSelectedPacket={getSelectedPacket} packets={packets} />
      )}
      {selectedPacket && (
        <PacketDetailsViewer selectedPacket={selectedPacket} />
      )}
    </div>
  );
};
export default Dashboard;
