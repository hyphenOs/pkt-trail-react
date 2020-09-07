import { openDB, deleteDB } from "idb";

export let dbPromise;
export let dbDeletePromise;

let _deleteDB = () => {
  if (!window.indexedDB) {
    console.log("This browser doesn't support indexedDB");
    return;
  }
  console.log("deleting db...");
  dbDeletePromise = deleteDB("pkt-trail-db");
};

let _getNewDB = () => {
  if (!window.indexedDB) {
    console.log("This browser doesn't support indexedDB");
    return;
  }
  console.log("opening db...");
  dbPromise = openDB("pkt-trail-db", 1, {
    upgrade(db) {
      const storePackets = db.createObjectStore("packets", {
        keyPath: "frame.frame_number",
      });
    },
  });
};

_deleteDB();
_getNewDB();
