import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
  Card,
  Col,
  Input,
  Modal,
  Dropdown,
  Popconfirm,
  Select,
  Radio,
  Table,
  message,
  Divider,
  Button,
  InputNumber,
  Tabs,
} from 'antd';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import styles from './ContractSigning.less';
import ContractSigningDetail from './ContractSigningDetail';
import ContractSupplementDetail from './ContractSupplementDetail';
import ContractSigningShow from './ContractSigningShow';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import DicShow from '@/components/DictionaryNew/DicShow';
import ContractSettlementDetail from './ContractSettlementDetail';
import ContractTakeEffectDetail from './ContractTakeEffectDetail';
import PaymentInformation from './PaymentInformation';
import FinancialInformation from './FinancialInformation';
import ContractSettlement from './ContractSettlement';
import DesignChange from './DesignChange';
import VisaChange from './VisaChange';
import MaterialPricing from './MaterialPricing';
import OtherInformation from './OtherInformation';
import { func } from 'prop-types';
const { TabPane } = Tabs;
@connect(state => ({
  contractSiging: state.contractSiging,
  loading: state.loading.models.contractSiging,
}))
@Form.create()
class ContractSigningView extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    selectData: [],
  };

  componentDidMount() {}

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // 查寻条件
  handleSearchFormSubmit = e => {
    if (e) {
      e.preventDefault();
    }

    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }
      const {
        contractSiging: { proID },
      } = this.props;
      const formData = { ...values };

      this.dispatch({
        type: 'contractSiging/fetchContractList',
        payload: {
          search: formData,
          pagination: {},
          proID: proID,
        },
      });
      //this.clearSelectRows();
    });
  };

  // 重置
  handleResetFormClick = () => {
    const {
      form,
      contractSiging: { proID },
    } = this.props;
    form.resetFields();

    this.dispatch({
      type: 'contractSiging/fetchContractList',
      payload: {
        search: {},
        pagination: {},
        proID: proID,
      },
    });
  };

  // 选择checkbox 事件
  handleTableSelectRow = (keys, rows) => {
    this.setState({
      selectedRowKeys: keys,
      selectedRows: rows,
    });
    this.dispatch({
      type: 'contractSiging/fetchDesiginOneSiging',
      payload: keys[keys.length - 1],
    });
  };

  // tab change
  handleTableChange = pagination => {
    const {
      contractSiging: { proID },
    } = this.props;
    this.dispatch({
      type: 'contractSiging/fetchSiging',
      payload: {
        pagination: {
          current: pagination.current,
          pageSize: pagination.pageSize,
        },
        search: {},
        proID: proID,
      },
    });
    this.clearSelectRows();
  };
  // 取消选中的复选框
  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  // 合同生效
  handleTakeffectClick = item => {
    this.dispatch({
      type: 'contractSiging/changeFormVisibleTakeEffect',
      payload: true,
    });
    this.dispatch({
      type: 'contractSiging/saveLoadTakeEffect',
      payload: item,
    });
  };
  // 合同生效
  handleFormVisibleTakeEffectFormCancel = () => {
    this.dispatch({
      type: 'contractSiging/changeFormVisibleTakeEffect',
      payload: false,
    });
  };

  // 渲染合同生效页面
  renderTakeffectForm() {
    const {
      contractSiging: { formVisibleTakeEffect, loadTakeEffectData },
    } = this.props;
    return (
      <ContractTakeEffectDetail
        data={loadTakeEffectData}
        visible={formVisibleTakeEffect}
        onCancel={this.handleFormVisibleTakeEffectFormCancel}
        onSubmit={this.handleFormVisibleTakeEffectFormSubmit}
      />
    );
  }
  // 合同生效
  handleFormVisibleTakeEffectFormSubmit = data => {
    this.dispatch({
      type: 'contractSiging/EntryContract',
      payload: {
        record_id: data.record_id,
        data,
      },
    });
    this.clearSelectRows();
  };

  // 合同结算
  handleSettlementtClick = item => {
    this.dispatch({
      type: 'contractSiging/changeFormVisibleSettlement',
      payload: true,
    });
    this.dispatch({
      type: 'contractSiging/saveLoadTakeEffect',
      payload: item,
    });
  };

  // 渲染合同结算页面
  renderSettlementForm() {
    const {
      contractSiging: { formVisibleSettlement, loadTakeEffectData, dataSupplement },
    } = this.props;
    return (
      <ContractSettlementDetail
        dataSupplement={dataSupplement}
        visible={formVisibleSettlement}
        onCancel={this.handleSettlementFormCancel}
        onSubmit={this.handleSettlementFormSubmit}
      />
    );
  }
  // 合同结算
  handleSettlementFormSubmit = data => {
    const {
      contractSiging: { loadTakeEffectData },

    } = this.props;
    this.dispatch({
      type: 'contractSiging/settlementSave',
      payload: {
        data,
        record_id: loadTakeEffectData.record_id,
      },
    });
  };

  // 取消关闭合同结算页面
  handleSettlementFormCancel = () => {
    this.dispatch({
      type: 'contractSiging/changeFormVisibleSettlement',
      payload: false,
    });
  };

  // 取消关闭合同页面
  handleDataFormCancel = () => {
    this.dispatch({
      type: 'contractSiging/changeFormVisibleSiging',
      payload: false,
    });
    
  };


  // 查看单个合同信息
  handleSeeClick = item => {
    const proID = item.project_id;
    this.dispatch({
      type: 'contractSiging/loadSigingForm',
      payload: {
        type: 'S',
        id: item.record_id,
        proID: proID,
      },
    });
  };

  // 渲染新增页面还是编辑页面还是查看页面
  renderDataForm() {
    const {
      contractSiging: { formTypeSiging,proID },
    } = this.props;

    if (formTypeSiging !== 'S') {
    } else {
      return <ContractSigningShow  proID={proID}  onCancel={this.handleDataFormCancel} />;
    }
  }

  // 删除合同
  handleDelClick = item => {
    Modal.confirm({
      title: `确定删除【项目数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, item.record_id),
    });
  };
  // 删除合同
  handleDelOKClick(id) {
    this.dispatch({
      type: 'contractSiging/delSiging',
      payload: { record_id: id },
    });
    this.clearSelectRows();
  }

  // 查询条件
  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 6 },
        lg: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 6 },
        lg: { span: 12 },
      },
    };
    const col = {
      sm: 24,
      md: 6,
    };
    return (
      <Form onSubmit={this.handleSearchFormSubmit} layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={16}>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="合同编号">
              {getFieldDecorator('sn')(<Input placeholder="请输入合同编号" />)}
            </Form.Item>
          </Col>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="合同名称">
              {getFieldDecorator('name')(<Input placeholder="请输入合同名称" />)}
            </Form.Item>
          </Col>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="合同类别">
              {getFieldDecorator('category')(
                <DicSelect
                  vmode="string"
                  pcode="contract$#contractType"
                  placeholder="请选择"
                  selectProps={{ placeholder: '请选择合同类别' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...col}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleResetFormClick}>
                  重置
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const {
      loading,
      form: { getFieldDecorator },
      contractSiging: {
        formTypeSiging,
        dataConSiging: { list, pagination },
        desiginData,
      },
    } = this.props;
    let design = Object.keys(desiginData).length;
    const { selectedRowKeys, selectedRows } = this.state;

    const columns = [
      {
        title: '合同状态',
        dataIndex: 'status',
        width: 140,
        fixed: 'left',
        render: val => {
          let value = val.toString();
          return <DicShow pcode="contract$#ContractStatus" code={[value]} />;
        },
      },
      {
        title: '合同编号',
        dataIndex: 'sn',
        width: 150,
      },
      {
        title: '合同名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '合同类别',
        dataIndex: 'category',
        width: 200,
        render: val => {
          return <DicShow pcode="contract$#contractType" code={[val]} />;
        },
      },
      {
        title: '合同额（不含甲供）',
        dataIndex: '',
        width: 200,
        render: (text, record) => {
          const amount = record.amount;
          const jia_stuffs_amount = record.jia_stuffs_amount;
          return <div>{amount - jia_stuffs_amount}</div>;
        },
      },

      {
        title: '乙方单位',
        dataIndex: 'jiafang_name',
        width: 200,
      },
      {
        title: '签订日期',
        dataIndex: 'created_at',
        width: 120,
        render: (text, record) => {
          return (
            <div style={{ textAlign: 'center' }}>
              {record.created_at === null ? '' : moment(record.created_at).format('YYYY-MM-DD')}
            </div>
          );
        },
      },
      {
        title: '结算金额（不含甲供）',
        dataIndex: 'settlement_amount',
        width: 200,
      },
      {
        title: '累计付款',
        dataIndex: '',
        width: 150,
        render: (text, record) => {
          return <div>{record.settlement_amount}</div>;
        },
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length === 1 && [
                <PButton
                  key="see"
                  code="see"
                  type="primary"
                  onClick={() => this.handleSeeClick(selectedRows[0])}
                >
                  详情
                </PButton>,
              ]}
              {selectedRows.length === 1 &&
                selectedRows[0].settlement === 1 &&
                selectedRows[0].status === 5 && [
                  <PButton
                    key="settlement"
                    code="settlement"
                    type="primary"
                    onClick={() => this.handleSettlementtClick(selectedRows[0])}
                  >
                    结算
                  </PButton>,
                ]}
              {selectedRows.length === 1 &&
                selectedRows[0].status === 3 && [
                  <PButton
                    key="takeffect"
                    code="takeffect"
                    type="primary"
                    onClick={() => this.handleTakeffectClick(selectedRows[0])}
                  >
                    生效
                  </PButton>,
                ]}
            </div>
            <div>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: this.handleTableSelectRow,
                }}
                scroll={{ x: 1300, y: 300 }}
                rowKey={record => record.record_id}
                dataSource={list}
                columns={columns}
                className={styles.planingtable}
                pagination={paginationProps}
                onChange={this.handleTableChange}
                size="small"
              ></Table>
            </div>
          </div>
          {this.renderDataForm()}
          {this.renderSettlementForm()}
          {this.renderTakeffectForm()}
        </Card>
        <Card>
          <Tabs defaultActiveKey="1">
            <TabPane tab="审批流程" key="1">
              待定
            </TabPane>
            <TabPane tab="付款信息" key="2">
              <PaymentInformation />
            </TabPane>
            <TabPane tab="财务信息" key="3">
              <FinancialInformation />
            </TabPane>
            <TabPane tab="签证变更" key="4">
              <VisaChange data={design > 0 ? desiginData[0].visaData : []} />
            </TabPane>
            <TabPane tab="设计变更" key="5">
              <DesignChange data={design > 0 ? desiginData[0].designData : []} />
            </TabPane>
            <TabPane tab="材料批价" key="6">
              <MaterialPricing data={design > 0 ? desiginData[0].materialData : []} />
            </TabPane>
            <TabPane tab="合同结算" key="7">
              <ContractSettlement data={design>0?desiginData[0].settlementData:[]}/>
            </TabPane>
            {/* <TabPane tab="其他信息" key="8">
              <OtherInformation></OtherInformation>
            </TabPane> */}
          </Tabs>
        </Card>
      </div>
    );
  }
}
export default ContractSigningView;
