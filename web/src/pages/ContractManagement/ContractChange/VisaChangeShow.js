import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Button, Card } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './ContractChange.less';
const { Description } = DescriptionList;

@connect(state => ({
  visaChange: state.visaChange,
}))
@Form.create()
class VisaChangeShow extends PureComponent {
  renderFirstView = () => {
    const {
      visaChange: { formData },
    } = this.props;

    return (
      <div className={styles.main}>
        <div className={styles.form}>
          <Card title="基本信息" style={{ marginBottom: 20 }}>
            <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
              <Description term="签证编号">22</Description>
              <Description term="申请签证变更主题名称">22</Description>
              <Description term="合同名称">22</Description>
              <Description term="合同编号">222</Description>
              <Description term="施工单位">22</Description>
              <Description term="监理单位">222</Description>
              <Description term="签证类型">22</Description>
              <Description term="分部工程名称">222</Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
              <Description term="签证原因">
                这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
              </Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
              <Description term="设计变更名称">22</Description>
              <Description term="设计变更编号">22</Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
              <Description term="其他原因">
                这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
              </Description>
              <Description term="签证内容">
                这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
              </Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
              <Description term="签证报价">22</Description>
              <Description term="施工单位负责人">22</Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
              <Description term="项目阶段">
                这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
              </Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 20 }}>
              <Description term="发起部门">22</Description>
              <Description term="发起人">22</Description>
              <Description term="发起日期">22</Description>
            </DescriptionList>
          </Card>
          <Card title="监理与现场部信息" style={{ marginBottom: 20 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 20 }}>
              <Description term="监理单位意见"></Description>
              <Description term="初审意见">上报审批</Description>
              <Description term="是否设计出图">22</Description>
              <Description term="现场项目部意见"></Description>
              <Description term="成本增减">22</Description>
              <Description term="估算金额">222</Description>
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
      visaChange: { formVisibleVisaChange, submitting },
      onCancel,
    } = this.props;

    return (
      <Modal
        title="查看详情"
        width={873}
        visible={formVisibleVisaChange}
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
export default VisaChangeShow;
