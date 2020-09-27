/** Test Suites and Cases for Table component
 *
 *  @author Mayur Borse <mayur@hyphenos.io>
 *  @author Abhijit Gadgil <gabhijit@hyphenos.io>
 */
import "fake-indexeddb/auto";
import { dbPromise } from "../utils/indexedDBSetup";
let resolvedDb;
dbPromise.then(db => {
  resolvedDb = db;
}).catch(err => {
  console.error(err);
});
import React from "react";
import Table from "./Table";
import defaultConfig from "../constants/defaultConfig";
import samplePackets5 from "../testdata/sample-packets-5.json";
import { render, screen, findByTestId, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
describe("<Table />", () => {
  beforeAll(() => {
    return dbPromise;
  });
  afterEach(() => {
    return resolvedDb.clear("packets");
  });
  it.only("Renders no rows when no valid packets", async () => {
    const {
      container,
      getByText
    } = render( /*#__PURE__*/React.createElement(Table, {
      getSelectedPacket: _unused => {},
      packets: [],
      config: defaultConfig.tableConfig,
      db: resolvedDb
    }));
    const tbody = await screen.findByTestId("test-tbody");
    expect(tbody.children.length).toEqual(0);
  });
  it.only("Renders 1 row for 1 valid packet", async () => {
    act(() => {
      const {
        rerender
      } = render( /*#__PURE__*/React.createElement(Table, {
        packets: [samplePackets5[0]],
        getSelectedPacket: () => {},
        config: defaultConfig.tableConfig,
        db: resolvedDb
      }));
    });
    const tbody = await screen.findByTestId("test-tbody");
    const trow = await screen.findAllByTestId("packet-rows-1");
    expect(tbody.children).toHaveLength(1);
  });
  /**
   *  Renders n rows for n packets.
   *  Uses setProps() to set new packet and update() to sync enzyme component tree with
   *  react component tree.
   *  FIXME: Mock lastRowRef.current.scrollIntoView action
   */

  it.only("Renders n rows for n valid packets", async () => {
    const {
      rerender
    } = render( /*#__PURE__*/React.createElement(Table, {
      packets: [null],
      getSelectedPacket: () => {},
      config: defaultConfig.tableConfig,
      db: resolvedDb
    }));
    const tbody = await screen.findByTestId("test-tbody");

    for (let i = 0; i < samplePackets5.length; i++) {
      rerender( /*#__PURE__*/React.createElement(Table, {
        packets: [samplePackets5[i]],
        getSelectedPacket: () => {},
        config: defaultConfig.tableConfig,
        db: resolvedDb
      }));
    }

    const trow = await screen.findByTestId("packet-rows-5");
    expect(tbody.children).toHaveLength(samplePackets5.length);
  });
  /**
   *  Test suite for invalid packets related test cases.
   *  Invalid packets are collected and count of total invalid packets is shown on UI
   */

  describe("Invalid Packets", () => {
    it.only("Shows text 'Invalid Packets: 0' for 0 invalid packets", () => {
      testInvalidPackets([]);
    });
    it.only("Shows text 'Invalid Packets: 3' for 3 invalid packets", () => {
      testInvalidPackets([{
        frame: "ws"
      }, {
        frame: 2
      }, {
        frame: {
          "frame.number": "z3"
        }
      }]);
    });
    it.only("Show all invalid packets in table form using modal", () => {});
  });
  describe("Batch of packets", () => {
    it.only("Renders 3 rows for batch of 3 packets (initial)", async () => {
      act(() => {
        const {
          renderer
        } = render( /*#__PURE__*/React.createElement(Table, {
          packets: [samplePackets5[0], samplePackets5[1], samplePackets5[2]],
          getSelectedPacket: () => {},
          config: defaultConfig.tableConfig,
          db: resolvedDb
        }));
      });
      const tbody = await screen.findByTestId("test-tbody");
      const trow = await screen.findAllByTestId("packet-rows-3");
      expect(tbody.children).toHaveLength(3);
    });
    /**
     *  We have 3 batches of packets. Total packerts are 5.
     *  Batch1: 2 packets, Batch2: 1 packet and Batch3: 2 packets
     *  Asserting number of table rows are equal to number of total received packets
     *  after each batch render
     */

    it.only("Renders n rows for batches of packets with total n packets (new Props)", async () => {
      let obj;
      act(() => {
        obj = render( /*#__PURE__*/React.createElement(Table, {
          packets: [samplePackets5[0], samplePackets5[1]],
          getSelectedPacket: () => {},
          config: defaultConfig.tableConfig,
          db: resolvedDb
        }));
      });
      act(() => {
        obj.rerender( /*#__PURE__*/React.createElement(Table, {
          packets: [samplePackets5[2]],
          getSelectedPacket: () => {},
          config: defaultConfig.tableConfig,
          db: resolvedDb
        }));
      });
      act(() => {
        obj.rerender( /*#__PURE__*/React.createElement(Table, {
          packets: [samplePackets5[3], samplePackets5[4]],
          getSelectedPacket: () => {},
          config: defaultConfig.tableConfig,
          db: resolvedDb
        }));
      });
      const tbody = await screen.findByTestId("test-tbody");
      const trow5 = await screen.findAllByTestId("packet-rows-5");
      expect(tbody.children).toHaveLength(5);
    });
  });
});

const testInvalidPackets = async packets => {
  const {
    rerender
  } = render( /*#__PURE__*/React.createElement(Table, {
    packets: packets,
    config: defaultConfig.tableConfig,
    getSelectedPacket: () => {},
    db: resolvedDb
  }));
  const elems = await screen.findAllByText(/Invalid Packets/);
  expect(elems[0]).toHaveTextContent('Invalid Packets: ' + packets.length);
};