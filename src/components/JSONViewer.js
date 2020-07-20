import React from "react";
import JSONTree from "react-json-tree";

const JSONViewer = ({ selectedData }) => {
  return (
    <div>
      <h2>JSON VIewer</h2>
      <JSONTree
        data={selectedData}
        theme="monokai"
        hideRoot={true}
        getItemString={(type, data, itemType, itemString) => <span></span>}
      />
    </div>
  );
};

export default JSONViewer;
