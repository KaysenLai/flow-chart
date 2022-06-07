import { Graph, Node, Edge, Shape } from "@antv/x6";
import { merge } from "lodash";

import { get } from "lodash";
class ShapeBase extends Shape.Rect {
  constructor(graph, props) {
    const defaultRect = {
      width: 100,
      height: 50,
      x: 0,
      y: 0,
      attrs: {
        body: {
          fill: "none",
          stroke: "#000",
        },
        label: {
          fill: "#333",
          fontSize: 13,
        },
      },
    };
    // const obj = merge(props, defaultRect);
    const obj = merge(defaultRect, props);
    // console.log(props, obj);
    super(obj);
    this.graph = graph;
    // console.log(props)props;

    const branches = get(props, "Branches");
    console.log(branches);
    if (branches) {
      const nodes = branches.map((col) => new Layout(this.graph, col));
      this.setChildren(nodes);
      // this.setAttrByPath("body/fill", "green");
      const size = this.arrange(nodes);
      this.setSize(size.maxWidth, size.maxHeight);
    }
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

  arrange = (nodes) => {
    const heightArr = nodes.map((item) => item.height);
    const maxHeight = Math.max(...heightArr);
    let maxWidth = 0;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.translate(maxWidth);
      maxWidth += node.width;
      if (i !== nodes.length - 1) {
        maxWidth += GAP;
      }
    }
    // nodes.forEach((node) => {
    //   const offsetY = (maxWidth2 - node.height2) / 2;
    //   node.translate(offsetX);
    // });
    return { maxWidth, maxHeight };
  };
}

// 注册
Node.registry.register("rect-node", ShapeBase, true);

const GAP = 20;

class Layout extends ShapeBase {
  constructor(graph, props) {
    super(graph, props);
    this.graph = graph;
    // this.setAttrByPath("body/fill", "red");
    const { StartAt, States, Branches } = props;
    this.addToGraph(StartAt, States);

    const size = arrangeCol(this.getChildren());
    this.setSize(size.maxWidth, size.maxHeight);
  }
  addToGraph = (startAt, states) => {
    const nodeStates = [];
    let node = states[startAt];
    let prev = startAt;
    while (true) {
      nodeStates.push({ name: prev, ...node });
      if (node.End) {
        break;
      }
      node = states[node.Next];
      prev = node.Next;
    }
    this.graph.addNode(this);
    nodeStates.forEach((item) => {
      const shape = new ShapeBase(this.graph, item);
      this.graph.addNode(shape);
      this.addChild(shape);
    });
  };
}
const arrangeCol = (nodes) => {
  const widthArr = nodes.map((item) => item.width);
  const maxWidth = Math.max(...widthArr);
  let maxHeight = 0;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.translate(undefined, maxHeight);
    maxHeight += node.height;
    if (i !== nodes.length - 1) {
      maxHeight += GAP;
    }
  }
  nodes.forEach((node) => {
    const offsetX = (maxWidth - node.width) / 2;
    node.translate(offsetX);
  });
  return { maxWidth, maxHeight };
};
const aws = {
  StartAt: "Lambda Invoke",
  States: {
    "Lambda Invoke": {
      Type: "Task",
      Next: "Lambda Invoke (1)",
    },
    "Lambda Invoke (1)": {
      Type: "Task",
      width: 200,
      height: 100,
      Next: "Lambda Invoke (2)",
    },
    "Lambda Invoke (2)": {
      End: true,
    },
  },
};
const aws2 = {
  StartAt: "Parallel",
  States: {
    Parallel: {
      Type: "Parallel",
      Branches: [
        {
          StartAt: "Lambda Invoke (1)",
          States: {
            "Lambda Invoke (1)": {
              Type: "Task",
              Next: "Pass",
            },
            Pass: {
              Type: "Pass",
              End: true,
            },
          },
        },
        {
          StartAt: "Lambda Invoke (2)",
          States: {
            "Lambda Invoke (2)": {
              Type: "Task",
              Next: "Pass (1)",
            },
            "Pass (1)": {
              Type: "Pass",
              width: 20,
              height: 100,
              Next: "Pass (2)",
            },
            "Pass (2)": {
              Type: "Pass",
              End: true,
            },
          },
        },
      ],
      End: true,
    },
  },
};
function main(graph) {
  const warp = new Layout(graph, aws2);

  graph.addNode(warp);
}
export { main };