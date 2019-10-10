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
import { queryFinanciall } from '@/services/dataDashboad';
import { formatNumber } from '@/utils/utils';
class YYZB extends React.Component {
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
    if (params.org_id && params.org_id !== prevProps.params.org_id) {
      this.fetchData(params);
    }
  }

  fetchData = params => {
    queryFinanciall(params).then(data => {
      let result = [];
      if (data && data.list) {
        result = data.list.map(item => {
          return {
            quarter: this.renderState(item.quarter),
            count: parseFloat((item.amount / (10000 * 100)).toFixed(2)),
            type: item.payment_type === 1 ? '应收' : '实收',
          };
        });
      }
      this.setState({ data: result });
    });
  };

  renderState(quarter) {
    switch (quarter) {
      case 1:
        return '第一季度';
      case 2:
        return '第二季度';
      case 3:
        return '第三季度';
      case 4:
        return '第四季度';
      default:
        return '';
    }
  }

  render() {
    // const data = [
    //   {
    //     month: '第一季度',
    //     city: '应收',
    //     temperature: 3,
    //   },
    //   {
    //     month: '第二季度',
    //     city: '应收',
    //     temperature: 3.9,
    //   },
    //   {
    //     month: '第二季度',
    //     city: '已收',
    //     temperature: 3.9,
    //   },
    //   {
    //     month: '第三季度',
    //     city: '应收',
    //     temperature: 6.9,
    //   },
    //   {
    //     month: '第三季度',
    //     city: '已收',
    //     temperature: 6.9,
    //   },
    //   {
    //     month: '第四季度',
    //     city: '已收',
    //     temperature: 4.2,
    //   },
    //   {
    //     month: '第四季度',
    //     city: '应收',
    //     temperature: 4.2,
    //   },
    // ];
    const cols = {
      month: {
        range: [0, 1],
      },
    };

    const { height } = this.props;
    const { data } = this.state;
    return (
      <div>
        <Chart height={height} data={data} scale={cols} forceFit padding={[30, 60, 80, 60]}>
          <Legend
            label={{
              textStyle: {
                fill: '#fff',
              },
            }}
          />
          <Axis
            name="quarter"
            label={{
              textStyle: {
                fill: '#fff',
              },
            }}
          />
          <Axis
            name="count"
            label={{
              formatter: val => `${val}万元`,
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
            position="quarter*count"
            size={2}
            color={[
              'type',
              [
                'l (45) 0:rgba(67,154,255,1) 1:rgba(67,154,255,0.2)',
                'l (45) 0:rgba(233,60,167,0.2) 1:rgba(233,60,167,1)',
              ],
            ]}
            shape={'smooth'}
            tooltip={[
              'type*count',
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
