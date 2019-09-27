import React from 'react';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts';

class YYZB extends React.Component {
  render() {
    const data = [
      {
        month: '第一季度',
        city: '应收',
        temperature: 3,
      },
      {
        month: '第二季度',
        city: '应收',
        temperature: 3.9,
      },
      {
        month: '第二季度',
        city: '已收',
        temperature: 3.9,
      },
      {
        month: '第三季度',
        city: '应收',
        temperature: 6.9,
      },
      {
        month: '第三季度',
        city: '已收',
        temperature: 6.9,
      },
      {
        month: '第四季度',
        city: '已收',
        temperature: 4.2,
      },
      {
        month: '第四季度',
        city: '应收',
        temperature: 4.2,
      },
    ];
    const cols = {
      month: {
        range: [0, 1],
      },
    };
    return (
      <div>
        <Chart height={400} data={data} scale={cols} forceFit padding={[10, 50, 110, 50]}>
          <Legend
            label={{
              textStyle: {
                fill: '#fff',
              },
            }}
          />
          <Axis
            name="month"
            label={{
              textStyle: {
                fill: '#fff',
              },
            }}
          />
          <Axis
            name="temperature"
            // label={{
            //   formatter: val => `${val}万元`
            // }}
            label={{
              textStyle: {
                fill: '#fff',
              },
            }}
          />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom
            type="area"
            position="month*temperature"
            size={2}
            color={[
              'city',
              [
                'l (45) 0:rgba(67,154,255,1) 1:rgba(67,154,255,0.2)',
                'l (45) 0:rgba(233,60,167,0.2) 1:rgba(233,60,167,1)',
              ],
            ]}
            shape={'smooth'}
            tooltip={[
              'city*temperature',
              (k, v) => {
                return {
                  name: k,
                  value: `${v}(万元)`,
                };
              },
            ]}
          />
        </Chart>
      </div>
    );
  }
}
export default YYZB;
