import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Button} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './MassifShow';

const { Description } = DescriptionList;
@connect(state => ({
  massif: state.massif,
}))
@Form.create()
class MassifShow extends PureComponent {
  renderFirstView = () => {
    const {
      massif: { formData },
    } = this.props;

    return (
      <div className={styles.main}>
        <div className={styles.form} style={{ marginTop: 25 }}>
          <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
            <Description term="地块名称">{formData.name}</Description>
            <Description term="地块地址">{formData.name}</Description>
            <Description term="地块经纬度">{formData.name}</Description>
          </DescriptionList>
        </div>
        <div className={styles.form} style={{ marginTop: 25 }}>
          <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
            <Description term="地块图片">
              <img src={formData.photo} style={{ width: 50, height: 50 }} alt="" />
            </Description>
            <Description term="备注">{formData.memo}</Description>
          </DescriptionList>
        </div>
      </div>
    );
  };

  render() {
    const {
      massif: { formVisible, submitting },
      onCancel,
    } = this.props;

    return (
      <Modal
        title="查看详情"
        width={873}
        visible={formVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel}>
            关闭
          </Button>,
        ]}
        style={{ top: 20 }}
        bodyStyle={{ height: 550, overflowY: 'scroll' }}
      >
        {this.renderFirstView()}
      </Modal>
    );
  }
}
export default MassifShow;
