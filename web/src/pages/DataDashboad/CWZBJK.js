import React, { PureComponent } from 'react';
import { Statistic } from 'antd';
import { connect } from 'dva';
import { queryQuarterFinanciall } from '@/services/dataDashboad';
import { formatNumber } from '@/utils/utils';
import styles from './DataDashboad.less';

@connect(({ dataDashboad, loading }) => ({
  dataDashboad,
  loading: loading.models.dataDashboad,
}))
class CWZBJK extends PureComponent {
  state = {
    actual_income: 0,
    plan_income: 0,
    sf_rate: 0,
    ds_income: 0,
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
    queryQuarterFinanciall(params).then(data => {
      this.setState({
        actual_income: formatNumber(data.actual_income, 100 * 10000, 2),
        plan_income: formatNumber(data.plan_income, 100 * 10000, 2),
        sf_rate: formatNumber((data.actual_income / data.plan_income) * 100, 0, 2),
        ds_income: formatNumber(data.plan_income - data.actual_income, 100 * 10000, 2),
      });
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const { actual_income, plan_income, sf_rate, ds_income } = this.state;
    return (
      <div className={styles.finalC}>
        <div className={styles.dourF}>
          <p className={styles.jiduData}>{plan_income}万</p>
          <p className={styles.jidu}>本季度应收</p>
        </div>
        <div className={styles.dourF}>
          <p className={styles.jiduData}>{actual_income}万</p>
          <p className={styles.jidu}>本季度实收</p>
        </div>
        <div className={styles.dourF}>
          <p className={styles.jiduData}>{sf_rate}%</p>
          <p className={styles.jidu}>本季度收费率</p>
        </div>
        <div className={styles.dourF}>
          <p className={styles.jiduData}>{ds_income}万</p>
          <p className={styles.jidu}>本季度未收</p>
        </div>
      </div>
    );
  }
}
export default CWZBJK;
