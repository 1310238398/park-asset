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
  Shape,
  // Facet,
  // Util,
} from 'bizcharts';
import DataSet from '@antv/data-set';
const { Html, Arc, Line } = Guide;
import { formatNumber } from '@/utils/utils';
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
    const { data } = this.props;
    //const { data } = this.state;
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

    Shape.registerShape('point', 'pointer', {
      drawShape(cfg, group) {
        let point = cfg.points[0]; // 获取第一个标记点
        point = this.parsePoint(point);
        const center = this.parsePoint({
          // 获取极坐标系下画布中心点
          x: 0,
          y: 0,
        });
        // 绘制指针
        group.addShape('line', {
          attrs: {
            x1: center.x,
            y1: center.y,
            x2: point.x,
            y2: point.y - 20,
            stroke: cfg.color,
            lineWidth: 0,
            lineCap: 'round',
          },
        });
        return group.addShape('circle', {
          attrs: {
            x: center.x,
            y: center.y,
            r: 12,
            stroke: cfg.color,
            lineWidth: 0,
            fill: '#0f1a38',
          },
        });
      },
    });
    return (
      <Chart height={100} data={data} scale={cols} padding={[0, 0, 0, 0]} forceFit>
        <Coord
          type="polar"
          startAngle={(-9 / 8) * Math.PI}
          endAngle={(1 / 8) * Math.PI}
          radius={0.75}
        />
        <Axis
          name="actual_income"
          zIndex={2}
          line={null}
          visible={false}
          // label={{
          //   offset: 0,
          //   textStyle: {
          //     fontSize: 24,
          //     fill: '#0f1a38',
          //     textAlign: 'center',
          //   },
          // }}
        />
        <Axis name="1" visible={false} />
        <Guide>
          <Arc
            zIndex={0}
            start={[0, 1]}
            end={[1, 1]}
            style={{
              // 底灰色
              stroke: '#2931F1',
              lineWidth: 18,
              opacity: 0.09,
            }}
          />
          <Arc
            zIndex={1}
            start={[0, 1]}
            end={[data[0].actual_income, 1]}
            style={{
              // 底灰色
              stroke: '#AB71E9',
              lineWidth: 18,
            }}
          />
          <Html
            position={['50%', '95%']}
            html={() =>
              `<div style="width:100px;margin-top:-30px;text-align: center;font-size: 9px!important;"><p style="font-size: 9px; color: #fff;margin: 0;">已完成</p><p style="font-size: 10px;color: #fff;margin: 0;">${
                formatNumber(data[0].actual_income,100 * 10000,2)}
                万元</p></div>`
            }
          />
        </Guide>
        <Geom
          type="point"
          position="actual_income*1"
          shape="pointer"
          color="#0f1a38"
          active={false}
          style={{ stroke: '#0f1a38', lineWidth: 0 }}
        />
      </Chart>
    );
  }
}

export default ChilrenWC;
