import React from "react";
import "./Table.css";

const Table = ({ setSelected, selected, count }) => {
  let min = 1;
  let max = count;

  const renderPackets = (min, max, ) => {
    let packets = []
    for (let i = min; i <= max; i++) {
      const packet = JSON.parse(localStorage.getItem(i) || "{}");
      const { frame, ip } = packet;
      packets.push(
        <tr
          // className={selected.selected && selected.index === index ? "selected" : ""}
          // key={index}
          // onClick={() => setSelected({ selected: true, index })}
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
    return packets
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
        <tbody>{renderPackets(min, max)}</tbody>
      </table>
    </div>
  );
};

export default Table;
