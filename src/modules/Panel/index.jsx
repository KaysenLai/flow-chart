import React from "react";
import "./index.scss";
import Graph from "../Graph/Graph";
class Panel extends React.Component{
  render() {
    return (
      <div className="app">
        <Graph />
      </div>
    );
  }
};

export default Panel;
