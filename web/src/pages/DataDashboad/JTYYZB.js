import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { queryOperational } from '@/services/dataDashboad';
import styles from './DataDashboad.less';

@connect(({ dataDashboad, loading }) => ({
  dataDashboad,
  loading: loading.models.dataDashboad,
}))
class JTYYZB extends PureComponent {
  state = {
    data: {
      contract_num: 0, //合同数
      enterprise_num: 0, // 入驻企业总数
      merchant_num: 0, // 入驻商家总数
      this_month_add_contract_num: 0, // 本月新签合同数
      this_month_renew_contract_num: 0, // 本月续签合同数
      this_month_withdrawal_contract_num: 0, // 本月退租合同数
    },
  };
  componentDidMount() {
    const { params } = this.props;
    queryOperational(params).then(data => {
      this.setState({ data: data });
    });
  }

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      data: {
        contract_num,
        enterprise_num,
        merchant_num,
        this_month_add_contract_num,
        this_month_renew_contract_num,
        this_month_withdrawal_contract_num,
      },
    } = this.state;
    return (
      <div className={styles.leftTopTwo}>
        <div className={styles.leftTopTwoTitle}>
          <span>集团运营指标</span>
        </div>
        <div className={styles.leftLineArea}>
          <div className={styles.LineArea}>
            <span>执行合同数</span> <span>本月新签合同</span> <span>本月退租合同数</span>
          </div>
          <div className={styles.LineAreaData}>
            <span className={styles.lineAreaq}>{contract_num}份</span>
            <span className={styles.lineAreaq}>{this_month_add_contract_num}</span>
            <span className={styles.lineAreaq}>{this_month_withdrawal_contract_num}</span>
          </div>
        </div>
        <div className={styles.leftLineAreaTwo}>
          <div className={styles.LineArea}>
            <span>本月续租合同数</span> <span>入驻企业总数</span> <span>入驻商家总数</span>
          </div>
          <div className={styles.LineAreaData}>
            <span className={styles.lineAreaq}>{this_month_renew_contract_num}</span>
            <span className={styles.lineAreaq}>{enterprise_num}</span>
            <span className={styles.lineAreaq}>{merchant_num}</span>
          </div>
        </div>
      </div>
    );
  }
}
export default JTYYZB;
