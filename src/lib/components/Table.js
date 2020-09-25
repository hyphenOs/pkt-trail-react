/**
 * Table component for our Packets Dashboard. Renders a sliding window of Packets.
 *
 * @author Mayur Borse <mayur@hyphenos.io>
 * @author Abhijit Gadgil <gabhijit@hyphenos.io>
 *
 */
import React, { useState, useEffect, useRef } from "react";
import "./Table.css";

const Table = ({ getSelectedPacket, packets, config, db: pktTrailDB }) => {
  /**
   * References to the first and last table row
   */
  const firstRowRef = useRef();
  const lastRowRef = useRef();

  const isMounted = useRef(true);
  /**
   * We always render one `window` equivalent of Packets a window is determined
   * by windowStart and windowEnd. PacketsToRender contains retrieved packets from db
   * with frame_number between windowStart and windowEnd
   */
  const [packetsToRender, setPacketsToRender] = useState([]);
  const [windowStart, setWindowStart] = useState(null);
  const [windowEnd, setWindowEnd] = useState(null);

  // Component isMounted check to ignore state update at places.
  useEffect(() => {

    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };

  });

  useEffect(() => {

    const isInvalidKey = (value) =>
      !isFinite(value) || value === null || value === undefined;

    const isInvalidRange = () => windowStart > windowEnd;

    if (
      isInvalidKey(windowStart) ||
      isInvalidKey(windowEnd) ||
      isInvalidRange()
    ) {
      return;
    }

    pktTrailDB
      .getAll("packets", IDBKeyRange.bound(windowStart, windowEnd))
      .then((values) => {
        if (isMounted.current) {
          setPacketsToRender(values);
        }
      });
  }, [pktTrailDB, windowStart, windowEnd]);

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

    if (!isMounted.current) {
      return;
    }

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
  }, [autoscroll, config.packetWindowSize, maxFrameNo, minFrameNo]);

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

    if (!packets)
      return;

    let packetsList = packets;
    if (typeof packets === "string") {
      packetsList = [packets];
    }

    let frameno = -Infinity;

    // Called after validation
    const savePacketsToDB = (validPackets, successCB) => {

      if (validPackets.length == 0) {
        return;
      }

      const tx = pktTrailDB.transaction("packets", "readwrite");

      // Save valid packets only
      const transactions = validPackets.map((validPacket) => {
        try {
          tx.store.add(validPacket)
        } catch(e) {
          console.log(e);
          local.invalidPackets.value.push(validPacket);
        }
      });

      transactions.push(tx.done); // Indicating End of Operation

      Promise.all(transactions)
        .then((res) => {
          successCB();
        })
        .catch((error) => console.log(error));
    };

    const batchRequestStateUpdate = (local) => {

      if (! isMounted.current) {
        return;
      }

      for (let state in local) {
        let obj = local[state];
        if (obj.value !== obj.stateValue) {
          obj["setCall"](obj.value);
        }
      }
    };

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

    const validPackets = [];
    for (let packet of packetsList) {
      if (packet) {
        try {
          packet = typeof packet === "string" ? JSON.parse(packet) : packet;
          const { frame } = packet;
          frameno = frame["frame_number"];
        } catch (e) {
          console.error("Invalid packet");
          local.invalidPackets.value.push(packet);
          /**
           * Feature: Save invalid packets to indexedDB
           */
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
        validPackets.push(packet);
      }
    }

    savePacketsToDB(validPackets, () => {
      batchRequestStateUpdate(local);
    });

    // FIXME: Exhaustive Deps warning by eslint
  }, [packets]);

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
      if (firstRowRef.current) {
        firstRowRef.current.scrollIntoView(true);
      }
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
      if (lastRowRef.current) {
        lastRowRef.current.scrollIntoView(false);
      }
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
    let rendered = [];
    for (let packet of packetsToRender) {
      const { frame, ip } = packet;
      if (Object.keys(packet).length !== 0) {
        const i = frame.frame_number;
        const dataTestId = "packet-rows-" + i;
        rendered.push(
          <tr
            data-testid={dataTestId}
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
            <td>{frame["frame_number"]}</td>
            <td>{frame["frame_time"]}</td>
            <td>{ip ? ip["ip_src"] : "unknown"}</td>
            <td>{ip ? ip["ip_dst"] : "unknown"}</td>
            <td>{frame["frame_protocols"]}</td>
            <td>{frame["frame_len"]}</td>
          </tr>
        );
      }
    }
    return rendered;
  };

  return (
    <>
      <button onClick={() => setAutoscroll((autoscroll) => !autoscroll)}>
        Autoscroll: {autoscroll ? "On" : "Off"}
      </button>
      <div className="invalid-packets-count">
        Invalid Packets: {invalidPackets.length}
      </div>
      <div className="table-container" data-testid="testid-table" onScroll={handleScroll}>
        <table>
          <thead>
            <tr data-testid="test-tr">
              <th>Frame No.</th>
              <th>Time</th>
              <th>Source</th>
              <th>Dest</th>
              <th>Protocol (Port)</th>
              <th>Length</th>
            </tr>
          </thead>
          <tbody data-testid="test-tbody">{renderPackets()}</tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
