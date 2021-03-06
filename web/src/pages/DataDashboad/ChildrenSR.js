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
class ChildrenSR extends PureComponent {
  state = {
    actual_income: 0, //年度实际收入
    plan_income: 0, // 年度计划收入
    sf_rate: 0, // 收费率
    ds_income: 0, // 代收
  };

  componentDidMount() {
    const { params } = this.props;
    this.fetchData(params);
  }
  componentDidUpdate(prevProps) {
    const { params } = this.props;
    if (params.org_id !== prevProps.params.org_id) {
      this.fetchData(params);
    }
  }

  fetchData = params => {
    queryQuarterFinanciall(params).then(data => {
      this.setState({
        actual_income: formatNumber(data.actual_income, 100 * 10000, 2),
        plan_income: formatNumber(data.plan_income, 100 * 10000, 2),
        sf_rate:
          data.plan_income > 0
            ? formatNumber((data.actual_income / data.plan_income) * 100, 0, 2)
            : 0,
        ds_income: formatNumber(data.plan_income - data.actual_income, 100 * 10000, 2),
      });
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const { actual_income, plan_income, ds_income, sf_rate } = this.state;
    return (
      <div className={styles.finalC}>
        <div className={styles.dourF}>
          <span className={styles.jiduData}>{plan_income}万</span>
          <p className={styles.jidu}>本季度应收</p>
        </div>
        <div className={styles.dourF}>
          <span className={styles.jiduData}>{actual_income}万</span>
          <p className={styles.jidu}>本季度实收</p>
        </div>
        <div className={styles.dourF}>
          <span className={styles.jiduData}>{sf_rate}%</span>
          <p className={styles.jidu}>本季度收费率</p>
        </div>
        <div className={styles.dourF}>
          <span className={styles.jiduData}>{ds_income}万</span>
          <p className={styles.jidu}>本季度待收</p>
        </div>
      </div>
    );
  }
}
export default ChildrenSR;
