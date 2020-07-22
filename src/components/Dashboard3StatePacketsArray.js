import React, { useState, useEffect } from "react";
import Table3StatePacketsArray from "./Table3StatePacketsArray";
import JSONViewer from "./JSONViewer";

import "./Dashboard.css";

const WebSocket_API = "ws://localhost:3030";
const socketClient = new WebSocket(WebSocket_API);

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState({ selected: true, index: null });

  useEffect(() => {
    console.log("mounting");
    localStorage.clear();
  }, []);

  socketClient.onopen = (e) => {
    console.log("connection opened");
  };

  socketClient.onmessage = (e) => {
    const newCount = count + 1;
    localStorage.setItem(`${newCount}`, e.data);
    setCount(newCount);
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
      {Boolean(count) && (
        <>
          <Table3StatePacketsArray
            setSelected={setSelected}
            selected={selected}
            count={count}
          />
          {/* {selected?.selected && (
            <JSONViewer selectedData={JSON.parse(data[selected.index])} />
          )} */}
        </>
      )}
    </div>
  );
};
export default Dashboard;
