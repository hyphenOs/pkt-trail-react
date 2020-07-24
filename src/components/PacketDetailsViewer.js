import React from "react";
import JSONTree from "react-json-tree";

const PacketDetailsViewer = ({ selectedPacket, config }) => {
  return (
    <div>
      <h2>Packet Details</h2>
      <JSONTree
        data={selectedPacket}
        theme="monokai"
        hideRoot={true}
        getItemString={(type, data, itemType, itemString) => <span></span>}
        shouldExpandNode={() => config.expanded}
      />
    </div>
  );
};

export default PacketDetailsViewer;
