import { Graph, Node, Edge, Shape } from '@antv/x6';
import { merge } from 'lodash';

import { get } from 'lodash';
import { basicRectAttrs } from '../Node/attrs';

class ShapeBase extends Shape.Rect {
  constructor(graph, props) {
    super(props);
    this.graph = graph;

    const branches = get(props, 'Branches');
    if (branches) {
      this.setAttrByPath('body/stroke', 'gray');
      this.setAttrByPath('body/strokeDasharray', '8,4');
      const nodes = branches.map((col) => new Layout(this.graph, col));
      this.setChildren(nodes);
      this.setAttrByPath('body/fill', 'none');
      this.arrange(nodes);
    }
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
    const PADDING = 20;
    const children = nodes;
    const heightArr = children.map((item) => item.height);
    const maxHeight = Math.max(...heightArr);
    let maxWidth = 0;
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      node.translate(maxWidth, undefined);
      maxWidth += node.width;
      if (i !== children.length - 1) {
        maxWidth += GAP;
      }
    }
    children.forEach((node) => {
      node.translate(PADDING, PADDING);
    });
    this.setSize(maxWidth + 2 * PADDING, maxHeight + 2 * PADDING);
  };
}

// 注册
Node.registry.register('rect-node', ShapeBase, true);

const GAP = 30;

const GAP_HEIGHT = 100;
const SIZE_OFFSET = 40;
class RectNode extends ShapeBase {
  constructor(graph, props) {
    const DEFAULT = {
      width: 200,
      height: 50,
    };
    const mergedOpt = merge(DEFAULT, props);
    const { width, height } = mergedOpt;
    const attrs = basicRectAttrs(mergedOpt);
    super(graph, { width, height, ...attrs });
  }
}
class Layout extends ShapeBase {
  constructor(graph, props) {
    super(graph, props);
    this.graph = graph;
    const { StartAt, States } = props;
    this.setAttrByPath('body/stroke', 'none');

    // this.setAttrByPath('body/stroke', 'gray')
    // this.setAttrByPath('body/strokeDasharray', '8,4')
    this.addToGraph(StartAt, States);
    this.arrangeCol();
  }
  arrangeCol = () => {
    const PADDING = 20;
    const children = this.getChildren();
    const widthArr = children.map((item) => item.width);
    const maxWidth = Math.max(...widthArr);
    let maxHeight = 0;
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      node.translate(undefined, maxHeight);
      maxHeight += node.height;
      if (i !== children.length - 1) {
        maxHeight += GAP_HEIGHT;
      }
    }
    children.forEach((node) => {
      const offsetX = (maxWidth - node.width) / 2;
      node.translate(offsetX + PADDING, PADDING);
    });
    const size = { width: maxWidth + 2 * PADDING, height: maxHeight + 2 * PADDING };
    this.setSize(size.width, size.height);
    // 添加连线
    for (let i = 0; i < children.length - 1; i++) {
      this.graph.addEdge({ source: children[i], target: children[i + 1] });
    }
  };
  addToGraph = (startAt, states) => {
    const nodeStates = [];
    let node = states[startAt];
    let prev = startAt;

    for (let i = 0; i < 999; i++) {
      nodeStates.push({ name: prev, ...node });
      if (node.End) {
        break;
      }
      prev = node.Next;
      node = states[node.Next];
    }
    this.graph.addNode(this);
    nodeStates.forEach((item) => {
      if (item.Type === 'Task' || item.Type === 'Pass') {
        const shape = new RectNode(this.graph, item);
        this.graph.addNode(shape);
        this.addChild(shape);
      }

      if (item.Type === 'Parallel') {
        const shape = new ShapeBase(this.graph, item);
        this.graph.addNode(shape);
        this.addChild(shape);
      }
    });
  };
}

const aws = {
  StartAt: 'Lambda Invoke',
  States: {
    'Lambda Invoke': {
      Type: 'Task',
      Next: 'Lambda Invoke (1)',
    },
    'Lambda Invoke (1)': {
      Type: 'Task',
      Next: 'Lambda Invoke (2)',
    },
    'Lambda Invoke (2)': {
      End: true,
    },
  },
};
const aws2 = {
  StartAt: 'Parallel',
  States: {
    Parallel: {
      Type: 'Parallel',
      Branches: [
        {
          StartAt: 'Lambda Invoke (1)',
          States: {
            'Lambda Invoke (1)': {
              Type: 'Task',
              Next: 'Pass',
            },
            Pass: {
              Type: 'Pass',
              End: true,
            },
          },
        },
        {
          StartAt: 'Lambda Invoke (2)',
          States: {
            'Lambda Invoke (2)': {
              Type: 'Task',
              Next: 'Pass (1)',
            },
            'Pass (1)': {
              Type: 'Pass',
              Next: 'Parallel2',
            },
            Parallel2: {
              Type: 'Parallel',
              Branches: [
                {
                  StartAt: 'Lambda Invoke (1)',
                  States: {
                    'Lambda Invoke (1)': {
                      Type: 'Task',
                      Next: 'Pass',
                    },
                    Pass: {
                      width: 300,
                      Type: 'Pass',
                      End: true,
                    },
                  },
                },
                {
                  StartAt: 'Lambda Invoke (2)',
                  States: {
                    'Lambda Invoke (2)': {
                      Type: 'Task',
                      Next: 'Pass (1)',
                    },
                    'Pass (1)': {
                      Type: 'Pass',
                      Next: 'Pass (2)',
                    },
                    'Pass (2)': {
                      Type: 'Pass',
                      End: true,
                    },
                  },
                },
              ],
              Next: 'Pass (2)',
            },
            'Pass (2)': {
              Type: 'Pass',
              End: true,
            },
          },
        },
      ],
      Next: 'Parallel2',
    },
    Parallel2: {
      Type: 'Parallel',
      Branches: [
        {
          StartAt: 'Lambda Invoke (1)',
          States: {
            'Lambda Invoke (1)': {
              Type: 'Task',
              Next: 'Pass',
            },
            Pass: {
              Type: 'Pass',
              End: true,
            },
          },
        },
        {
          StartAt: 'Lambda Invoke (2)',
          States: {
            'Lambda Invoke (2)': {
              Type: 'Task',
              width: 300,
              Next: 'Pass (1)',
            },
            'Pass (1)': {
              Type: 'Pass',
              Next: 'Pass (2)',
            },
            'Pass (2)': {
              Type: 'Pass',
              End: true,
            },
          },
        },
      ],
      End: true,
    },
  },
};
const aws3 = {
  StartAt: 'Parallel',
  States: {
    Parallel: {
      Type: 'Parallel',
      Branches: [
        {
          StartAt: 'Lambda Invoke (1)',
          States: {
            'Lambda Invoke (1)': {
              Type: 'Task',
              Next: 'Pass',
            },
            Pass: {
              Type: 'Pass',
              End: true,
            },
          },
        },
        {
          StartAt: 'Lambda Invoke (1)',
          States: {
            'Lambda Invoke (1)': {
              Type: 'Task',
              Next: 'Pass',
            },
            Pass: {
              Type: 'Pass',
              End: true,
            },
          },
        },
        {
          StartAt: 'Lambda Invoke (1)',
          States: {
            'Lambda Invoke (1)': {
              Type: 'Task',
              Next: 'Pass',
            },
            Pass: {
              Type: 'Pass',
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
  const wrap = new Layout(graph, aws2);
  graph.addNode(wrap);
  // const rect1 = new RectNode(graph, { color:'red'})
  // graph.addNode(rect1)
}
export { main };
