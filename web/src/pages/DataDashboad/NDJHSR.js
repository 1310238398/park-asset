import React, { PureComponent } from 'react';
import CountUp from 'react-countup';
import { Statistic } from 'antd';
import { connect } from 'dva';
import { queryOverview } from '@/services/dataDashboad';
import { formatNumber } from '@/utils/utils';
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
    this.fetchData(params);
  }
  componentDidUpdate(prevProps) {
    const { params } = this.props;
    if (params.year !== prevProps.params.year) {
      this.fetchData(params);
    }
  }

  fetchData = params => {
    queryOverview(params).then(data => {
      this.setState({
        annual_actual_income: formatNumber(data.annual_actual_income, 100 * 10000 , 2),
        annual_plan_income: formatNumber(data.annual_plan_income, 100 * 10000 , 2),
      });
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // #439AFF
  render() {
    const { annual_actual_income, annual_plan_income } = this.state;
    return (
      <div className={styles.yearPlanLeft}>
        <div className={styles.yearYse}>
          <div className={styles.yearSY}>年度计划收入&nbsp;&nbsp;(万)</div>
          <div className={styles.ndjhPlan}>
            <span><CountUp delay={2} end={annual_plan_income} decimals={2} /></span>
            {/* <Statistic
              title=""
              value={annual_plan_income}
              precision={2}
              valueStyle={{ color: '#FFF'}}
              className="valDecial"
            /> */}
          </div>
        </div>
        <div className={styles.yearYse}>
          <div className={styles.yearSY}>年度实际收入&nbsp;&nbsp;(万)</div>
          <div className={styles.ndjhPlan}>
          <span><CountUp delay={2} end={annual_actual_income} decimals={2} /></span>
            {/* <Statistic
              title=""
              value={annual_actual_income}
              precision={2}
              valueStyle={{ color: '#FFF'}}
            /> */}
          </div>
        </div>
      </div>
    );
  }
}
export default NDJHSR;
