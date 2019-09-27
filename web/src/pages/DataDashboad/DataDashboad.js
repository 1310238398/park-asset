import React, { PureComponent } from 'react';
import { Statistic } from 'antd';
import { connect } from 'dva';
import topBg from '../../assets/topBg@2x.png';
import DataCompanyShow from './DataCompanyShow';
import JTCWJB from './JTCWJB';
import YYZB from './YYZB';
import styles from './DataDashboad.less';

@connect(({ dataDashboad, loading }) => ({
  dataDashboad,
  loading: loading.models.dataDashboad,
}))
class DataDashboad extends PureComponent {
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // 显示弹窗-子公司信息
  showCompany = item => {
    this.dispatch({
      type: 'dataDashboad/LoadCompangShow',
      payload: {
        id: item.record_id,
      },
    });
  };

  handleFormCancel = () => {
    this.dispatch({
      type: 'dataDashboad/changeShowCompany',
      payload: false,
    });
  };

  // 监听显示弹窗
  renderDataCompanyShow() {
    return <DataCompanyShow onCancel={this.handleFormCancel} />;
  }

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
              <div className={styles.leftTopOneChart}>
                <JTCWJB height={300} />
              </div>
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
            <div className={styles.yearPlan}>
              <div className={styles.yearPlanLeft}>
                <div className={styles.yearYse}>
                  <div className={styles.yearSY}>年度计划收入&nbsp;&nbsp;(亿)</div>
                  <div>
                    <Statistic
                      title=""
                      value={112893}
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
                      value={112893}
                      precision={2}
                      valueStyle={{ color: '#439AFF' }}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.mapData}>显示地图数据-田总区域</div>
            </div>

            <div>
              <div className={styles.proData}>
                <div className={styles.proDatatest}>
                  <span>项目总数</span>
                  <span className={styles.proDatal}>5</span>
                </div>
                <div className={styles.proDatatest}>
                  <span>建筑总面积</span>
                  <span className={styles.proDatal}>16.39万</span>
                </div>
                <div className={styles.proDatatest}>
                  <span>已出租面积</span>
                  <span className={styles.proDatal}>2388㎡</span>
                </div>
                <div className={styles.proDatatest}>
                  <span>未出租面积</span>
                  <span className={styles.proDatal}>2388㎡</span>
                </div>
                <div className={styles.proDatatest}>
                  <span>出租率</span>
                  <span className={styles.proDatal}>78.2%</span>
                </div>
                <div className={styles.proDatatest}>
                  <span>租金收缴率</span>
                  <span className={styles.proDatal}>91.23%</span>
                </div>
              </div>
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
                  <p className={styles.jidu}>本季度收费率</p>
                </div>
                <div className={styles.dourF}>
                  <p className={styles.jiduData}>337万</p>
                  <p className={styles.jidu}>本季度待收</p>
                </div>
              </div>

              <div className={styles.leftRightOneChart}>
                <YYZB />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.pageBottm}>
          <div
            className={styles.companyLinst}
            onClick={() => this.showCompany({ record_id: '86e1df49-c1cb-4a11-a9d2-967586425b20' })}
          >
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
        {this.renderDataCompanyShow()}
      </div>
    );
  }
}
export default DataDashboad;
