import { merge } from 'lodash';
export const THEME_BLUE = '#0070CC';
const ICON_LENGTH = 22;
const ICON_PADDING = 8;
const ICON_X = 24;
const DEFAULT = {
  color: THEME_BLUE,
  iconUrl:
    'https://img.alicdn.com/imgextra/i1/O1CN01YPO3Uw1rGgJP1dhwH_!!6000000005604-55-tps-200-200.svg',
  title: '自定义API接口',
  subTitle: 'API接口'
};

export const basicRectAttrs = options => {
  const { height, color, iconUrl, title, subTitle } = merge(DEFAULT, options);

  return {
    attrs: {
      body: {
        stroke: 'gray',
        strokeWidth: 1,
        fill: 'white',
        strokeLinejoin: 'round'
      },
      leftBorder: {
        stroke: 'none',
        fill: color,
        width: 4,
        height,
        x: 0,
        y: 0
      },
      icon: {
        'xlink:href': iconUrl,
        width: ICON_LENGTH,
        height: ICON_LENGTH,
        x: ICON_X,
        y: (height - ICON_LENGTH) / 2
      },
      iconBg: {
        stroke: 'none',
        fill: color,
        width: ICON_LENGTH + ICON_PADDING,
        height: ICON_LENGTH + ICON_PADDING,
        x: ICON_X - ICON_PADDING / 2,
        y: (height - ICON_LENGTH - ICON_PADDING) / 2
      },
      title: {
        text: title,
        refX: 60,
        refY: 33,
        fontSize: 16,
        fill: 'rgba(0,0,0,0.9)',
        'text-anchor': 'start'
      },
      subTitle: {
        text: subTitle,
        refX: 62,
        refY: 14,
        fill: 'rgba(0,0,0,0.6)',
        fontSize: 12,
        'text-anchor': 'start'
      }
    },
    markup: [
      {
        tagName: 'rect',
        selector: 'body'
      },
      {
        tagName: 'rect',
        selector: 'iconBg'
      },
      {
        tagName: 'image',
        selector: 'icon'
      },
      {
        tagName: 'text',
        selector: 'title'
      },
      {
        tagName: 'text',
        selector: 'subTitle'
      },
      {
        tagName: 'rect',
        selector: 'leftBorder'
      }
    ]
  };
};
