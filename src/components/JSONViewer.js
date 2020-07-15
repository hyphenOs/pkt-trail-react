import React from "react";
import JSONTree from "react-json-tree";

const JSONViewer = (layers) => {
  console.log(layers);
  return (
    <div>
      <h2>JSON VIewer</h2>
      <JSONTree
        data={layers}
        theme="monokai"
        hideRoot={true}
        getItemString={(type, data, itemType, itemString) => <span></span>}
        shouldExpandNode={(keyPath, data, level) => (level <= 1 ? true : false)}
      />
    </div>
  );
};

export default JSONViewer;
