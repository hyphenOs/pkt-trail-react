/** Test Suites and Cases for App component
 *
 *  @author Mayur Borse <mayur@hyphenos.io>
 */

import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders App component with header 'Packet Viewer'", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Packet Viewer/i);
  expect(linkElement).toBeInTheDocument();
});
