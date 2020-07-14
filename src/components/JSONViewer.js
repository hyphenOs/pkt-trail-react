import React from "react";

const JSONViewer = (layers) => {
  console.log(layers);
  return (
    <div>
      <p>JSON VIewer</p>
      <JSONPretty id="json-pretty" data={layers}/>
      <pre>{JSON.stringify(layers, null, 4)}</pre>
    </div>
  );
};

export default JSONViewer;
