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
const FormItem = Form.Item;
@connect(state => ({
  contractSiging: state.contractSiging,
  contractSupplement: state.contractSupplement,
  loading: state.loading.models.contractSiging,
}))
@Form.create()
class DraftContract extends PureComponent {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  componentDidMount() {
    const {
      contractSiging: { formID, proID },
    } = this.props;
    console.log(this.props);
    this.dispatch({
      type: 'contractSiging/fetchSiging',
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
        type: 'contractSiging/fetchSiging',
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
        data: { list, pagination },
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
    console.log(this.props);
    const { proID } = this.props;
    if (!proID) {
      message.warning('请先选择当前项目，进行相应的数据操作');
    } else {
      this.dispatch({
        type: 'contractSiging/loadSigingForm',
        payload: {
          type: 'A',
          proID:proID
        },
      });
    }
  };
  // 编辑合同界面
  handleEditClick = item => {
    const  proID  = item.project_id;
    if(!proID){

    }else{
      this.dispatch({
        type: 'contractSiging/loadSigingForm',
        payload: {
          type: 'E',
          id: item.record_id,
          proID: proID
        },
      });
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
        type: 'contractSupplement/loadSupplementForm',
        payload: {
          type: 'A',
        },
      });
    }
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
      type: 'contractSiging/fetchSiging',
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
      type: 'contractSiging/fetchSiging',
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

  // 取消关闭合同页面
  handleDataFormCancel = () => {
    this.dispatch({
      type: 'contractSiging/changeFormVisibleSiging',
      payload: false,
    });
  };
  // 保存提交合同
  handleDataFormSubmit = data => {
    console.log(data)
    this.dispatch({
      type: 'contractSiging/submitSiging',
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
      contractSiging: { formTypeSiging , proID },
    } = this.props;
    console.log(this.props)
    console.log(proID)
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

  // 乙方单位模糊查询
  toTreeSelect = data => {
    console.log(data);
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
              {getFieldDecorator('cate')(
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
        width: 100,
        render: val => {
          return <DicShow pcode="contract$#ContractStatus" code={[val]} />;
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
        render: val => {
          return <DicShow pcode="contract$#contractType" code={[val]} />;
        },
      },
      {
        title: '乙方单位',
        dataIndex: 'yifang',
      },
      {
        title: '签订日期',
        dataIndex: 'created_at',
        width: 120,
        render: (text, record) => {
          return (
            <div style={{ textAlign: 'center' }}>
              { record.created_at === null ? "":
              moment(record.created_at).format('YYYY-MM-DD')}
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
