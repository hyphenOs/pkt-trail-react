/** Test Suites and Cases for ErrorBoundary component
 *
 *  @author Mayur Borse <mayur@hyphenos.io>
 */

import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ErrorBoundary from "./ErrorBoundary";
import ErrorFallback from "./ErrorFallback";

configure({ adapter: new Adapter() });

/**
 *  Test cases for ErrorBoundary component. Using Dummy child component
 *  On error occurance, it renders ErrorFallback component otherwise it
 *  renders child component
 */
describe("Error Boundary", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <ErrorBoundary>
        <DummyChildComponent />
      </ErrorBoundary>
    );
  });

  it("renders child component if no error occured", () => {
    expect(wrapper.state("hasError")).toBe(false);
    expect(wrapper.contains(<DummyChildComponent />)).toBe(true);
    expect(wrapper.contains(<ErrorFallback />)).toBe(false);
  });

  it("renders ErrorFallback component on error", () => {
    // Throwing error in DummyChildComponent
    // using enzyme's simulateError function
    const error = new Error("Error in child component");
    wrapper.find("DummyChildComponent").simulateError(error);

    expect(wrapper.state("hasError")).toBe(true);
    expect(wrapper.contains(<DummyChildComponent />)).toBe(false);
    expect(wrapper.contains(<ErrorFallback />)).toBe(true);
  });
});

const DummyChildComponent = () => {
  /** Placeholder component */
  return "Something content";
};
