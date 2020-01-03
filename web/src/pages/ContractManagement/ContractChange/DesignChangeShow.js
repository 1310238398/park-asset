import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Button } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './ContractChange.less';
const { Description } = DescriptionList;
import DicShow from '@/components/DictionaryNew/DicShow';
import moment from 'moment';
// 取得字典值对应的值
function arrCon(arrL,arr) {
  let arrName = '';
  arrL.forEach(el => {
    if(arr&&arr.length>0){
      for(let i=0;i<arr.length;i++){
        if(el.value ===arr[i]){
          arrName +=el.label;
          arrName +='，';
        }
      }
    }
  });
    return arrName.substring(0, arrName.length - 1);
}

@connect(state => ({
  designChange: state.designChange,
}))
@Form.create()
class DesignChangeShow extends PureComponent {
  renderFirstView = () => {
    const {
      designChange: { formDataDesignChange,changeList },
    } = this.props;
    const attas = formDataDesignChange.attas ? formDataDesignChange.attas : [];
    return (
      <div className={styles.main}>
        <div className={styles.form}>
          <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
            <Description term="变更编号">{formDataDesignChange.sn}</Description>
            <Description term="申请变更主题名称">{formDataDesignChange.name}</Description>
            <Description term="合同名称">{formDataDesignChange.comcontract_name}</Description>
            <Description term="合同编号">{formDataDesignChange.comcontract_sn}</Description>
            <Description term="发起部门">
            {
                <DicShow
                  pcode="contract$#InitiatingDepartment"
                  code={[formDataDesignChange.launch_dept]}
                  show={name}
                />
              }
            </Description>
            <Description term="发起人">{formDataDesignChange.launch_person}</Description>
          </DescriptionList>
          <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
            <Description term="变更部位">{formDataDesignChange.modify_position}</Description>
            <Description term="变更原因">{arrCon(changeList,formDataDesignChange.reason)}</Description>
            <Description term="其他原因">{formDataDesignChange.reason_other}</Description>
            <Description term="变更内容">{formDataDesignChange.content}</Description>
          </DescriptionList>
          <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
            <Description term="成本增减">
              {
                <DicShow
                  pcode="contract$#IncreaseDecrease"
                  code={[formDataDesignChange.cost_change]}
                  show={name}
                />
              }
            </Description>
            <Description term="估算金额">{formDataDesignChange.estimate}</Description>
            <Description term="是否施工">
              {formDataDesignChange.working_state === 1 ? '已施工' : '未施工'}
            </Description>
            <Description term="是否已采购">
              {formDataDesignChange.purchase_state === 1 ? '已采购' : '未采购'}
            </Description>
            <Description term="费用变化初判">
              {formDataDesignChange.cost_initial === 1 ? '是' : '否'}
            </Description>
            <Description term="是否需报批">
              {formDataDesignChange.need_check === 1 ? '是' : '否'}
            </Description>
            <Description term="发起日期">{moment(formDataDesignChange.launch_date).format('YYYY-MM-DD')}</Description>
            <Description term="变更类型">
              {
                <DicShow
                  pcode="contract$#changeType"
                  code={[formDataDesignChange.alter_type]}
                  show={name}
                />
              }
            </Description>
          </DescriptionList>
          <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
            <Description term="备注">{formDataDesignChange.remark}</Description>
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
