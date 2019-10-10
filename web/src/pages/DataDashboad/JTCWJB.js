import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, Guide } from 'bizcharts';
import DataSet from '@antv/data-set';

import { queryClasstify, queryOverview } from '@/services/dataDashboad';

import { formatNumber } from '@/utils/utils';

class JTCWJB extends React.Component {
  state = {
    data: [],
    annual_actual_income: 0,
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
    if (params.org_id && params.org_id !== prevProps.params.org_id) {
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
    queryOverview(params).then(data => {
      this.setState({
        annual_actual_income: formatNumber(data.annual_actual_income, 100 * 10000, 2),
        annual_plan_income: formatNumber(data.annual_plan_income, 100 * 10000, 2),
      });
    });
  };

  render() {
    const { height } = this.props;
    const { data, annual_actual_income } = this.state;
    const { DataView } = DataSet;
    const { Html } = Guide;
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
      <Chart height={height} data={dv} scale={cols} padding={[30, 80, 50, 50]} forceFit>
        <Coord type="theta" radius={0.75} innerRadius={0.6} />
        <Axis name="percent" />
        <Legend position="bottom" offsetY={-5} />
        <Tooltip
          showTitle={false}
          itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        />
        <Guide>
          <Html
            position={['50%', '50%']}
            html={`<div style="color:#FFFFFF;font-size:10px;text-align: center;width: 10em;">实际收入<br><span style="color:#FFFFFF;font-size:10px">${annual_actual_income}</span><span style="color:#FFFFFF">万元</span></div>`}
            alignX="middle"
            alignY="middle"
          />
        </Guide>
        <Geom
          type="intervalStack"
          position="percent"
          color={[
            'item',
            ['#2B8AFF', '#6B12CC', '#B72DFF', '#2FCEA3', '#FFE361', '#FFAB61', '#fb5050'],
          ]}
          tooltip={[
            'item*count',
            (item, count) => {
              const v = `${formatNumber(count, 100 * 10000, 0, 2)}万元`;
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
