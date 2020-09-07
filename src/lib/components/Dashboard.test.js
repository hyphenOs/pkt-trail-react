/** Test Suites and Cases for Dashboard component
 *
 *  @author Mayur Borse <mayur@hyphenos.io>
 */

import "fake-indexeddb/auto";
import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Dashboard from "./Dashboard";
import defaultConfig from "../constants/defaultConfig";

configure({ adapter: new Adapter() });

/**
 *  Test Suite with cases for ensuring passed props are valid and doesn't crash the application
 */
describe("<Dashboard packets={packets} config={config}/>", () => {
  /**
   *  Dashboard component should have a default config which is used if no config provided
   */
  it("Does not mount Table component if packets and config are undefined", () => {
    const wrapper = shallow(<Dashboard />); // Equivalent to <Dashboard packets={undefined} config={undefined} />
    expect(wrapper.exists("Table")).toEqual(false);
  });

  it("Mounts Table component if packets and config are defined", () => {
    const wrapper = shallow(
      <Dashboard packets={[null]} config={defaultConfig} />
    );
    expect(wrapper.exists("Table")).toEqual(true);
  });

  it("Mounts Table component if packets are defined and config is undefined", () => {
    const wrapper = shallow(<Dashboard packets={[null]} />);
    expect(wrapper.exists("Table")).toEqual(true);
  });

  /**
   * Ensure table config receives defaultConfig (of table) if no config is provided
   */
  it("Uses defaultConfig when no config is provided", () => {
    const wrapper = shallow(<Dashboard packets={[]} />);
    expect(wrapper.find("Table").props().config).toEqual(
      defaultConfig.tableConfig
    );
  });

  /**
   *  If user passes only one option of config only it should be changed and all other options should remain intact
   */
  it("Merges passed config with defaultConfig on initial render", () => {
    const config = { tableConfig: { jumpSize: 3 } };
    const wrapper = shallow(<Dashboard packets={[]} config={config} />);

    const Table = wrapper.find("Table");
    expect(Table.props().config).toEqual({
      ...defaultConfig.tableConfig,
      ...config.tableConfig,
    });
  });
});
