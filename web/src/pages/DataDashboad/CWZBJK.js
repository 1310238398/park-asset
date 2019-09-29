import React, { PureComponent } from 'react';
import { Statistic } from 'antd';
import { connect } from 'dva';
import { queryQuarterFinanciall } from '@/services/dataDashboad';
import styles from './DataDashboad.less';

@connect(({ dataDashboad, loading }) => ({
  dataDashboad,
  loading: loading.models.dataDashboad,
}))
class CWZBJK extends PureComponent {
  state = {
    actual_income: 0, //年度实际收入
    plan_income: 0, // 年度计划收入
  };
  componentDidMount() {
    const { params } = this.props;
    queryQuarterFinanciall(params).then(data => {
      if (data.actual_incomeactual_income !== 0) {
        this.setState({ actual_income: data.actual_income / 10000 });
      }
      if (data.plan_income !== 0) {
        this.setState({ plan_income: data.plan_income / 10000 });
      }
    });
  }

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const { actual_income, plan_income } = this.state;
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
          <p className={styles.jiduData}>{((actual_income / plan_income) * 100).toFixed(2)}%</p>
          <p className={styles.jidu}>本季度收费率</p>
        </div>
        <div className={styles.dourF}>
          <p className={styles.jiduData}>{plan_income - actual_income}万</p>
          <p className={styles.jidu}>本季度未收</p>
        </div>
      </div>
    );
  }
}
export default CWZBJK;
