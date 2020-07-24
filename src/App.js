import React, { useState } from "react";
import "./App.css";
import defaultConfig from "./constants/config";
import Dashboard from "./components/Dashboard";
import config from "./constants/config";
import Settings from "./components/Settings";

const WebSocket_API = "ws://localhost:3030";
const socketClient = new WebSocket(WebSocket_API);

function App() {
  const [streamMessage, setStreamMessage] = useState("");
  const [packets, setPackets] = useState(null);
  const [config, setConfig] = useState(defaultConfig);
  const [openSettings, setOpenSettings] = useState(false);

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

  const openFormSettings = () => {
    setOpenSettings((openSettings) => !openSettings);
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
        <button className="app-button" onClick={openFormSettings}>
          Settings
        </button>
      </div>
      {openSettings && (
        <Settings
          setOpenSettings={setOpenSettings}
          setConfigProps={setConfig}
          configProps={config}
        />
      )}
      <Dashboard packets={packets} config={config} />
    </div>
  );
}

export default App;
