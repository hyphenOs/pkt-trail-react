/**
 * Top Level `Dashboard` Component.
 *
 * @author Mayur Borse <mayur@hyphenos.io>
 */
import React, { useState, useCallback, useEffect } from "react";
import defaultConfig from "../constants/defaultConfig";
import Table from "./Table";
import PacketDetailsViewer from "./PacketDetailsViewer";
import ErrorBoundary from "./ErrorBoundary";
import { dbPromise } from "../utils/indexedDBSetup";
import Modal from "./Modal";

let resolvedDB;

const Dashboard = ({ packets, config, getPktTrailReadyStatus }) => {
  /**
   * selectedPacket will be rendered by PacketDetailsViewer if not empty
   */
  const [selectedPacket, setSelectedPacket] = useState(null);

  /**
   * Used to render loader on initial mount and render error (if any)
   * occured during initialization process
   */
  const [hasInitialized, setHasInitialized] = useState({
    status: false,
    message: "initializing...",
    error: null,
  });

  useEffect(() => {
    /**
     * DBPromise resolves with 'db' assigned to resolvedDB.
     * "packets" objectstore is cleared and 'hasInitialized' is set true
     */
    dbPromise
      .then((db) => {
        resolvedDB = db;
        resolvedDB
          .clear("packets")
          .then(() => {
            setHasInitialized({ status: true, message: "", error: null });
            getPktTrailReadyStatus(true);
          })
          .catch((error) => {
            setHasInitialized({
              status: true,
              message: "",
              error: String(error),
            });
          });
      })
      .catch((error) => {
        setHasInitialized({
          status: true,
          message: "",
          error: String(error),
        });
      });
  }, [getPktTrailReadyStatus]);

  /**
   * Toggles selected packet between received packet object or empty object {}
   * @param {object} packet - Selected packet object
   * useCallback hook invokes this functions only when packet is selected in Table.
   */
  const getSelectedPacket = useCallback((packet) => {
    setSelectedPacket((selectedPacket) =>
      selectedPacket === packet ? null : packet
    );
  }, []);

  /**
   *  Current config state
   */
  const [currentConfig, setCurrentConfig] = useState(() =>
    config ? mergeConfig(defaultConfig, config) : defaultConfig
  );

  function mergeConfig(oldConfig, newConfig) {
    let mergedConfig = {};
    for (let key in newConfig) {
      mergedConfig[key] = { ...oldConfig[key], ...newConfig[key] };
    }
    return mergedConfig;
  }

  /**
   * Config objects are passed to respective components.
   */
  const { dashboardConfig, tableConfig, detailsConfig } = currentConfig;

  // Rendered until initial setup is completed
  if (!hasInitialized.status)
    return (
      <Modal showModal={!hasInitialized.status}>{hasInitialized.message}</Modal>
    );

  if (hasInitialized.error)
    return (
      <Modal showModal={hasInitialized.error}>{hasInitialized.error}</Modal>
    );

  if (packets === null || packets === undefined) {
    return <h2>No packets provided</h2>;
  }

  return (
    <div className="packet-dashboard">
      <ErrorBoundary>
        {packets && (
          <Table
            getSelectedPacket={getSelectedPacket}
            packets={packets}
            config={tableConfig}
            db={resolvedDB}
          />
        )}

        {dashboardConfig.showSelectedDetails && selectedPacket && (
          <PacketDetailsViewer
            selectedPacket={selectedPacket}
            config={detailsConfig}
          />
        )}
      </ErrorBoundary>
    </div>
  );
};
export default Dashboard;
