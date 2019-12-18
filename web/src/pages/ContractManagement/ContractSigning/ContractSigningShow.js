import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Button } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './ContractSigning.less';
const { Description } = DescriptionList;

@connect(state => ({
  contractSiging: state.contractSiging,
}))
@Form.create()
class ContractSigningShow extends PureComponent {
  
  renderFirstView = () => {
    const {
      contractSiging: { formDataSiging },
    } = this.props;
    console.log(formDataSiging)
    return (
      <div className={styles.main}>
        <div className={styles.form}>
          <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
            <Description term="合同编号">{formDataSiging.sn}</Description>
          </DescriptionList>
          <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
            <Description term="合同名称"> {formDataSiging.name}</Description>
            <Description term="合同类别"> {formDataSiging.category}</Description>
            <Description term="所属科目"> {formDataSiging.subject}</Description>
            <Description term="所属科目分项"> {formDataSiging.subject_subitem}</Description>
            <Description term="选择合约规划"> {formDataSiging.contract_planning_id}</Description>
            <Description term="虚拟合同"> {formDataSiging.virtual}</Description>
            <Description term="合同性质"> {formDataSiging.property}</Description>
            <Description term="是否结算"> {formDataSiging.settlement}</Description>
            <Description term="甲方单位"> {formDataSiging.jiafang}</Description>
            <Description term="负责人"> {formDataSiging.jiafang_sign}</Description>
            <Description term="乙方单位"> {formDataSiging.yifang}</Description>
            <Description term="负责人"> {formDataSiging.yifang_sign}</Description>
            <Description term="丙方单位"> {formDataSiging.bingfang}</Description>
            <Description term="负责人"> {formDataSiging.bingfang_sign}</Description>
            <Description term="合同金额"> {formDataSiging.amount}</Description>
            <Description term="甲供材料金额"> {formDataSiging.jia_stuffs_amount}</Description>
            <Description term="不记成本金额"> {formDataSiging.uncost_amount}</Description>
            <Description term="有效签约金额"> {formDataSiging.vali_sign_amount}</Description>
            <Description term="付款方式"> {formDataSiging.pay_type}</Description>
          </DescriptionList>
          <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
            <Description term="付款条件">{formDataSiging.pay_precondition}</Description>
            <Description term="合同内容">{formDataSiging.content}</Description>
            <Description term="备注">{formDataSiging.remark}</Description>
            {/* <Description term="附件信息">{formDataSiging.attas}</Description> */}
          </DescriptionList>
        </div>
      </div>
    );
  };

  render() {
    const {
      contractSiging: { formVisibleSiging, submitting },
      onCancel,
    } = this.props;

    return (
      <Modal
        title="查看详情"
        width={873}
        visible={formVisibleSiging}
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
export default ContractSigningShow;
