import React, { PureComponent } from 'react';
import { Statistic } from 'antd';
import { connect } from 'dva';
import { queryOverview } from '@/services/dataDashboad';
import { formatNumber } from '@/utils/utils';
import styles from './DataDashboad.less';

@connect(({ dataDashboad, loading }) => ({
  dataDashboad,
  loading: loading.models.dataDashboad,
}))
class XMGK extends PureComponent {
  state = {
    annual_actual_income: 0, //年度实际收入
    annual_plan_income: 0, // 年度计划收入
    building_area: 0, // 建筑总面积
    project_num: 0, // 项目总数
    rent_area: 0, // 建筑计租总面积
    rented_area: 0, // 建筑已租面积
    unrented_area: 0, // 未租面积
    cz_rate: 0, // 出租率
    sj_rate: 0, // 收缴率
  };

  componentDidMount() {
    const { params } = this.props;
    queryOverview(params).then(data => {
      this.setState({
        annual_actual_income: formatNumber(data.annual_actual_income, 100 * 10000 * 10000, 2),
        annual_plan_income: formatNumber(data.annual_plan_income, 100 * 10000 * 10000, 2),
        building_area: formatNumber(data.building_area, 100 * 10000, 2),
        rented_area: formatNumber(data.rented_area, 100 * 10000, 2),
        unrented_area: formatNumber(data.rent_area - data.rented_area, 100 * 10000, 2),
        cz_rate: formatNumber((data.rented_area / data.rent_area) * 100, 0, 2),
        sj_rate: formatNumber((data.annual_actual_income / data.annual_plan_income) * 100, 0, 2),
        project_num: data.project_num,
      });
    });
  }

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      annual_actual_income,
      annual_plan_income,
      building_area,
      project_num,
      rent_area,
      rented_area,
      unrented_area,
      cz_rate,
      sj_rate,
    } = this.state;
    return (
      <div className={styles.proData}>
        <div className={styles.proDatatest}>
          <span>项目总数</span>
          <span className={styles.proDatal}>{project_num}</span>
        </div>
        <div className={styles.proDatatest}>
          <span>建筑总面积</span>
          <span className={styles.proDatal}>{building_area}万㎡</span>
        </div>
        <div className={styles.proDatatest}>
          <span>已出租面积</span>
          <span className={styles.proDatal}>{rented_area}万㎡</span>
        </div>
        <div className={styles.proDatatest}>
          <span>未出租面积</span>
          <span className={styles.proDatal}>{unrented_area}万㎡</span>
        </div>
        <div className={styles.proDatatest}>
          <span>出租率</span>
          <span className={styles.proDatal}>{cz_rate}%</span>
        </div>
        <div className={styles.proDatatest}>
          <span>租金收缴率</span>
          <span className={styles.proDatal}>{sj_rate}%</span>
        </div>
      </div>
    );
  }
}
export default XMGK;
