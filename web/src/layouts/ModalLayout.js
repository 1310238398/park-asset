import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Modal } from 'antd';
import styles from './ModalLayout.less';

@connect()
class ModalLayout extends React.PureComponent {
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const { children, location } = this.props;
    if (location.pathname === '/datadashboad') {
      this.cockpitmChildren = children;
    }
    const visible = location.pathname !== '/datadashboad';
    return (
      <div>
        {this.cockpitmChildren}
        <Modal
          visible={visible}
          className={styles.darkModal}
          wrapClassName={styles.scoller}
          destroyOnClose
          closable
          width="100%"
          onCancel={() => {
            this.dispatch(routerRedux.replace('/datadashboad'));
          }}
          footer={null}
          style={{ top: 0, overflow: 'none' }}
          title=" "
        >
          {visible && children}
        </Modal>
      </div>
    );
  }
}
export default ModalLayout;
