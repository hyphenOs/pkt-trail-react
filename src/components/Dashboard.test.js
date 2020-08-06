/**
 * Test cases for ensuring passed props are valid and doesn't crash the application
 */
describe("<Dashboard packets={packets} config={config}/>", () => {
  it("Does not mount Table component if packets and config are undefined", () => {});
  it("Mounts Table component if packets and config are defined", () => {});
  it("Mounts Table component if packets are defined and config is undefined", () => {});
});
