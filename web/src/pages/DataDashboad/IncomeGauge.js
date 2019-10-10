import React from 'react';
import { Chart, Axis, Coord, Geom, Guide } from 'bizcharts';
import { formatNumber } from '@/utils/utils';

const { Html, Arc } = Guide;

export default ({ data, height }) => {
  const cols = {
    value: {
      min: 0,
      max: data.plan_income,
      nice: false,
    },
  };

  const items = [
    {
      value: data.actual_income,
    },
  ];

  return (
    <Chart height={height} data={items} scale={cols} padding={[0, 0, 0, 0]} forceFit>
      <Coord type="polar" startAngle={-Math.PI} endAngle={0} radius={0.75} />
      <Axis name="value" visible={false} />
      <Axis name="1" visible={false} />
      <Guide>
        <Arc
          zIndex={0}
          start={[0, 0.965]}
          end={[data.plan_income, 0.965]}
          style={{
            stroke: '#000',
            lineWidth: 18,
            opacity: 0.1,
          }}
        />
        <Arc
          zIndex={1}
          start={[0, 0.965]}
          end={[
            data.actual_income > data.plan_income ? data.plan_income : data.actual_income,
            0.965,
          ]}
          style={{
            // 底灰色
            stroke: '#0185D0',
            lineWidth: 18,
          }}
        />
        <Html
          position={['50%', '95%']}
          html={() =>
            `<div style="width:100px;margin-top:-30px;text-align: center;font-size: 9px!important;"><p style="font-size: 9px; color: #fff;margin: 0;">${formatNumber(
              (data.actual_income / data.plan_income) * 100,
              0,
              2
            )}%</p><p style="font-size: 10px;color: #fff;margin: 0;">${formatNumber(
              data.actual_income,
              100*10000,
              2
            )}
                万元</p></div>`
          }
        />
      </Guide>
      <Geom type="point" position="value*1" shape="pointer" active={false} />
    </Chart>
  );
};
