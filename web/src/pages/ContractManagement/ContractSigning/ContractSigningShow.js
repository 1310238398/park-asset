import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Button, TreeSelect } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './ContractSigning.less';
const { Description } = DescriptionList;
import DicShow from '@/components/DictionaryNew/DicShow';
@connect(state => ({
  contractSiging: state.contractSiging,
}))
@Form.create()
class ContractSigningShow extends PureComponent {
  renderFirstView = () => {
    const {
      contractSiging: { formDataSiging, treeData, treeOriginConData, planName },
    } = this.props;
    const attas = formDataSiging.attas ? formDataSiging.attas : [];
    return (
      <div className={styles.showMain}>
        <div className={styles.showForm}>
          <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
            <Description term="合同编号">{formDataSiging.sn}</Description>
            {formDataSiging.parent_comcontract_name ? (
              <Description term="原合同名称">{formDataSiging.parent_comcontract_name}</Description>
            ) : null}
            <Description term="合同名称"> {formDataSiging.name}</Description>
            <Description term="合同类别">
              {
                <DicShow
                  pcode="contract$#contractType"
                  code={[formDataSiging.category]}
                  show={name}
                />
              }
            </Description>
          </DescriptionList>
          <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
            {/* {formDataSiging.parent_comcontract_name ? (
              <Description term="选择合约规划"> {formDataSiging.contract_planning_id}</Description>
            ) : ( */}
              <Description term="选择合约规划"> {planName}</Description>
            {/* )} */}
          </DescriptionList>
          <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
            <Description term="所属科目"> {formDataSiging.subject}</Description>
            <Description term="所属科目分项"> {formDataSiging.subject_subitem}</Description>
            <Description term="合同金额"> {formDataSiging.amount}元</Description>
            <Description term="是否还有并列合同">
              {formDataSiging.contract_planning_done === 0 ? '否' : '是'}
            </Description>
            <Description term="合同性质">
              {
                <DicShow
                  pcode="contract$#contractNature"
                  code={[formDataSiging.property]}
                  show={name}
                />
              }
            </Description>
            <Description term="是否结算">
              {formDataSiging.settlement === 0 ? '否' : '是'}
            </Description>
            <Description term="虚拟合同"> {formDataSiging.virtual === 0 ? '否' : '是'}</Description>
            <Description term="有效签约金额"> {formDataSiging.vali_sign_amount}元</Description>
            <Description term="甲方单位">{formDataSiging.jiafang_name}</Description>
            <Description term="负责人"> {formDataSiging.jiafang_sign}</Description>
            <Description term="乙方单位">{formDataSiging.yifang_name}</Description>
            <Description term="负责人"> {formDataSiging.yifang_sign}</Description>
            <Description term="丙方单位">{formDataSiging.bingfang_name}</Description>
            <Description term="负责人"> {formDataSiging.bingfang_sign}</Description>
            <Description term="不记成本金额"> {formDataSiging.uncost_amount}元</Description>
            <Description term="甲供材料金额"> {formDataSiging.jia_stuffs_amount}元</Description>
            <Description term="付款方式">
              {
                <DicShow
                  pcode="contract$#PaymentMethod"
                  code={[formDataSiging.pay_type]}
                  show={name}
                />
              }
            </Description>
          </DescriptionList>
          <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
            <Description term="付款条件">{formDataSiging.pay_precondition}</Description>
            <Description term="合同内容">{formDataSiging.content}</Description>
            <Description term="备注">{formDataSiging.remark}</Description>
            <Description term="附件信息">
              {attas && attas.length ? (
                <div>
                  {attas.map((item, index) => (
                    <a href={item.url} target="_blank" key={index}>
                      {item.name}
                    </a>
                  ))}
                </div>
              ) : null}
            </Description>
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
