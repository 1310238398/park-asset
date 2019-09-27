import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import styles from './DataDashboad.less';

@connect(({ dataDashboad, loading }) => ({
  dataDashboad,
  loading: loading.models.dataDashboad,
}))
class DataCompanyShow extends PureComponent {
  onCloseWin = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  render() {
    const {
      dataDashboad: { showCompany },
    } = this.props;
    return (
      <Modal
        visible={showCompany}
        footer={null}
        title={null}
        onCancel={this.onCloseWin}
        width="60.26vw"
        height="84.35vh"
        maskStyle={{ backgroundColor: '#04051F', opacity: '0.9' }}
        className="lightModal"
      >
        <div className={styles.companyNameTop}>济南东拓置业有限公司</div>
        <div className={styles.FloorContentWin}>
          <div className={styles.leftContWin}>
            <div className={styles.profile}>
              <div className={styles.assetProTitle}>资产概况</div>
              <div className={styles.leftLineArea} style={{ paddingTop: '1.85vh' }}>
                <div className={styles.LineArea}>
                  <span>项目总数</span> <span>建筑总面积</span> <span>已出租面积</span>
                </div>
                <div className={styles.LineAreaData}>
                  <span className={styles.lineAreaq}>1223</span>
                  <span className={styles.lineAreaq}>233.2㎡</span>
                  <span className={styles.lineAreaq}>233.2㎡</span>
                </div>
              </div>
              <div className={styles.leftLineAreaTwo}>
                <div className={styles.LineArea}>
                  <span>未出租面积</span> <span>出租率</span> <span>租金收缴率</span>
                </div>
                <div className={styles.LineAreaData}>
                  <span className={styles.lineAreaq}>233.2㎡</span>
                  <span className={styles.lineAreaq}>91%</span>
                  <span className={styles.lineAreaq}>87%</span>
                </div>
              </div>
            </div>
            <div className={styles.fenlei}>
              <div className={styles.assetProTitle}>资产分类收入占比</div>
              <div className={styles.leftTopOneChart}>显示图表---饼图</div>
            </div>
          </div>
          <div className={styles.winRight}>
            <div className={styles.winRightSR}>
              <div className={styles.assetProTitle}>收入情况</div>
              <div className={styles.finalC}>
                <div className={styles.dourF}>
                  <span className={styles.jiduData}>337万</span>
                  <p className={styles.jidu}>本季度应收</p>
                </div>
                <div className={styles.dourF}>
                  <span className={styles.jiduData}>337.2万</span>
                  <p className={styles.jidu}>本季度实收</p>
                </div>
                <div className={styles.dourF}>
                  <span className={styles.jiduData}>89%</span>
                  <p className={styles.jidu}>本季度收费率</p>
                </div>
                <div className={styles.dourF}>
                  <span className={styles.jiduData}>337万</span>
                  <p className={styles.jidu}>本季度待收</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
export default DataCompanyShow;
