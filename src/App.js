import React from "react";
import Dashboard1LocalStoragePacketsArray from "./components/Dashboard1LocalStoragePacketsArray";
import Dashboard2LocalStoragePacketObjects from "./components/Dashboard2LocalStoragePacketObjects";
import Dashboard3StatePacketsArray from "./components/Dashboard3StatePacketsArray";

function App() {
  return (
    <div className="App">
      {/* <Dashboard1LocalStoragePacketsArray /> */}
      {/* <Dashboard2LocalStoragePacketObjects /> */}
      <Dashboard3StatePacketsArray />
    </div>
  );
}

export default App;
