import React, { PureComponent } from 'react';
import {
  // G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  // Label,
  Legend,
  // View,
  Guide,
  // Shape,
  // Facet,
  // Util,
} from 'bizcharts';
import DataSet from '@antv/data-set';

class ChilrenWC extends PureComponent {
  state = {
    data: [
      {
        item: '企业员工车辆',
        count: 40,
      },
      {
        item: '来访车辆',
        count: 21,
      },
    ],
  };
  render() {
    const { Html } = Guide;
    // const { data } = this.props;
    const { data } = this.state;
    const { DataView } = DataSet;
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: val => {
          val = `${val * 100}%`;
          return val;
        },
      },
    };
    return (
      <Chart height={140} data={dv} scale={cols} forceFit>
        <Coord type="theta" radius={0.3} innerRadius={0.8} />
        <Axis name="percent" />
        <Legend
          position="right"
          offsetY={-40}
          offsetX={-10}
          textStyle={{
            fill: '#fff', // 文本的颜色
            fontSize: '14', // 文本大小
          }}
          // itemWidth = {30}
        />
        <Tooltip
          showTitle={false}
          itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        />
        <Guide>
          <Html
            position={['50%', '50%']}
            html='<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;">主机<br><span>共</span><span style="color:#262626;font-size:2.5em">200</span>人</div>'
            alignX="middle"
            alignY="middle"
          />
        </Guide>
        <Geom
          type="intervalStack"
          position="percent"
          color={['item', ['#162A61', '#0088CE']]}
          tooltip={[
            'item*count',
            (k, v) => {
              return {
                name: k,
                value: `${v}(万元)`,
              };
            },
          ]}
          style={{
            lineWidth: 1,
            stroke: '#fff',
          }}
        />
      </Chart>
    );
  }
}

export default ChilrenWC;
