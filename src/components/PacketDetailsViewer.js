/**
 * PacketDetailsViewer component
 *
 * @author Mayur Borse <mayur@hyphenos.io>
 */
import React from "react";
import JSONTree from "react-json-tree";

/**
 * Memoized PacketDetailsViewer component.
 * @param {object} selectedPacket - Packet selected in Table component.
 * @param {object} config - config options passed to customize output.
 */
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

export default React.memo(PacketDetailsViewer);
