import React, { useState } from "react";
import "./App.css";
import config from "./constants/config";
import Dashboard from "./components/Dashboard";

const WebSocket_API = "ws://localhost:3030";
const socketClient = new WebSocket(WebSocket_API);

function App() {
  const [streamMessage, setStreamMessage] = useState("");
  const [packets, setPackets] = useState(null);

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

  return (
    <div className="App">
      <h2 className="app-header">
        Packet Viewer by <span className="app-company">hyphenOs</span>
      </h2>
      <div className="app-toolbar">
        <button
          className="app-button"
          data-testid="button-start"
          disabled={streamMessage === "start"}
          onClick={() => stream("start")}
        >
          Start
        </button>
        <button
          className="app-button"
          data-testid="button-stop"
          disabled={streamMessage === "stop"}
          onClick={() => stream("stop")}
        >
          Stop
        </button>
      </div>
      <Dashboard packets={packets} config={config} />
    </div>
  );
}

export default App;
