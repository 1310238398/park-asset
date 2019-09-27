import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';

class JTCWJB extends React.Component {
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
      {
        item: '公务车辆',
        count: 17,
      },
      {
        item: '其他',
        count: 13,
      },
    ],
  };

  componentDidMount() {
    // getMockData('d_car_income_count').then(data => {
    //   let list = data || [];
    //   list = list.map(v => {
    //     return {
    //       ...v,
    //       count: parseFloat(v.count, 10),
    //     };
    //   });
    //   this.setState({ data: list });
    // });
  }

  render() {
    const { height } = this.props;
    const { DataView } = DataSet;
    const { data } = this.state;
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
          val = `${(val * 100).toFixed(1)}%`;
          return val;
        },
      },
    };
    return (
      <Chart height={height} data={dv} scale={cols} padding={[0, 90, 30, 50]} forceFit>
        <Coord type="theta" radius={0.75} />
        <Axis name="percent" />
        <Legend position="bottom" offsetY={-30} />
        <Tooltip
          showTitle={false}
          itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        />
        <Geom
          type="intervalStack"
          position="percent"
          color={['item', ['#2B8AFF', '#6B12CC', '#B72DFF', '#2FCEA3', '#FFE361', '#FFAB61']]}
          tooltip={[
            'item*percent',
            (item, percent) => {
              percent = `${(percent * 100).toFixed(1)}%`;
              return {
                name: item,
                value: percent,
              };
            },
          ]}
          style={{
            lineWidth: 0,
            stroke: '#fff',
          }}
        >
          <Label
            content={[
              'item*percent',
              (v1, v2) => {
                return `${v1}(${(v2 * 100).toFixed(2)}%)`;
              },
            ]}
            textStyle={{
              rotate: 0,
              textAlign: 'center',
              shadowBlur: 2,
              fill: '#fff',
              shadowColor: 'rgba(0, 0, 0, .45)',
            }}
          />
        </Geom>
      </Chart>
    );
  }
}
export default JTCWJB;
