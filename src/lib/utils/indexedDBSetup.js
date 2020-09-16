import { openDB } from "idb";

export let dbPromise;

let _getNewDB = () => {
  if (!window.indexedDB) {
    console.log("This browser doesn't support indexedDB");
    return;
  }
  console.log("opening db...");
  dbPromise = openDB("pkt-trail-db", 1, {
    upgrade(db) {
      db.createObjectStore("packets", {
        keyPath: "frame.frame_number",
      });
    },
  });
};

_getNewDB();
