import React, { PureComponent } from 'react';
import { Statistic } from 'antd';
import { connect } from 'dva';
import { queryOverview } from '@/services/dataDashboad';
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
  };
  componentDidMount() {
    const { params } = this.props;
    queryOverview(params).then(data => {
      if (data.annual_actual_income !== 0) {
        this.setState({ annual_actual_income: data.annual_actual_income / 100 });
      }
      if (data.annual_plan_income !== 0) {
        this.setState({ annual_plan_income: data.annual_plan_income / 100 });
      }
      if (data.building_area !== 0) {
        this.setState({ building_area: data.building_area / 10000 });
      }
      if (data.rent_area !== 0) {
        this.setState({ rent_area: data.rent_area / 100 });
      }
      if (data.rented_area !== 0) {
        this.setState({ rented_area: data.rented_area / 100 });
      }
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
    } = this.state;
    return (
      <div className={styles.proData}>
        <div className={styles.proDatatest}>
          <span>项目总数</span>
          <span className={styles.proDatal}>{project_num}</span>
        </div>
        <div className={styles.proDatatest}>
          <span>建筑总面积</span>
          <span className={styles.proDatal}>{building_area}万</span>
        </div>
        <div className={styles.proDatatest}>
          <span>已出租面积</span>
          <span className={styles.proDatal}>{rented_area}㎡</span>
        </div>
        <div className={styles.proDatatest}>
          <span>未出租面积</span>
          <span className={styles.proDatal}>{rent_area - rented_area}㎡</span>
        </div>
        <div className={styles.proDatatest}>
          <span>出租率</span>
          <span className={styles.proDatal}>{((rented_area / rent_area) * 100).toFixed(2)}%</span>
        </div>
        <div className={styles.proDatatest}>
          <span>租金收缴率</span>
          <span className={styles.proDatal}>
            {((annual_actual_income / annual_plan_income) * 100).toFixed(2)}%
          </span>
        </div>
      </div>
    );
  }
}
export default XMGK;
