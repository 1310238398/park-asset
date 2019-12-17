import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Button, Card } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './ContractChange.less';
const { Description } = DescriptionList;

@connect(state => ({
  materialPricing: state.materialPricing,
}))
@Form.create()
class MaterialPricingShow extends PureComponent {
  renderFirstView = () => {
    const {
      materialPricing: { formData },
    } = this.props;

    return (
      <div className={styles.main}>
        <div className={styles.form}>
          <Card title="基本信息" style={{ marginBottom: 20 }}>
            <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
              <Description term="申请材料批价名称">22</Description>
              <Description term="批价编号">22</Description>
              <Description term="合同名称">22</Description>
              <Description term="合同编号">222</Description>
              <Description term="施工单位">22</Description>
              <Description term="工程名称">222</Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
              <Description term="批价原因">
                这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
              </Description>
              <Description term="其他原因">
                这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
              </Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
              <Description term="设计变更名称">22</Description>
              <Description term="设计变更编号">22</Description>
              <Description term="签证变更名称">22</Description>
              <Description term="签证变更编号">22</Description>
              <Description term="发起部门">22</Description>
              <Description term="发起人">22</Description>
              <Description term="发起日期">22</Description>
            </DescriptionList>
            
          </Card>
          <Card title="其他信息">
            <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
              <Description term="备注">
                这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
              </Description>
              <Description term="附件信息">
                这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
              </Description>
            </DescriptionList>
          </Card>
        </div>
      </div>
    );
  };

  render() {
    const {
      materialPricing: { formVisibleMaterialPricing, submitting },
      onCancel,
    } = this.props;
    return (
      <Modal
        title="查看详情"
        width={873}
        visible={formVisibleMaterialPricing}
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
export default MaterialPricingShow;
