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
  TreeSelect,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import styles from './ContractChange.less';
import DesignChangeDetail from './DesignChangeDetail';
import DesignChangeShow from './DesignChangeShow';
import ContractChangeBotTable from './ContractChangeBotTable';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import DicShow from '@/components/DictionaryNew/DicShow';
import { getSigingOne } from '@/services/contractSiging';
import DesignSureDetail from './DesignSureDetail';
import moment from 'moment';
const FormItem = Form.Item;
@connect(state => ({
  designChange: state.designChange,
  loading: state.loading.models.designChange,
}))
@Form.create()
class DesignChangeList extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    contract_name: '',
    selectData:[]
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // 查询
  handleSearchFormSubmit = e => {
    if (e) {
      e.preventDefault();
    }

    const { form } = this.props;
    const { contract_name } = this.state;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }
      const {
        designChange: { proID },
      } = this.props;
      const formData = { ...values };
      formData.contract_name = contract_name;

      this.dispatch({
        type: 'designChange/fetchDesignChange',
        payload: {
          search: formData,
          pagination: {},
          proID: proID,
        },
      });
      //this.clearSelectRows();
    });
  };

  // 新增合同
  handleAddContractClick = () => {
    const { proID } = this.props;
    if (!proID) {
      message.warning('请先选择当前项目，进行相应的数据操作');
    } else {
      this.dispatch({
        type: 'designChange/loadDesignChangeForm',
        payload: {
          type: 'A',
          proID: proID,
        },
      });
    }
  };
  // 编辑合同界面
  handleEditClick = item => {
    // const { proID } = this.props;
    const proID = item.project_id;
    if (!proID) {
      message.warning('请先选择当前项目，进行相应的数据操作');
    } else {
      this.dispatch({
        type: 'designChange/loadDesignChangeForm',
        payload: {
          type: 'E',
          id: item.record_id,
          proID: proID,
        },
      });
    }
  };

  // 提交审核
  handleCommitClick = item => {
    this.dispatch({
      type: 'designChange/commitDesignChangeForm',
      payload: {
        id: item.record_id,
      },
    });
    this.clearSelectRows();
  };

  // 重置
  onResetFormClick = () => {
    const {
      form,
      designChange: { proID },
    } = this.props;
    form.resetFields();
    this.dispatch({
      type: 'designChange/fetchDesignChange',
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
  };

  handleTableChange = pagination => {
    const {
      designChange: { proID },
    } = this.props;
    this.dispatch({
      type: 'designChange/fetchDesignChange',
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

  // 取消关闭合同页面
  handleDataFormCancel = () => {
    this.dispatch({
      type: 'designChange/changeFormVisibleDesignChange',
      payload: false,
    });
  };
  // 保存变更合同
  handleDataFormSubmit = data => {
    this.dispatch({
      type: 'designChange/submitDesignChange',
      payload: data,
    });
    this.clearSelectRows();
  };

  // 查看单个合同信息
  handleSeeClick = item => {
    this.dispatch({
      type: 'designChange/loadDesignChangeForm',
      payload: {
        type: 'S',
        id: item.record_id,
      },
    });
  };

  // 渲染新增页面还是编辑页面还是查看页面
  renderDataForm() {
    const {
      designChange: { formTypeDesignChange },
    } = this.props;

    if (formTypeDesignChange !== 'S') {
      return (
        <DesignChangeDetail
          formTypeDesignChange={formTypeDesignChange}
          onCancel={this.handleDataFormCancel}
          onSubmit={this.handleDataFormSubmit}
        />
      );
    } else {
      return <DesignChangeShow onCancel={this.handleDataFormCancel} />;
    }
  }
  // 原合同选择的数据
  toOriginContractSelect = data => {
    if (!data) {
      return [];
    }
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = { ...data[i], title: data[i].name, value: data[i].record_id };
      newData.push(item);
    }
    return newData;
  };
  // 合同名称选中之后的变化
  toOriginSelect = item => {
    getSigingOne({
      record_id: item,
    }).then(data => {
      this.setState({ contract_name: data.name });
    });
  };
  // 删除合同
  handleDelClick = item => {
    Modal.confirm({
      title: `确定删除【设计变更数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, item.record_id),
    });
  };
  // 删除合同
  handleDelOKClick(id) {
    this.dispatch({
      type: 'designChange/delDesignChange',
      payload: { record_id: id },
    });
    this.clearSelectRows();
  }

  // 签证确认取消
  handleFormVisibleDesignSureFormCancel = () => {
    this.dispatch({
      type: 'designChange/changeFormVisibleDesignSure',
      payload: false,
    });
  };
  // 保存签证确认页面
  handleFormVisibleDesignSureFormSubmit = data => {
    this.dispatch({
      type: 'designChange/submitSureDesignChange',
      payload: {
        data,
        id: data.record_id,
      },
    });
    this.clearSelectRows();
  };

  // 签证确认
  handleDesignSureClick = item => {
    this.setState({ selectData: item });
    this.dispatch({
      type: 'designChange/changeFormVisibleDesignSure',
      payload: true,
    });
  };

  // 签证确认页面弹出
  renderDesignSureForm() {
    const {
      designChange: { formVisibleDesignSure, formDataDesignChange },
    } = this.props;
    const { selectData } = this.state;
    return (
      <DesignSureDetail
        data={selectData}
        visible={formVisibleDesignSure}
        onCancel={this.handleFormVisibleDesignSureFormCancel}
        onSubmit={this.handleFormVisibleDesignSureFormSubmit}
      />
    );
  }

  // 查询条件
  renderSearchForm() {
    const {
      form: { getFieldDecorator },
      designChange: { treeOriginConData },
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
            <Form.Item {...formItemLayout} label="变更主题名称">
              {getFieldDecorator('name')(<Input placeholder="请输入变更主题名称" />)}
            </Form.Item>
          </Col>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="设计编号">
              {getFieldDecorator('sn')(<Input placeholder="请输入设计编号" />)}
            </Form.Item>
          </Col>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="合同名称">
              {getFieldDecorator('contract_name')(
                <TreeSelect
                  showSearch
                  treeNodeFilterProp="title"
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.toOriginContractSelect(treeOriginConData)}
                  onSelect={this.toOriginSelect}
                  placeholder="请选择"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...col}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  搜索
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
      designChange: {
        formTypeDesignChange,
        dataDesignChange: { list, pagination },
      },
    } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;
    const columns = [
      {
        title: '设计变更主题名称',
        dataIndex: 'name',
        width: 250,
      },
      {
        title: '设计变更编号',
        dataIndex: 'sn',
        width: 200,
      },
      {
        title: '合同编号',
        dataIndex: 'comcontract_sn',
        width: 200,
      },
      {
        title: '合同名称',
        dataIndex: 'comcontract_name',
        width: 250,
      },
      {
        title: '预算金额',
        dataIndex: 'estimate',
        width: 150,
      },
      {
        title: '审定金额',
        dataIndex: 'sex',
        width: 150,
      },
      {
        title: '发起日期',
        dataIndex: 'launch_date',
        width: 140,
        render: (text, record) => {
          return (
            <div style={{ textAlign: 'center' }}>
              {record.launch_date === null ? '' : moment(record.launch_date).format('YYYY-MM-DD')}
            </div>
          );
        },
      },
      {
        title: '发起人',
        dataIndex: 'launch_person',
        width: 140,
      },
      {
        title: '审核状态',
        dataIndex: 'status',
        width: 100,
        render: val => {
          let value = val.toString();
          return <DicShow pcode="contract$#ChangeStatus" code={[value]} />;
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
              <PButton
                code="add"
                icon="plus"
                type="primary"
                onClick={() => this.handleAddContractClick()}
              >
                添加设计变更
              </PButton>
              {selectedRows.length === 1 && [
                <PButton key="see" code="see" onClick={() => this.handleSeeClick(selectedRows[0])}>
                  查看
                </PButton>,
              ]}
              {selectedRows.length === 1 &&
                selectedRows[0].status !== 1 && [
                  <PButton
                    key="edit"
                    code="edit"
                    icon="edit"
                    onClick={() => this.handleEditClick(selectedRows[0])}
                  >
                    编辑
                  </PButton>,
                  <PButton
                    key="del"
                    code="del"
                    icon="delete"
                    type="danger"
                    onClick={() => this.handleDelClick(selectedRows[0])}
                  >
                    删除
                  </PButton>,
                  <PButton
                    key="commit"
                    code="commit"
                    type="primary"
                    onClick={() => this.handleCommitClick(selectedRows[0])}
                  >
                    提交审核
                  </PButton>,
                ]}
              {selectedRows.length === 1 &&
                selectedRows[0].status === 2 && [
                  <PButton
                    key="designSure"
                    code="designSure"
                    type="primary"
                    onClick={() => this.handleDesignSureClick(selectedRows[0])}
                  >
                    设计变更确认
                  </PButton>,
                ]}
            </div>
            <div>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: this.handleTableSelectRow,
                }}
                rowKey={record => record.record_id}
                dataSource={list}
                columns={columns}
                pagination={paginationProps}
                onChange={this.handleTableChange}
                size="small"
                scroll={{ x: 1100 }}
              ></Table>
            </div>
          </div>
          {this.renderDataForm()}
          {this.renderDesignSureForm()}
        </Card>
        <ContractChangeBotTable></ContractChangeBotTable>
      </div>
    );
  }
}
export default DesignChangeList;
