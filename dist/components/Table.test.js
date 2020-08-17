/** Test Suites and Cases for Table component
 *
 *  @author Mayur Borse <mayur@hyphenos.io>
 */
import React from "react";
import { shallow, mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Table from "./Table";
import defaultConfig from "../constants/defaultConfig";
import samplePackets5 from "../testdata/sample-packets-5.json";
configure({
  adapter: new Adapter()
});
describe("<Table />", () => {
  it("Renders no rows when no valid packets", () => {
    const wrapper = shallow( /*#__PURE__*/React.createElement(Table, {
      packets: [],
      config: defaultConfig.tableConfig
    }));
    const tbody = wrapper.find("tbody");
    expect(tbody.find("tr").length).toEqual(0);
  });
  it("Renders 1 row for 1 valid packet", () => {
    const wrapper = mount( /*#__PURE__*/React.createElement(Table, {
      packets: [JSON.stringify(samplePackets5[0])],
      getSelectedPacket: () => {},
      config: defaultConfig.tableConfig
    }));
    const tbody = wrapper.find("tbody");
    const rows = tbody.find("tr");
    expect(rows).toHaveLength(1);
  });
  /**
   *  Renders n rows for n packets.
   *  Uses setProps() to set new packet and update() to sync enzyme component tree with
   *  react component tree.
   *  FIXME: Mock lastRowRef.current.scrollIntoView action
   */

  it("Renders n rows for n valid packets", () => {
    const wrapper = mount( /*#__PURE__*/React.createElement(Table, {
      packets: [null],
      getSelectedPacket: () => {},
      config: defaultConfig.tableConfig
    }));

    for (let i = 0; i < samplePackets5.length; i++) {
      wrapper.setProps({
        packets: JSON.stringify(samplePackets5[i])
      });
      wrapper.update();
      const tbody = wrapper.find("tbody");
      const rows = tbody.find("tr");
      expect(rows).toHaveLength(i + 1);
    }
  });
  /**
   *  Test suite for invalid packets related test cases.
   *  Invalid packets are collected and count of total invalid packets is shown on UI
   */

  describe("Invalid Packets", () => {
    it("Shows text 'Invalid Packets: 0' for 0 invalid packets", () => {
      testInvalidPackets([]);
    });
    it("Shows text 'Invalid Packets: 3' for 3 invalid packets", () => {
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
    it("Show all invalid packets in table form using modal", () => {});
  });
  describe("Batch of packets", () => {
    it("Renders 3 rows for batch of 3 packets (initial)", () => {
      const wrapper = mount( /*#__PURE__*/React.createElement(Table, {
        packets: [JSON.stringify(samplePackets5[0]), JSON.stringify(samplePackets5[1]), JSON.stringify(samplePackets5[2])],
        getSelectedPacket: () => {},
        config: defaultConfig.tableConfig
      }));
      expect(wrapper.find("tbody").find("tr")).toHaveLength(3);
    });
    /**
     *  We have 3 batches of packets. Total packerts are 5.
     *  Batch1: 2 packets, Batch2: 1 packet and Batch3: 2 packets
     *  Asserting number of table rows are equal to number of total received packets
     *  after each batch render
     */

    it("Renders n rows for batches of packets with total n packets (new Props)", () => {
      const wrapper = mount( /*#__PURE__*/React.createElement(Table, {
        packets: [JSON.stringify(samplePackets5[0]), JSON.stringify(samplePackets5[1])],
        getSelectedPacket: () => {},
        config: defaultConfig.tableConfig
      }));
      expect(wrapper.find("tbody").find("tr")).toHaveLength(2);
      wrapper.setProps({
        packets: [JSON.stringify(samplePackets5[2])]
      });
      wrapper.update();
      expect(wrapper.find("tbody").find("tr")).toHaveLength(3);
      wrapper.setProps({
        packets: [JSON.stringify(samplePackets5[3]), JSON.stringify(samplePackets5[4])]
      });
      wrapper.update();
      expect(wrapper.find("tbody").find("tr")).toHaveLength(5);
    });
  });
});

const testInvalidPackets = packets => {
  const wrapper = mount( /*#__PURE__*/React.createElement(Table, {
    packets: packets,
    config: defaultConfig.tableConfig,
    getSelectedPacket: () => {}
  }));
  const errorText = wrapper.find(".invalid-packets-count").text();
  expect(errorText).toEqual(`Invalid Packets: ${packets.length}`);
};