import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Button, Card } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './ContractChange.less';
const { Description } = DescriptionList;
import DicShow from '@/components/DictionaryNew/DicShow';
import moment from 'moment';

// 取得字典值对应的值
function arrCon(arrL, arr) {
  let arrName = '';
  arrL.forEach(el => {
    if (arr && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (el.value === arr[i]) {
          arrName += el.label;
          arrName += '，';
        }
      }
    }
  });
  return arrName.substring(0, arrName.length - 1);
}

@connect(state => ({
  visaChange: state.visaChange,
}))
@Form.create()
class VisaChangeShow extends PureComponent {
  renderFirstView = () => {
    const {
      visaChange: { formDataVisaChange, visaChangeList, porjectList },
    } = this.props;
    const attas = formDataVisaChange.attas ? formDataVisaChange.attas : [];
    return (
      <div className={styles.main}>
        <div className={styles.form}>
          <Card title="基本信息" style={{ marginBottom: 20 }}>
            <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
              <Description term="签证编号">{formDataVisaChange.sn}</Description>
              <Description term="申请签证变更主题名称">{formDataVisaChange.name}</Description>
              <Description term="合同名称">{formDataVisaChange.comcontract_name}</Description>
              <Description term="合同编号">{formDataVisaChange.comcontract_sn}</Description>
              <Description term="施工单位">{formDataVisaChange.working_name}</Description>
              <Description term="监理单位">{formDataVisaChange.supervision_name}</Description>
              <Description term="签证类型">
                {' '}
                {
                  <DicShow
                    pcode="contract$#SignType"
                    code={[formDataVisaChange.alter_sign_type]}
                    show={name}
                  />
                }
              </Description>
              <Description term="分部工程名称">{formDataVisaChange.subsection_name}</Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
              <Description term="签证原因">
                {arrCon(visaChangeList, formDataVisaChange.reason)}
              </Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
              <Description term="设计变更名称">{formDataVisaChange.alter_design_name}</Description>
              <Description term="设计变更编号">{formDataVisaChange.alter_design_sn}</Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
              <Description term="其他原因">{formDataVisaChange.reason_other}</Description>
              <Description term="签证内容">{formDataVisaChange.content}</Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
              <Description term="签证报价">{formDataVisaChange.estimate}</Description>
              <Description term="施工单位负责人">
                {formDataVisaChange.working_company_charge}
              </Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
              <Description term="项目阶段">
                {arrCon(porjectList, formDataVisaChange.project_stage)}
              </Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 20 }}>
              <Description term="发起部门">
                {' '}
                {
                  <DicShow
                    pcode="contract$#InitiatingDepartment"
                    code={[formDataVisaChange.launch_dept]}
                    show={name}
                  />
                }
              </Description>
              <Description term="发起人">{formDataVisaChange.launch_person}</Description>
              <Description term="发起日期">
                {moment(formDataVisaChange.launch_date).format('YYYY-MM-DD')}
              </Description>
            </DescriptionList>
          </Card>
          <Card title="监理与现场部信息" style={{ marginBottom: 20 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 20 }}>
              <Description term="监理单位意见"></Description>
              <Description term="初审意见">上报审批</Description>
              <Description term="是否设计出图">
                {formDataVisaChange.shejitu === 1 ? '是' : '否'}
              </Description>
              <Description term="现场项目部意见"></Description>
              <Description term="成本增减">
                {
                  <DicShow
                    pcode="contract$#IncreaseDecrease"
                    code={[formDataVisaChange.xianchangchengben]}
                    show={name}
                  />
                }
              </Description>
              <Description term="估算金额">{formDataVisaChange.xianchanggusuan}</Description>
            </DescriptionList>
          </Card>
          <Card title="其他信息">
            <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
              <Description term="备注">{formDataVisaChange.remark}</Description>
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
