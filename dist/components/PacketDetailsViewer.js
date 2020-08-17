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

const PacketDetailsViewer = ({
  selectedPacket,
  config
}) => {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Packet Details"), /*#__PURE__*/React.createElement(JSONTree, {
    data: selectedPacket,
    theme: "monokai",
    hideRoot: true,
    getItemString: (type, data, itemType, itemString) => /*#__PURE__*/React.createElement("span", null),
    shouldExpandNode: () => config.expanded
  }));
};

export default /*#__PURE__*/React.memo(PacketDetailsViewer);