import React, { useState } from "react";
import Table from "./Table";
import JSONViewer from "./JSONViewer";

import "./Dashboard.css";

const WebSocket_API = "ws://localhost:3030";
const socketClient = new WebSocket(WebSocket_API);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState({});

  socketClient.onopen = (e) => {
    console.log("connection opened");
  };

  socketClient.onmessage = (e) => {
    console.log("Message received");
    setData((prevData) => [...prevData, e.data]);
  };

  const stream = (message) => {
    setMessage(message);
    socketClient.send(message);
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
          disabled={message === "start"}
          onClick={() => stream("start")}
        >
          Start
        </button>
        <button
          className="dashboard-button"
          data-testid="button-stop"
          disabled={message === "stop"}
          onClick={() => stream("stop")}
        >
          Stop
        </button>
      </div>
      <Table setSelected={setSelected} selected={selected} data={data} />
      {selected?.selected && (
        <JSONViewer
          layers={JSON.parse(data[selected.index])["_source"]["layers"]}
        />
      )}
    </div>
  );
};
export default Dashboard;
