import React, { useState } from "react";

const WebSocket_API = "ws://localhost:3030";
const socketClient = new WebSocket(WebSocket_API);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

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
      <h2>Dashboard</h2>
      <button
        data-testid="button-start"
        disabled={message === "start"}
        onClick={() => stream("start")}
      >
        Start
      </button>
      <br />
      <br />
      <button
        data-testid="button-stop"
        disabled={message === "stop"}
        onClick={() => stream("stop")}
      >
        Stop
      </button>
      <div data-testid="data-list">
        {data.map((elem, i) => (
          <p key={elem + i}>{elem}</p>
        ))}
      </div>
    </div>
  );
};
export default Dashboard;
