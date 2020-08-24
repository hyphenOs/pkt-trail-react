/**
 * Top Level `Dashboard` Component.
 *
 * @author Mayur Borse <mayur@hyphenos.io>
 */
import React, { useState, useCallback } from "react";
import defaultConfig from "../constants/defaultConfig";
import Table from "./Table";
import PacketDetailsViewer from "./PacketDetailsViewer";
import ErrorBoundary from "./ErrorBoundary";

const Dashboard = ({
  packets,
  config
}) => {
  /**
   * selectedPacket will be rendered by PacketDetailsViewer if not empty
   */
  const [selectedPacket, setSelectedPacket] = useState(null);
  /**
   * Toggles selected packet between received packet object or empty object {}
   * @param {object} packet - Selected packet object
   * useCallback hook invokes this functions only when packet is selected in Table.
   */

  const getSelectedPacket = useCallback(packet => {
    setSelectedPacket(selectedPacket ? null : packet);
  }, []);
  /**
   *  Current config state
   */

  const [currentConfig, setCurrentConfig] = useState(() => config ? mergeConfig(defaultConfig, config) : defaultConfig);

  function mergeConfig(oldConfig, newConfig) {
    let mergedConfig = {};

    for (let key in newConfig) {
      mergedConfig[key] = { ...oldConfig[key],
        ...newConfig[key]
      };
    }

    return mergedConfig;
  }
  /**
   * Config objects are passed to respective components.
   */


  const {
    dashboardConfig,
    tableConfig,
    detailsConfig
  } = currentConfig;
  if (!packets) return /*#__PURE__*/React.createElement("h2", null, "No packets provided");
  return /*#__PURE__*/React.createElement("div", {
    className: "packet-dashboard"
  }, /*#__PURE__*/React.createElement(ErrorBoundary, null, packets && /*#__PURE__*/React.createElement(Table, {
    getSelectedPacket: getSelectedPacket,
    packets: packets,
    config: tableConfig
  }), dashboardConfig?.showSelectedDetails && selectedPacket && /*#__PURE__*/React.createElement(PacketDetailsViewer, {
    selectedPacket: selectedPacket,
    config: detailsConfig
  })));
};

export default Dashboard;