import React, { useState, useEffect } from "react";
import "./Table.css";
import useWindowUnloadEffect from "./utils/useWindowUnloadEffect";

const Table = ({ getSelectedPacket, packets, config }) => {
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    console.log("clearing localStorage");
    console.log(new Error().stack);
    localStorage.clear();
  };

  useWindowUnloadEffect(cleanup, true);

  const [windowStart, setWindowStart] = useState(null);
  const [windowEnd, setWindowEnd] = useState(null);

  const [minFrameNo, setMinFrameNo] = useState(Infinity);
  const [maxFrameNo, setMaxFrameNo] = useState(-Infinity);

  const [selectedPacketRow, setSelectedPacketRow] = useState({
    index: null,
    packet: null,
  });

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
        if (frameno < minFrameNo) {
          setMinFrameNo(frameno);
        }
        if (frameno > maxFrameNo) {
          setMaxFrameNo(frameno);
        }
        if (!windowStart) {
          setWindowStart(frameno);
          setWindowEnd(frameno + config.packetWindowSize);
        }
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
              selectedPacketRow && selectedPacketRow.index === i
                ? "selected"
                : ""
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

  const handleScroll = (e) => {
    const {
      scrollHeight,
      scrollTop,
      clientHeight,
      scroll,
      scrollTo,
      scrollBy,
      scrollIntoView,
    } = e.target;
    const isScrollBegin = scrollTop === 0;
    const isScrollEnd = Math.round(scrollHeight - scrollTop) === clientHeight;

    if (isScrollBegin) {
      let start = windowStart - config.jumpSize;
      let end = windowEnd - config.jumpSize;
      if (start < minFrameNo) {
        console.log("Scroll begin");
        setWindowStart(minFrameNo);
        setWindowEnd(
          Math.min(maxFrameNo, minFrameNo + config.packetWindowSize)
        );
      } else {
        setWindowStart(start);
        setWindowEnd(end);
      }
    }
    if (isScrollEnd) {
      let start = windowStart + config.jumpSize;
      let end = windowEnd + config.jumpSize;
      console.log("Scroll end");
      if (end > maxFrameNo) {
        setWindowEnd(maxFrameNo);
        setWindowStart(
          Math.max(minFrameNo, maxFrameNo - config.packetWindowSize)
        );
      } else {
        setWindowStart(start);
        setWindowEnd(end);
      }
    }
  };

  return (
    <div className="table-container" onScroll={handleScroll}>
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
