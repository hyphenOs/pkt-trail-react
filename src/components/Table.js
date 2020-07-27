import React, { useState, useEffect } from "react";
import "./Table.css";
import useWindowUnloadEffect from "./utils/useWindowUnloadEffect";

const Table = ({ getSelectedPacket, packets }) => {
  const cleanup = () => {
    console.log("clearing localStorage");
    console.log(new Error().stack);
    localStorage.clear();
  };

  useWindowUnloadEffect(cleanup, true);

  const [windowStart] = useState(1);
  const [windowEnd, setWindowEnd] = useState(0);
  const [selectedPacketRow, setSelectedPacketRow] = useState({
    index: null,
    packet: null,
  });

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (!packets) return;
    let packetsList = packets;
    if (typeof packets === "string") {
      packetsList = [packets];
    }

    for (let packet of packetsList) {
      if (packet) {
        const { frame } = JSON.parse(packet);
        const frameno = frame["frame.number"];
        setWindowEnd(frameno);
        localStorage.setItem(frameno, packet);
      }
    }
  }, [packets]);

  useEffect(() => {
    getSelectedPacket(selectedPacketRow.packet);
    return () => {};
  }, [selectedPacketRow, getSelectedPacket]);

  const renderPackets = () => {
    let packets = [];
    for (let i = windowStart; i <= windowEnd; i++) {
      const packet = JSON.parse(localStorage.getItem(i) || "{}");
      const { frame, ip } = packet;
      if (Object.keys(packet).length !== 0) {
        packets.push(
        <tr
          key={i}
          className={
            selectedPacketRow && selectedPacketRow.index === i ? "selected" : ""
          }
          onClick={() =>
            packet !== {} ? setSelectedPacketRow({ index: i, packet }) : null
          }
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
