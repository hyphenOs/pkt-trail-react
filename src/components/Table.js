import React, { useState, useEffect } from "react";
import "./Table.css";
import useWindowUnloadEffect from "../utils/useWindowUnloadEffect";

const Table = ({ getSelectedPacket, packet }) => {
  const cleanup = () => {
    console.log("clearing localStorage");
    localStorage.clear();
  };
  useWindowUnloadEffect(cleanup, true);

  const [count, setCount] = useState(0);
  const [_windowStart, setWindowStart] = useState(1);
  const [windowEnd, setWindowEnd] = useState(0);

  useEffect(() => {
    console.log("mounting table");
    localStorage.clear();
    return () => {
      console.log("unmounting table");
      localStorage.clear();
    };
  }, []);

  useEffect(() => {
    setWindowEnd(count);
  }, [count]);

  useEffect(() => {
    if (packet) {
      const newCount = count + 1;
      localStorage.setItem(newCount, packet);
      setCount(newCount);
    }
  }, [packet]);

  const [selectedPacketRow, setSelectedPacketRow] = useState({
    index: null,
    packet: null,
  });

  useEffect(() => {
    getSelectedPacket(selectedPacketRow.packet);
    return () => {};
  }, [selectedPacketRow, getSelectedPacket]);

  const renderPackets = () => {
    console.log("Render", _windowStart, windowEnd);
    let packets = [];
    for (let i = _windowStart; i <= windowEnd; i++) {
      const packet = JSON.parse(localStorage.getItem(i) || "{}");
      const { frame, ip } = packet;
      packets.push(
        <tr
          key={i}
          className={
            selectedPacketRow && selectedPacketRow.index === i ? "selected" : ""
          }
          onClick={() => setSelectedPacketRow({ index: i, packet })}
        >
          <td>{frame["frame.number"]}</td>
          <td>{frame["frame.time"]}</td>
          <td>{ip ? ip["ip.src"] : "unknown"}</td>
          <td>{ip ? ip["ip.dst"] : "unknown"}</td>
          <td>{frame["frame.protocols"]}</td>
          <td>{frame["frame.len"]}</td>
        </tr>
      );
    }
    return packets;
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Frame No.</th>
            <th>Time</th>
            <th>Source</th>
            <th>Dest</th>
            <th>Protocol (Port)</th>
            <th>Length</th>
          </tr>
        </thead>
        <tbody>{renderPackets()}</tbody>
      </table>
    </div>
  );
};

export default Table;
