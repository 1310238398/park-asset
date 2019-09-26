import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import topBg from '../../assets/topBg@2x.png';
import styles from './DataDashboad.less';

class DataDashboad extends PureComponent {
  render() {
    return (
      <div className={styles.main}>
        <div>
          <img src={topBg} className={styles.top} alt="" />
        </div>
        <div className={styles.topCenter}>
          <span>济南高新控股集团资产运营数据看板</span>
        </div>
        <div className={styles.middleCenter}>
          <div>
            <div className={styles.leftTopOne}>
              <div className={styles.leftTopOneTitle}>
                <span>集团资产收入占比</span>
              </div>
              <div className={styles.leftTopOneChart}>显示图表---饼图</div>
            </div>
            <div className={styles.leftTopTwo}>
              <div className={styles.leftTopTwoTitle}>
                <span>集团运营指标</span>
              </div>
              <div className={styles.leftLineArea}>
                <div className={styles.LineArea}>
                  <span>执行合同数</span> <span>本月新签合同</span> <span>本月退租合同款</span>
                </div>
                <div className={styles.LineAreaData}>
                  <span className={styles.lineAreaq}>121829份</span>
                  <span className={styles.lineAreaq}>1034</span>
                  <span className={styles.lineAreaq}>4</span>
                </div>
              </div>
              <div className={styles.leftLineAreaTwo}>
                <div className={styles.LineArea}>
                  <span>本月续租合同数</span> <span>入驻企业总数</span> <span>入驻商家总数</span>
                </div>
                <div className={styles.LineAreaData}>
                  <span className={styles.lineAreaq}>12</span>
                  <span className={styles.lineAreaq}>91%</span>
                  <span className={styles.lineAreaq}>10444</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.YearLinr}>
            <div>年度计划收入</div>
            <div>中间显示济南市地图</div>
            <div className={styles.proData}>
              <span>项目总数</span>
              <span>建筑总面积</span>
              <span>已出租面积</span>
              <span>未出租面积</span>
              <span>项目总数</span>
              <span>租金收缴率</span>
            </div>
          </div>
          <div>
            <div className={styles.leftTopOneRight}>
              <div className={styles.rightTopOneTitle}>
                <span>集团财务指标监控</span>
              </div>
              <div className={styles.finalC}>
                <div className={styles.dourF}>
                  <p className={styles.jiduData}>337万</p>
                  <p className={styles.jidu}>本季度应收</p>
                </div>
                <div className={styles.dourF}>
                  <p className={styles.jiduData}>337.2万</p>
                  <p className={styles.jidu}>本季度实收</p>
                </div>
                <div className={styles.dourF}>
                  <p className={styles.jiduData}>89%</p>
                  <p className={styles.jidu}>本月收费率</p>
                </div>
                <div className={styles.dourF}>
                  <p className={styles.jiduData}>337万</p>
                  <p className={styles.jidu}>本月待收</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.pageBottm}>
          <div className={styles.companyLinst}>
            <p className={styles.companyName}>济南东拓置业有限公司</p>
            <img src={topBg} className={styles.companyImg} alt="" />
            <p className={styles.companyPlan}>年入收入计划 123345万元</p>
          </div>
          <div className={styles.companyLinst}>
            <p className={styles.companyName}>济南东拓置业有限公司</p>
            <img src={topBg} className={styles.companyImg} alt="" />
            <p className={styles.companyPlan}>年入收入计划 123345万元</p>
          </div>
          <div className={styles.companyLinst}>
            <p className={styles.companyName}>济南东拓置业有限公司</p>
            <img src={topBg} className={styles.companyImg} alt="" />
            <p className={styles.companyPlan}>年入收入计划 123345万元</p>
          </div>
        </div>
      </div>
    );
  }
}
export default DataDashboad;
