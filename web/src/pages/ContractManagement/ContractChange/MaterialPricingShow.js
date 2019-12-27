import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Button, Card, Table } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './ContractChange.less';
const { Description } = DescriptionList;
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
  materialPricing: state.materialPricing,
}))

@Form.create()
class MaterialPricingShow extends PureComponent {
  renderFirstView = () => {
    const {
      materialPricing: { formDataMaterialPricing,materialPricingList },
    } = this.props;
    const attas = formDataMaterialPricing.attas ? formDataMaterialPricing.attas : [];
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        editable: true,
        width: 250,
      },
      {
        title: '规格型号',
        dataIndex: 'specification',
        editable: true,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        editable: true,
      },
      {
        title: '估量',
        dataIndex: 'count',
        editable: true,
      },
      {
        title: '施工单位报价',
        dataIndex: 'quote_w',
        editable: true,
      },
      {
        title: '建设单位批价',
        dataIndex: 'quote_c',
        editable: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        editable: true,
      },
    ];
    return (
      <div className={styles.main}>
        <div className={styles.form}>
          <Card title="基本信息" style={{ marginBottom: 20 }}>
            <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
              <Description term="申请材料批价名称">{formDataMaterialPricing.name}</Description>
              <Description term="批价编号">{formDataMaterialPricing.sn}</Description>
              <Description term="合同名称">{formDataMaterialPricing.comcontract_name}</Description>
              <Description term="合同编号">{formDataMaterialPricing.comcontract_sn}</Description>
              <Description term="施工单位">{formDataMaterialPricing.working_name}</Description>
              <Description term="工程名称">{formDataMaterialPricing.project_name}</Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
              <Description term="批价原因">{arrCon(materialPricingList,formDataMaterialPricing.reason)}</Description>
              <Description term="其他原因">{formDataMaterialPricing.reason_other}</Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={2} style={{ marginBottom: 20 }}>
              <Description term="设计变更名称">
                {formDataMaterialPricing.alter_design_name}
              </Description>
              <Description term="设计变更编号">
                {formDataMaterialPricing.alter_design_sn}
              </Description>
              <Description term="签证变更名称">
                {formDataMaterialPricing.alter_sign_name}
              </Description>
              <Description term="签证变更编号">{formDataMaterialPricing.alter_sign_sn}</Description>
              <Description term="发起部门"> {
                <DicShow
                  pcode="contract$#InitiatingDepartment"
                  code={[formDataMaterialPricing.launch_dept]}
                  show={name}
                />
              }</Description>
              <Description term="发起人">{formDataMaterialPricing.launch_person}</Description>
              <Description term="发起日期">{moment(formDataMaterialPricing.launch_date).format('YYYY-MM-DD')}</Description>
            </DescriptionList>
            <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
            <Description term="规格说明"></Description>
            </DescriptionList>
            <Table
              columns={columns}
              dataSource={formDataMaterialPricing.quotes}
              pagination={false}
              size="small"
              scroll={{ x: 1100, y: 240 }}
            />
          </Card>
          <Card title="其他信息">
            <DescriptionList title="" size="large" col={1} style={{ marginBottom: 20 }}>
              <Description term="备注">{formDataMaterialPricing.remark}</Description>
              <Description term="附件信息"> {attas && attas.length ? (
                <div>
                  {attas.map(item => (
                    <div>
                      <a href={item.url} target="_blank">
                        {item.name}
                      </a>
                    </div>
                  ))}
                </div>
              ) : null}</Description>
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
