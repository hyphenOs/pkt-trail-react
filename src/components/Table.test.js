import React from "react";
import { shallow, mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Table from "./Table";
import defaultConfig from "./constants/defaultConfig";
import samplePackets5 from "./testdata/sample-packets-5.json";

configure({ adapter: new Adapter() });

describe("<Table />", () => {
  it("Renders no rows when no valid packets", () => {
    const wrapper = shallow(
      <Table packets={[]} config={defaultConfig.tableConfig} />
    );
    const tbody = wrapper.find("tbody");
    expect(tbody.find("tr").length).toEqual(0);
  });

  it("Renders 1 row for 1 valid packet", () => {
    const wrapper = mount(
      <Table
        packets={[JSON.stringify(samplePackets5[0])]}
        getSelectedPacket={() => {}}
        config={defaultConfig.tableConfig}
      />
    );
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
    const wrapper = mount(
      <Table
        packets={[null]}
        getSelectedPacket={() => {}}
        config={defaultConfig.tableConfig}
      />
    );

    for (let i = 0; i < samplePackets5.length; i++) {
      wrapper.setProps({ packets: JSON.stringify(samplePackets5[i]) });
      wrapper.update();
      const tbody = wrapper.find("tbody");
      const rows = tbody.find("tr");
      expect(rows).toHaveLength(i + 1);
    }
  });

  it("Renders 2 rows for batch of 2 packets (initial)", () => {});

  it("Renders 2 rows for batch of 2 packets (new Props)", () => {});

  /**
   *  Test suite for invalid packets related test cases.
   *  Invalid packets are collected and count of total invalid packets is shown on UI
   */
  describe("Invalid Packets", () => {
    it("Shows text 'Invalid Packets: 0' for 0 invalid packets", () => {
      testInvalidPackets([]);
    });

    it("Shows text 'Invalid Packets: 3' for 3 invalid packets", () => {
      testInvalidPackets([
        { frame: "ws" },
        { frame: 2 },
        { frame: { "frame.number": "z3" } },
      ]);
    });

    it("Show all invalid packets in table form using modal", () => {});
  });
});

const testInvalidPackets = (packets) => {
  const wrapper = mount(
    <Table
      packets={packets}
      config={defaultConfig.tableConfig}
      getSelectedPacket={() => {}}
    />
  );
  const errorText = wrapper.find(".invalid-packets-count").text();
  expect(errorText).toEqual(`Invalid Packets: ${packets.length}`);
};
