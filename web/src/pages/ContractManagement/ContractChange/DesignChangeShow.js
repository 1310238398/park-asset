import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Button } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './ContractChange.less';
const { Description } = DescriptionList;

@connect(state => ({
  designChange: state.designChange,
}))
@Form.create()
class DesignChangeShow extends PureComponent {
  renderFirstView = () => {
    const {
      designChange: { formData },
    } = this.props;

    return (
      <div className={styles.main}>
        <div className={styles.form}>
          <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
           <Description term="变更编号">22</Description>
           <Description term="申请变更主题名称">22</Description>
            <Description term="合同名称">22</Description>
            <Description term="合同编号">222</Description>
            <Description term="发起部门">22</Description>
            <Description term="发起人">222</Description>
          </DescriptionList>
          <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
            <Description term="变更部位">
              这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
            </Description>
            <Description term="变更原因">
              这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
            </Description>
            <Description term="其他原因">
              这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
            </Description>
            <Description term="变更内容">
              这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
            </Description>
           
          </DescriptionList>
          <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
          <Description term="成本增减">
              这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
            </Description>
            <Description term="估算金额">
              这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
            </Description>
           <Description term="是否施工">22</Description>
           <Description term="是否已采购">22</Description>
            <Description term="费用变化初判">22</Description>
            <Description term="是否需报批">222</Description>
            <Description term="发起人">22</Description>
            <Description term="发起日期">222</Description>
            <Description term="变更类型">222</Description>
          </DescriptionList>
          <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
            <Description term="备注">
              这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
            </Description>
            <Description term="附件信息">
              这是一个技术登记三大时间多久氨基酸技术监督局觉得就得山东省
            </Description>
          </DescriptionList>
        </div>
      </div>
    );
  };

  render() {
    const {
      designChange: { formVisibleDesignChange, submitting },
      onCancel,
    } = this.props;

    return (
      <Modal
        title="查看详情"
        width={873}
        visible={formVisibleDesignChange}
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
export default DesignChangeShow;
