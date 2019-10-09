import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';

import { queryClasstify } from '@/services/dataDashboad';

import { formatNumber } from '@/utils/utils';

class JTCWJB extends React.Component {
  state = {
    data: [],
  };

  componentDidMount() {
    
    const { params } = this.props;
    this.fetchData(params);
  }

  componentDidUpdate(prevProps) {
    const { params } = this.props;
    if (params.year !== prevProps.params.year) {
      this.fetchData(params);
    }
  }

  fetchData = params => {
    queryClasstify(params).then(data => {
      let result = [];
      if (data && data.list) {
        result = data.list.map(item => {
          return { item: item.asset_type_name, count: item.actual_amount };
        });
      }
      this.setState({ data: result });
    });
  };

  render() {
    const { height } = this.props;
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
          return `${formatNumber(val * 100, 0, 2)}%`;
        },
      },
    };
    return (
      <Chart height={height} data={dv} scale={cols} padding={[0, 50, 80, 50]} forceFit>
        <Coord type="theta" radius={0.75} />
        <Axis name="percent" />
        <Legend position="bottom" offsetY={-20} />
        <Tooltip
          showTitle={false}
          itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        />
        <Geom
          type="intervalStack"
          position="percent"
          color={[
            'item',
            ['#2B8AFF', '#6B12CC', '#B72DFF', '#2FCEA3', '#FFE361', '#FFAB61', '#fb5050'],
          ]}
          tooltip={[
            'item*percent',
            (item, percent) => {
              const v = `${formatNumber(percent * 100, 0, 2)}%`;
              return {
                name: item,
                value: v,
              };
            },
          ]}
          style={{
            lineWidth: 0,
            stroke: '#fff',
          }}
        >
          <Label
            content="percent"
            formatter={(val, item) => {
              return `${item.point.item}: ${val}`;
            }}
            textStyle={{
              fill: '#fff',
            }}
          />
        </Geom>
      </Chart>
    );
  }
}
export default JTCWJB;
