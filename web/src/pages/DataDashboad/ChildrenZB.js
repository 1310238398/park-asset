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
class ChildrenZB extends PureComponent {
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
    this.fetchData(params);
  }
  componentDidUpdate(prevProps) {
    const { params } = this.props;
    if (params.org_id !== prevProps.params.org_id) {
      this.fetchData(params);
    }
  }

  fetchData = params => {
    queryOverview(params).then(data => {
      this.setState({
        annual_actual_income: formatNumber(data.annual_actual_income, 100 * 10000 * 10000, 2),
        annual_plan_income: formatNumber(data.annual_plan_income, 100 * 10000 * 10000, 2),
        building_area: formatNumber(data.building_area, 100 * 10000, 2),
        rented_area: formatNumber(data.rented_area, 100 * 10000, 2),
        unrented_area: formatNumber(data.rent_area - data.rented_area, 100 * 10000, 2),
        cz_rate: data.rent_area>0?formatNumber((data.rented_area / data.rent_area) * 100, 0, 2):0,
        sj_rate: data.annual_plan_income>0?formatNumber((data.annual_actual_income / data.annual_plan_income) * 100, 0, 2):0,
        project_num: data.project_num,
      });
    });
  };

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
      <div className={styles.profile}>
        <div className={styles.assetProTitle}>资产概况</div>
        <div className={styles.leftLineArea} style={{ paddingTop: '1.85vh' }}>
          <div className={styles.LineAreaChirden}>
            <span>项目总数</span> <span>未出租面积</span> <span>已出租面积</span>
          </div>
          <div className={styles.LineAreaData}>
            <span className={styles.lineAreaq}>{project_num}</span>
            <span className={styles.lineAreaq}>{unrented_area}万㎡</span>
            <span className={styles.lineAreaq}>{rented_area}万㎡</span>
          </div>
        </div>
        <div className={styles.leftLineAreaTwo}>
          <div className={styles.LineAreaChirden}>
            <span>出租率</span> <span>租金收缴率</span>
          </div>
          <div className={styles.LineAreaData}>
            <span className={styles.lineAreaq}>{cz_rate}%</span>
            <span className={styles.lineAreaq}>{sj_rate}%</span>
          </div>
        </div>
      </div>
    );
  }
}
export default ChildrenZB;
