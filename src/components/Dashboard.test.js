import React, { useState } from "react";
import { render, fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Dashboard from './Dashboard'

describe("PCAPTable related function", () => {
  test("Start button click starts reception", () => {});
  const { getByTestId, getByText } = render(<Dashboard />);
  const buttonStart = getByTestId("button-start");
  const buttonStop = getByTestId("button-stop");

  expect(buttonStart.innerHTML).toBe("Start");
  expect(buttonStop.innerHTML).toBe("Stop");
});
