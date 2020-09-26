/** Test Suites and Cases for Dashboard component
 *
 *  @author Mayur Borse <mayur@hyphenos.io>
 *  @author Abhijit Gadgil <gabhijit@hyphenos.io>
 */

import "fake-indexeddb/auto";
import React from "react";

import Dashboard from "./Dashboard";
import defaultConfig from "../constants/defaultConfig";

import { render, screen, findByTestId, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

/**
 *  Test Suite with cases for ensuring passed props are valid and doesn't crash the application
 */
describe("<Dashboard packets={packets} config={config}/>", () => {
  /**
   *  Dashboard component should have a default config which is used if no config provided
   */
  it("Does not mount Table component if packets and config are undefined", async () => {
    const { rerender } = render(<Dashboard />); // Equivalent to <Dashboard packets={undefined} config={undefined} />

    const tables = await screen.queryAllByTestId("testid-table");

    expect(tables).toHaveLength(0);
  });

  it("Mounts Table component if packets and config are defined", async () => {
    const { rerender } = render(
      <Dashboard packets={[null]} config={defaultConfig} />
    );

    const tables = await screen.findAllByTestId("testid-table");

    expect(tables).toHaveLength(1);

  });

  it("Mounts Table component if packets are defined and config is undefined", async () => {
    const { rerender } = render(
      <Dashboard packets={[null]} />
    );

    const tables = await screen.findAllByTestId("testid-table");

    expect(tables).toHaveLength(1);

  });

  /**
   * Ensure table config receives defaultConfig (of table) if no config is provided
   */
  it.skip("Uses defaultConfig when no config is provided", () => {
    const wrapper = shallow(<Dashboard packets={[]} />);
    expect(wrapper.find("Table").props().config).toEqual(
      defaultConfig.tableConfig
    );
  });

  /**
   *  If user passes only one option of config only it should be changed and all other options should remain intact
   */
  it.skip("Merges passed config with defaultConfig on initial render", () => {
    const config = { tableConfig: { jumpSize: 3 } };
    const wrapper = shallow(<Dashboard packets={[]} config={config} />);

    const Table = wrapper.find("Table");
    expect(Table.props().config).toEqual({
      ...defaultConfig.tableConfig,
      ...config.tableConfig,
    });
  });
});
