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
import styles from './ContractSigning.less';
import ContractSigningDetail from './ContractSigningDetail';
import ContractSupplementDetail from './ContractSupplementDetail';
import ContractSigningShow from './ContractSigningShow';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import DicShow from '@/components/DictionaryNew/DicShow';
import moment from 'moment';
@connect(state => ({
  contractSiging: state.contractSiging,
  loading: state.loading.models.contractSiging,
}))
@Form.create()
class DraftContract extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

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

    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }
      const {
        contractSiging: { proID },
      } = this.props;
      const formData = { ...values };

      this.dispatch({
        type: 'contractSiging/fetchSiging',
        payload: {
          search: formData,
          pagination: {},
          proID: proID,
        },
      });
      this.clearSelectRows();
    });
  };

  // 新增合同
  handleAddContractClick = () => {
    const { proID } = this.props;
    if (!proID) {
      message.warning('请先选择当前项目，进行相应的数据操作');
    } else {
      this.dispatch({
        type: 'contractSiging/loadSigingForm',
        payload: {
          type: 'A',
          proID: proID,
        },
      });
    }
  };
  // 编辑合同界面
  handleEditClick = item => {
    const proID = item.project_id;
    if (!proID) {
      message.warning('请先选择当前项目，进行相应的数据操作');
    } else {
      if (!item.parent_comcontract_name) {
        this.dispatch({
          type: 'contractSiging/loadSigingForm',
          payload: {
            type: 'E',
            id: item.record_id,
            proID: proID,
          },
        });
      } else {
        this.dispatch({
          type: 'contractSiging/loadSupplementForm',
          payload: {
            type: 'E',
            id: item.record_id,
            proID: proID,
          },
        });
      }
    }
  };

  // 合同提交审核界面
  handleCommitClick = item => {
    this.dispatch({
      type: 'contractSiging/commitSigingForm',
      payload: {
        id: item.record_id,
      },
    });
  };

  // 新增补充合同
  handleAddSupplementClick = () => {
    const { proID } = this.props;
    if (!proID) {
      message.warning('请先选择当前项目，进行相应的数据操作');
    } else {
      this.dispatch({
        type: 'contractSiging/loadSupplementForm',
        payload: {
          type: 'A',
          proID: proID,
        },
      });
    }
  };

  // 编辑补充合同
  handleEditSupplementClick = item => {
    const proID = item.project_id;
    if (!proID) {
    } else {
      this.dispatch({
        type: 'contractSiging/loadSupplementForm',
        payload: {
          type: 'E',
          id: item.record_id,
          proID: proID,
        },
      });
    }
  };
  // 重置
  handleResetFormClick = () => {
    const {
      form,
      contractSiging: { proID },
    } = this.props;
    form.resetFields();

    this.dispatch({
      type: 'contractSiging/fetchSiging',
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

  // tab变化
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

  // 取消关闭合同页面
  handleDataFormCancel = () => {
    this.dispatch({
      type: 'contractSiging/saveFormTypeSiging',
      payload: '',
    });
    this.dispatch({
      type: 'contractSiging/changeFormVisibleSiging',
      payload: false,
    });
  };
  // 保存提交合同
  handleDataFormSubmit = data => {
    this.dispatch({
      type: 'contractSiging/submitSiging',
      payload: {
        data,
        type: 'siging',
      },
    });
    this.clearSelectRows();
  };
  // 取消关闭b补充合同页面
  handleSuppleDataFormCancel = () => {
    this.dispatch({
      type: 'contractSiging/saveFormTypeSupplement',
      payload: '',
    });
    this.dispatch({
      type: 'contractSiging/changeFormVisibleSupplement',
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
      contractSiging: { formTypeSiging, proID },
    } = this.props;
    if (formTypeSiging !== 'S') {
      return (
        <ContractSigningDetail
          proID={proID}
          formTypeSiging={formTypeSiging}
          onCancel={this.handleDataFormCancel}
          onSubmit={this.handleDataFormSubmit}
        />
      );
    } else {
      return <ContractSigningShow proID={proID} onCancel={this.handleDataFormCancel} />;
    }
  }

  // 保存新增补充合同
  handleSuppleDataFormSubmit = data => {
    this.dispatch({
      type: 'contractSiging/submitSiging',
      payload: {
        data,
        type: 'supple',
      },
    });
    this.clearSelectRows();
  };

  // 渲染补充合同的新增还是编辑还是查看
  renderSupplementDataForm() {
    const {
      contractSiging: { formTypeSupplement, proID },
    } = this.props;
    if (formTypeSupplement !== 'S') {
      return (
        <ContractSupplementDetail
          proID={proID}
          formTypeSupplement={formTypeSupplement}
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
      title: `确定删除【合同数据：${item.name}】？`,
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

  // 乙方单位模糊查询
  toTreeSelect = data => {
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
  // 查询条件
  renderSearchForm() {
    const {
      contractSiging: { treeData },
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
            <Form.Item {...formItemLayout} label="合同名称">
              {getFieldDecorator('name')(<Input placeholder="请输入合同名称" />)}
            </Form.Item>
          </Col>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="乙方单位">
              {getFieldDecorator('yifang')(
                <TreeSelect
                  showSearch
                  treeNodeFilterProp="title"
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.toTreeSelect(treeData)}
                  placeholder="请选择"
                />
              )}
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
                  搜索
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
        dataSiging: { list, pagination },
      },
    } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;
    const columns = [
      {
        title: '合同状态',
        dataIndex: 'status',
        width: 100,
        render: val => {
          let value = val.toString();
          return <DicShow pcode="contract$#ContractStatus" code={[value]} />;
        },
      },
      // {
      //   title: '合同编号',
      //   dataIndex: 'sn',
      // },
      {
        title: '合同名称',
        dataIndex: 'name',
      },
      {
        title: '合同类别',
        dataIndex: 'property',
        width: 150,
        render: val => {
          return <DicShow pcode="contract$#contractType" code={[val]} />;
        },
      },
      {
        title: '乙方单位',
        dataIndex: 'yifang_name',
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
                添加新合同
              </PButton>
              <PButton
                code="addSupplement"
                icon="plus"
                type="primary"
                onClick={() => this.handleAddSupplementClick()}
              >
                添加补充合同
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
                    key="delete"
                    code="delete"
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
              ></Table>
            </div>
          </div>
          {this.renderDataForm()}
          {this.renderSupplementDataForm()}
        </Card>
      </div>
    );
  }
}
export default DraftContract;
