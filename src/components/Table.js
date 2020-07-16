import React from "react";
import "./Table.css";

const Table = ({ data, setSelected, selected }) => {
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
        <tbody>
          {data.map((rawJSON, index) => {
            const packet = JSON.parse(rawJSON);
            const {
              frame,
              ip
            } = packet;
            return (
              <tr
                className={selected.index === index ? "selected" : ""}
                key={index}
                onClick={() => setSelected({ selected: true, index })}
              >
                <td>{frame["frame.number"]}</td>
                <td>{frame["frame.time_relative"]}</td>
                <td>{ip ? ip["ip.src"] : "unknonwn"}</td>
                <td>{ip ? ip["ip.dst"] : "unknonwn"}</td>
                <td>{frame["frame.protocols"]}</td>
                <td>{frame["frame.len"]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
