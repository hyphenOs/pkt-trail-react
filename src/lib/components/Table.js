/**
 * Table component for our Packets Dashboard. Renders a sliding window of Packets.
 *
 * @author Mayur Borse <mayur@hyphenos.io>
 * @author Abhijit Gadgil <gabhijit@hyphenos.io>
 *
 */
import React, { useState, useEffect, useRef } from "react";
import "./Table.css";
import useWindowUnloadEffect from "../utils/useWindowUnloadEffect";

const Table = ({ getSelectedPacket, packets, config }) => {
  /**
   * Following is equivalent of `componentDidMount` and `componentWillUnmount`
   */
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  /**
   * private function clears `localStorage`
   */
  const cleanup = () => {
    console.log("clearing localStorage");
    console.log(new Error().stack);
    localStorage.clear();
  };

  /**
   * cleanup everything on `windowUnload`
   */
  useWindowUnloadEffect(cleanup, true);

  /**
   * References to the first and last table row
   */
  const firstRowRef = useRef();
  const lastRowRef = useRef();

  /**
   * We always render one `window` equivalent of Packets a window is determined
   * by windowStart and windowEnd
   */
  const [windowStart, setWindowStart] = useState(null);
  const [windowEnd, setWindowEnd] = useState(null);

  /**
   * Autoscroll state used to show autoscroll status and toggle it on or off.
   * If 'on' autoscroll will update the window and scroll to last table row on new data reception.
   * autoscroll will be turned 'off' if scrolled upwards.
   */
  const [autoscroll, setAutoscroll] = useState(config.autoscroll);

  /**
   * scrollTop state of table-container div used for detecting scrolling direction.
   */
  const [prevScrollTop, setPrevScrollTop] = useState(0);

  /**
   * min/max frame Numbers required when scrolling
   */
  const [minFrameNo, setMinFrameNo] = useState(Infinity);
  const [maxFrameNo, setMaxFrameNo] = useState(-Infinity);

  /**
   * If autoscroll is 'on', update window and scroll last row into view on new packets reception
   */
  useEffect(() => {
    if (autoscroll) {
      setWindowEnd(maxFrameNo);
      setWindowStart(
        Math.max(minFrameNo, maxFrameNo - config.packetWindowSize)
      );
      if (lastRowRef.current) {
        // FIXME: Mock this action in test case
        if (lastRowRef.current.scrollIntoView) {
          lastRowRef.current.scrollIntoView(false);
        }
      }
    }
  }, [maxFrameNo]);

  /**
   * sending back our selected row to DetailView via Parent
   */
  const [selectedPacketRow, setSelectedPacketRow] = useState({
    index: null,
    packet: null,
  });

  /**
   *  Collection of invalid packets. Total count is shown on UI.
   */
  const [invalidPackets, setinvalidPackets] = useState([]);

  /**
   * Called on receiving `packets`. Like `componentWillReceiveProps`
   *
   * TODO : Sometimes we may want to avoid reRender (`shouldComponentUpdate`)
   */
  useEffect(() => {
    if (!packets) return;
    let packetsList = packets;
    if (typeof packets === "string") {
      packetsList = [packets];
    }

    let frameno = -Infinity;

    /**
     *  Used to batch update state values for each batch of packets.
     *  Keys (object) are named after the state they update.
     *  In each object,
     *  value and stateValue refer to value of state with same name as key
     *  setCall refers to setState function of respective state
     *  stateValue is used to refer to respective state value
     *  value gets updated for each valid packet and set to respective state using setCall
     *  setCall is invoked with value only if value(updated local value) !== stateValue(curret state value)
     */
    let local = {
      invalidPackets: {
        value: invalidPackets,
        setCall: setinvalidPackets,
        stateValue: invalidPackets,
      },
      minFrameNo: {
        value: minFrameNo,
        setCall: setMinFrameNo,
        stateValue: minFrameNo,
      },
      maxFrameNo: {
        value: maxFrameNo,
        setCall: setMaxFrameNo,
        stateValue: maxFrameNo,
      },
      windowStart: {
        value: windowStart,
        setCall: setWindowStart,
        stateValue: windowStart,
      },
      windowEnd: {
        value: windowEnd,
        setCall: setWindowEnd,
        stateValue: windowEnd,
      },
    };

    for (let packet of packetsList) {
      if (packet) {
        try {
          const { frame } = JSON.parse(packet);
          frameno = parseInt(frame["frame.number"]);
        } catch (e) {
          console.error("Invalid packet");
          local.invalidPackets.value.push(packet);
          continue;
        }
        if (frameno < local.minFrameNo.value) {
          local.minFrameNo.value = frameno;
        }
        if (frameno > local.maxFrameNo.value) {
          local.maxFrameNo.value = frameno;
        }
        if (!local.windowStart.value) {
          local.windowStart.value = frameno;
          local.windowEnd.value = frameno + config.packetWindowSize;
        }
        // FIXME: Use IndexDB
        localStorage.setItem(frameno, packet);
      }
    }
    batchRequestStateUpdate(local);
  }, [packets]);

  const batchRequestStateUpdate = (local) => {
    for (let state in local) {
      let obj = local[state];
      if (obj.value !== obj.stateValue) {
        obj["setCall"](obj.value);
      }
    }
  };

  /**
   * Pass selected packet object back to parent component via inverse data flow.
   */
  useEffect(() => {
    getSelectedPacket(selectedPacketRow.packet);
  }, [selectedPacketRow, getSelectedPacket]);

  /**
   * We use scrolling to update the `window` to Render.
   * When you reach the 'end' -> jump by `config.jumpSize` (kindoff)
   * When you reach the 'beginning' -> jump minus by `config.jumpSize`
   */
  const handleScroll = (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    const isScrollBegin = scrollTop === 0;
    const isScrollEnd = Math.round(scrollHeight - scrollTop) === clientHeight;

    /**
     * Detect scroll direction by comparing current scrollTop with prevScrollTop.
     * Turn autoscroll 'off' if scrolling upward (scrollTop < prevScrollTop)
     */
    if (scrollTop < prevScrollTop) {
      if (prevScrollTop - scrollTop > 5) {
        setAutoscroll(false);
      }
    }
    setPrevScrollTop(scrollTop);

    if (isScrollBegin) {
      let start = windowStart - config.jumpSize;
      let end = windowEnd - config.jumpSize;
      if (start < minFrameNo) {
        console.debug("Scroll begin");
        setWindowStart(minFrameNo);
        setWindowEnd(
          Math.min(maxFrameNo, minFrameNo + config.packetWindowSize)
        );
      } else {
        setWindowStart(start);
        setWindowEnd(end);
      }
      firstRowRef.current.scrollIntoView(true);
    }
    if (isScrollEnd) {
      let start = windowStart + config.jumpSize;
      let end = windowEnd + config.jumpSize;
      console.debug("Scroll end");
      if (end > maxFrameNo) {
        setWindowEnd(maxFrameNo);
        setWindowStart(
          Math.max(minFrameNo, maxFrameNo - config.packetWindowSize)
        );
      } else {
        setWindowStart(start);
        setWindowEnd(end);
      }
      lastRowRef.current.scrollIntoView(false);
    }
  };

  /**
   * Handles two cases on table row click
   * 1. Toggle selected row on second click
   * 2. Set clicked row as new selectedPacketRow
   * @param {number} index - index of selected row
   * @param {object} packet - packet data of selected row
   */
  const handleRowClick = (index, packet) => {
    selectedPacketRow.index === index
      ? setSelectedPacketRow({ index: null, packet: null })
      : setSelectedPacketRow({ index, packet });
  };

  /**
   * called by the `render` below. This is constant time now.
   * worst case `windowSize` equivalent of packets are rendered.
   */
  const renderPackets = () => {
    let packets = [];
    for (let i = windowStart; i <= windowEnd; i++) {
      const packet = JSON.parse(localStorage.getItem(i) || "{}");
      const { frame, ip } = packet;
      if (Object.keys(packet).length !== 0) {
        packets.push(
          <tr
            key={i}
            ref={
              i === windowEnd
                ? lastRowRef
                : i === windowStart
                ? firstRowRef
                : null
            }
            className={
              selectedPacketRow && selectedPacketRow.index === i
                ? "selected"
                : ""
            }
            onClick={() => handleRowClick(i, packet)}
          >
            <td>{frame["frame.number"]}</td>
            <td>{frame["frame.time"]}</td>
            <td>{ip ? ip["ip.src"] : "unknown"}</td>
            <td>{ip ? ip["ip.dst"] : "unknown"}</td>
            <td>{frame["frame.protocols"]}</td>
            <td>{frame["frame.len"]}</td>
          </tr>
        );
      }
    }
    return packets;
  };

  return (
    <>
      <button onClick={() => setAutoscroll((autoscroll) => !autoscroll)}>
        Autoscroll: {autoscroll ? "On" : "Off"}
      </button>
      <div className="invalid-packets-count">
        Invalid Packets: {invalidPackets.length}
      </div>
      <div className="table-container" onScroll={handleScroll}>
        <table>
          <thead>
            <tr>
              <th>Frame No.</th>
              <th>Time</th>
              <th>Source</th>
              <th>Dest</th>
              <th>Protocol (Port)</th>
              <th>Length</th>
            </tr>
          </thead>
          <tbody>{renderPackets()}</tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
