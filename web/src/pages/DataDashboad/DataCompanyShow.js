import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import JTCWJB from './JTCWJB';
import YYZB from './YYZB';
import ChildrenZB from './ChildrenZB';
import ChildrenSR from './ChildrenSR';
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
      org_id,
      year,
      title,
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
        style={{ top: 20 }}
        // bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
        className="lightModal"
      >
        <div className={styles.companyNameTop}>{title}</div>
        <div className={styles.FloorContentWin}>
          <div className={styles.leftContWin}>
            <ChildrenZB params={{ year: year, org_id: org_id }} />
            <div className={styles.fenlei}>
              <div className={styles.assetProTitle}>资产分类收入占比</div>
              <div className={styles.leftTopOneChart}>
                <JTCWJB height={260} params={{ year: year, org_id: org_id }} />
              </div>
            </div>
          </div>
          <div className={styles.winRight}>
            <div className={styles.winRightSR}>
              <div className={styles.assetProTitle}>收入情况</div>
              <ChildrenSR params={{ year: year, org_id: org_id }} />
              <div className={styles.leftRightOneChart}>
                <YYZB height={280} params={{ year: year, org_id: org_id }} />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
export default DataCompanyShow;
