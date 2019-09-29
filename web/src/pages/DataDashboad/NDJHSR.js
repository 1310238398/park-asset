import React, { PureComponent } from 'react';
import { Statistic } from 'antd';
import { connect } from 'dva';
import { queryOverview } from '@/services/dataDashboad';
import styles from './DataDashboad.less';

@connect(({ dataDashboad, loading }) => ({
  dataDashboad,
  loading: loading.models.dataDashboad,
}))
class NDJHSR extends PureComponent {
  state = {
    annual_actual_income: 0, //年度实际收入
    annual_plan_income: 0, // 年度计划收入
  };
  componentDidMount() {
    const { params } = this.props;
    queryOverview(params).then(data => {
      if (data.annual_actual_income !== 0) {
        this.setState({ annual_actual_income: data.annual_actual_income / 100000000 });
      }
      if (data.annual_plan_income !== 0) {
        this.setState({ annual_plan_income: data.annual_plan_income / 100000000 });
      }
    });
  }

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const { annual_actual_income, annual_plan_income } = this.state;
    return (
      <div className={styles.yearPlanLeft}>
        <div className={styles.yearYse}>
          <div className={styles.yearSY}>年度计划收入&nbsp;&nbsp;(亿)</div>
          <div>
            <Statistic
              title=""
              value={annual_plan_income}
              precision={2}
              valueStyle={{ color: '#439AFF' }}
            />
          </div>
        </div>
        <div className={styles.yearYse}>
          <div className={styles.yearSY}>年度实际收入&nbsp;&nbsp;(亿)</div>
          <div>
            <Statistic
              title=""
              value={annual_actual_income}
              precision={2}
              valueStyle={{ color: '#439AFF' }}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default NDJHSR;
