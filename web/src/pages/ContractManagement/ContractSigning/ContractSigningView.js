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
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import styles from './ContractSigning.less';
import ContractSigningDetail from './ContractSigningDetail';
import ContractSupplementDetail from './ContractSupplementDetail';
import ContractSigningShow from './ContractSigningShow';
import ContractSigningTable from './ContractSigningTable';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import DicShow from '@/components/DictionaryNew/DicShow';
import ContractSettlementDetail from './ContractSettlementDetail';
import ContractTakeEffectDetail from './ContractTakeEffectDetail';
const FormItem = Form.Item;
@connect(state => ({
  contractSiging: state.contractSiging,
  contractSupplement: state.contractSupplement,
  loading: state.loading.models.contractSiging,
}))
@Form.create()
class ContractSigningView extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    const {
      contractSiging: { formID },
    } = this.props;

    this.dispatch({
      type: 'contractSiging/fetchContractList',
      search: {},
      pagination: {},
      pro_id: formID,
    });
  }

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  handleSearchFormSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    console.log('handleSearchFormSubmit');

    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }
      const {
        contractSiging: { formID },
      } = this.props;
      const formData = { ...values };
      console.log('form数据  ' + JSON.stringify(formData));

      this.dispatch({
        type: 'contractSiging/fetch',
        search: formData,
        pagination: {},
        pro_id: formID,
      });
      //this.clearSelectRows();
    });
  };

  isEditing = record => record.record_id === this.state.editingKey;

  save(form, key) {
    // key是项目业态id
    const {
      contractSiging: {
        dataConSiging: { list, pagination },
      },
    } = this.props;
    console.log('要保存数据的key ' + key);

    form.validateFields(async (error, row) => {
      if (error) {
        return;
      }
      const newData = list;

      const index = newData.findIndex(item => key === item.record_id);
      if (index > -1) {
        const item = newData[index];
        row.record_id = key;
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        let response;

        response = await updatecontractSiging(row);
        if (response.record_id && response.record_id !== '') {
          message.success('更新成功');
          this.setState({ editingKey: '' });
          this.dispatch({
            type: 'contractSiging/saveData',
            payload: {
              list: [...newData],
              pagination: pagination,
            },
          });
        }
      }
    });
  }

  deletePlan(key) {
    this.dispatch({
      type: 'contractSiging/del',
      payload: key,
    });
  }
  edit(key) {
    this.setState({ editingKey: key });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  // 新增合同
  handleAddContractClick = () => {
    this.dispatch({
      type: 'contractSiging/loadSigingForm',
      payload: {
        type: 'A',
      },
    });
  };
  // 编辑合同界面
  handleEditClick = item => {
    this.dispatch({
      type: 'contractSiging/loadSigingForm',
      payload: {
        type: 'E',
        id: item.record_id,
      },
    });
  };

  // 新增补充合同
  handleAddSupplementClick = () => {
    this.dispatch({
      type: 'contractSupplement/loadSupplementForm',
      payload: {
        type: 'A',
      },
    });
  };

  // 编辑补充合同
  handleEditSupplementClick = item => {
    this.dispatch({
      type: 'contractSupplement/loadSupplementForm',
      payload: {
        type: 'E',
        id: item.record_id,
      },
    });
  };
  handleResetFormClick = () => {
    const {
      form,
      contractSiging: { formID },
    } = this.props;
    form.resetFields();

    this.dispatch({
      type: 'contractSiging/fetch',
      search: {},
      pagination: {},
      pro_id: formID,
    });
  };

  // 选择checkbox 事件
  handleTableSelectRow = (keys, rows) => {
    this.setState({
      selectedRowKeys: keys,
      selectedRows: rows,
    });
  };

  handleTableChange = pagination => {
    const {
      contractSiging: { formID },
    } = this.props;
    this.dispatch({
      type: 'contractSiging/fetch',
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
        project_id: formID,
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
    console.log(item);
    this.dispatch({
      type: 'contractSiging/changeFormVisibleTakeEffect',
      payload: true,
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
      contractSiging: { formVisibleTakeEffect },
    } = this.props;
    console.log(this.props);
    return (
      <ContractTakeEffectDetail
        visible={formVisibleTakeEffect}
        onCancel={this.handleFormVisibleTakeEffectFormCancel}
        onSubmit={this.handleFormVisibleTakeEffectFormSubmit}
      />
    );
  }

  // 合同结算
  handleSettlementtClick = () => {
    this.dispatch({
      type: 'contractSiging/changeFormVisibleSettlement',
      payload: true,
    });
  };

  // 渲染合同结算页面
  renderSettlementForm() {
    const {
      contractSiging: { formVisibleSettlement },
    } = this.props;
    return (
      <ContractSettlementDetail
        visible={formVisibleSettlement}
        onCancel={this.handleSettlementFormCancel}
        onSubmit={this.handleSettlementFormSubmit}
      />
    );
  }

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
  // 保存提交合同
  handleDataFormSubmit = data => {
    this.dispatch({
      type: 'contractSiging/submit',
      payload: data,
    });
    this.clearSelectRows();
  };
  // 取消关闭b补充合同页面
  handleSuppleDataFormCancel = () => {
    this.dispatch({
      type: 'contractSupplement/changeFormVisibleSupplement',
      payload: false,
    });
  };

  // 查看单个合同信息
  handleSeeClick = item => {
    console.log(item);
    this.dispatch({
      type: 'contractSiging/loadSigingForm',
      payload: {
        type: 'S',
        id: item.record_id,
      },
    });
  };

  // 渲染新增页面还是编辑页面还是查看页面
  renderDataForm() {
    const {
      contractSiging: { formTypeSiging },
    } = this.props;

    if (formTypeSiging !== 'S') {
      return (
        <ContractSigningDetail
          onCancel={this.handleDataFormCancel}
          onSubmit={this.handleDataFormSubmit}
        />
      );
    } else {
      return <ContractSigningShow onCancel={this.handleDataFormCancel} />;
    }
  }

  // 渲染补充合同的新增还是编辑还是查看
  renderSupplementDataForm() {
    const {
      contractSupplement: { formTypeSupplement },
    } = this.props;

    if (formTypeSupplement !== 'S') {
      return (
        <ContractSupplementDetail
          onCancel={this.handleSuppleDataFormCancel}
          onSubmit={this.handleSuppleDataFormSubmit}
        />
      );
    } else {
      // return <contractSigingShow onCancel={this.handleDataFormCancel} />;
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
                <Button style={{ marginLeft: 8 }} onClick={this.onResetFormClick}>
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
        dataSiging: { list, pagination },
      },
    } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;
    const columns = [
      {
        title: '合同状态',
        dataIndex: 'status',
        width: 140,
        fixed: 'left',
        render: val => {
          return <DicShow pcode="contract$#ContractStatus" code={[val]} />;
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
        dataIndex: 'sex',
        width: 200,
      },

      {
        title: '乙方单位',
        dataIndex: 'tags',
        width: 200,
      },
      {
        title: '签订日期',
        dataIndex: 'date',
        width: 140,
      },
      {
        title: '结算金额（不含甲供）',
        dataIndex: 'age1',
        width: 200,
      },
      {
        title: '累计付款',
        dataIndex: 'age2',
        width: 150,
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    const data = [
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b542',
        status: 3,
        index: '合同名称11',
        name: 'John Brown',
        age: '2019-01-12',
        address: '3',
        tags: ['nice', 'developer'],
        sex: 100.09,
        date: '2019-10-12',
        age1: 233,
        age2: 3333,
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b541',
        status: 3,
        index: '合同名称2',
        name: 'Jim Green',
        age: '2019-01-12',
        address: '2',
        tags: ['loser'],
        sex: 100,
        date: '2019-10-12',
        age1: 233,
        age2: 444,
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b54e',
        status: 5,
        index: '合同名称3',
        name: 'Joe Black',
        age: '2019-01-12',
        address: '1',
        tags: ['cool', 'teacher'],
        sex: 200,
        date: '2019-10-12',
        age1: 23333,
        age2: 3333,
      },
    ];

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
                  // <PButton
                  //   key="change"
                  //   code="change"
                  //   type="primary"
                  //   onClick={() => this.handleChangeClick(selectedRows[0])}
                  // >
                  //   变更
                  // </PButton>,
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
                dataSource={data}
                columns={columns}
                className={styles.planingtable}
                pagination={paginationProps}
                onChange={this.handleTableChange}
              ></Table>
            </div>
          </div>
          {this.renderDataForm()}
          {this.renderSupplementDataForm()}
          {this.renderSettlementForm()}
          {this.renderTakeffectForm()}
        </Card>
        <ContractSigningTable></ContractSigningTable>
      </div>
    );
  }
}
export default ContractSigningView;
