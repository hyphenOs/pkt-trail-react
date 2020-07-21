import React, { useState, useEffect } from "react";
import Table1LocalStoragePacketsArray from "./Table1LocalStoragePacketsArray";
import JSONViewer from "./JSONViewer";

import "./Dashboard.css";

const WebSocket_API = "ws://localhost:3030";
const socketClient = new WebSocket(WebSocket_API);

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    console.log("mounting");
    localStorage.removeItem("pcapData");
  }, []);

  socketClient.onopen = (e) => {
    console.log("connection opened");
  };

  socketClient.onmessage = (e) => {
    const localData = JSON.parse(localStorage.getItem("pcapData")) || [];
    localStorage.setItem("pcapData", JSON.stringify([...localData, e.data]));
    setCount(count + 1);
  };

  const stream = (message) => {
    setMessage(message);
    socketClient.send(message);
  };

  const data = JSON.parse(localStorage.getItem("pcapData") || "[]");

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
      {Boolean(count) && (
        <>
          <Table1LocalStoragePacketsArray
            setSelected={setSelected}
            selected={selected}
            data={data}
          />
          {selected?.selected && (
            <JSONViewer selectedData={JSON.parse(data[selected.index])} />
          )}
        </>
      )}
    </div>
  );
};
export default Dashboard;
