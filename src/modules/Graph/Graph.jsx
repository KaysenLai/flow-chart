import { Graph, Node, Edge, Shape } from "@antv/x6";
import React from "react";
import { main } from "../Layout/Layout";
// 定义节点
class RectNode extends Shape.Rect {
  constructor(props) {
    super(props);
  }
  get x() {
    return this.getPosition().x;
  }
  get y() {
    return this.getPosition().y;
  }
  set x(x) {
    this.setPosition(x);
  }
  set y(y) {
    this.setPosition(undefined, y);
  }
  get width() {
    return this.getSize().width;
  }
  get height() {
    return this.getSize().height;
  }
  set width(width) {
    this.setSize(width);
  }
  set height(height) {
    this.setSize(undefined, height);
  }
  translateCenter = (x, maxWidth) => {};
}

RectNode.config({
  width: 100,
  height: 50,
  x: 0,
  y: 0,
  attrs: {
    body: {
      fill: "white",
      stroke: "#000",
    },
    label: {
      text: "Hello",
      fill: "#333",
      fontSize: 13,
    },
  },
});

// 注册
Node.registry.register("rect-node", RectNode, true);

export default class Example extends React.Component {
  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    });

    main(graph);
  }

  refContainer = (container) => {
    this.container = container;
  };

  render() {
    return <div className="app-content" ref={this.refContainer} />;
  }
}

