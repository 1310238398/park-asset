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
import styles from './ContractChange.less';
import ContractChangeBotTable from './ContractChangeBotTable';
import MaterialPricingDetail from './MaterialPricingDetail';
import MaterialPricingShow from './MaterialPricingShow';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import DicShow from '@/components/DictionaryNew/DicShow';
const FormItem = Form.Item;
@connect(state => ({
  materialPricing: state.materialPricing,
  contractSupplement: state.contractSupplement,
  loading: state.loading.models.materialPricing,
}))
@Form.create()
class MaterialPricing extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    const {
      materialPricing: { formID },
    } = this.props;

    this.dispatch({
      type: 'materialPricing/fetch',
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
        materialPricing: { formID },
      } = this.props;
      const formData = { ...values };
      console.log('form数据  ' + JSON.stringify(formData));

      this.dispatch({
        type: 'materialPricing/fetch',
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
      materialPricing: {
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

        response = await updatematerialPricing(row);
        if (response.record_id && response.record_id !== '') {
          message.success('更新成功');
          this.setState({ editingKey: '' });
          this.dispatch({
            type: 'materialPricing/saveData',
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
      type: 'materialPricing/del',
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
      type: 'materialPricing/loadMaterialPricingForm',
      payload: {
        type: 'A',
      },
    });
  };
  // 编辑合同界面
  handleEditClick = item => {
    this.dispatch({
      type: 'materialPricing/loadMaterialPricingForm',
      payload: {
        type: 'E',
        id: item.record_id,
      },
    });
  };

  // 重置查询表单
  handleResetFormClick = () => {
    const {
      form,
      materialPricing: { formID },
    } = this.props;
    form.resetFields();

    this.dispatch({
      type: 'materialPricing/fetch',
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
      materialPricing: { formID },
    } = this.props;
    this.dispatch({
      type: 'materialPricing/fetch',
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
      type: 'materialPricing/changeFormVisibleMaterialPricing',
      payload: false,
    });
  };
  // 保存提交合同
  handleDataFormSubmit = data => {
    this.dispatch({
      type: 'materialPricing/submit',
      payload: data,
    });
    this.clearSelectRows();
  };
 

  // 查看单个合同信息
  handleSeeClick = item => {
    console.log(item);
    this.dispatch({
      type: 'materialPricing/loadMaterialPricingForm',
      payload: {
        type: 'S',
        id: item.record_id,
      },
    });
  };

  // 渲染新增页面还是编辑页面还是查看页面
  renderDataForm() {
    const {
      materialPricing: { formTypeMaterialPricing },
    } = this.props;

    if (formTypeMaterialPricing !== 'S') {
      return (
        <MaterialPricingDetail
          onCancel={this.handleDataFormCancel}
          onSubmit={this.handleDataFormSubmit}
        />
      );
    } else {
      return <MaterialPricingShow onCancel={this.handleDataFormCancel} />;
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
      type: 'materialPricing/delMaterialPricing',
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
            <Form.Item {...formItemLayout} label="施工单位">
              {getFieldDecorator('name')(<Input placeholder="请输入施工单位" />)}
            </Form.Item>
          </Col>
          <Col {...col}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                {/* <Button style={{ marginLeft: 8 }} onClick={this.onResetFormClick}>
                  重置
                </Button> */}
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
      materialPricing: {
        formTypeMaterialPricing,
        dataMaterialPricing: { list, pagination },
      },
    } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;
    const columns = [
      {
        title: '材料批价主题名称',
        width:200,
        dataIndex: 'mc',
      },
      {
        title: '材料批价申请编号',
        width:150,
        dataIndex: 'bh',
      },
      {
        title: '合同编号',
        width:150,
        dataIndex: 'sn',
      },
      {
        title: '合同名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '施工单位报价合计',
        dataIndex: 'property',
        width: 150,
      },
      {
        title: '建设单位批价',
        dataIndex: 'sex',
        width: 150,
      },
      {
        title: '发起日期',
        dataIndex: 'age',
        width: 120,
      },
      {
        title: '发起人',
        dataIndex: 'yifang',
        width: 150,
      },
      {
        title: '审核状态',
        dataIndex: 'status',
        width: 100,
        render: val => {
          return <DicShow pcode="contract$#ContractStatus" code={[val]} />;
        },
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
        status: 0,
        index: '合同名称11',
        name: 'John Brown',
        age: '2019-01-12',
        address: '4',
        tags: ['nice', 'developer'],
        sex: 100.09,
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b541',
        status: 1,
        index: '合同名称2',
        name: 'Jim Green',
        age: '2019-01-12',
        address: '2',
        tags: ['loser'],
        sex: 100,
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b54e',
        status: 2,
        index: '合同名称3',
        name: 'Joe Black',
        age: '2019-01-12',
        address: '1',
        tags: ['cool', 'teacher'],
        sex: 200,
      },
    ];
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
                添加材料审批
              </PButton>
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
                ]}
              {selectedRows.length === 1 && [
                <PButton key="see" code="see" onClick={() => this.handleSeeClick(selectedRows[0])}>
                  查看
                </PButton>,
              ]}
              {selectedRows.length === 1 &&
                selectedRows[0].status === 0 && [
                  <PButton
                    key="commit"
                    code="commit"
                    onClick={() => this.handleEditClick(selectedRows[0])}
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
                dataSource={data}
                columns={columns}
                pagination={paginationProps}
                scroll={{ x: 1300}}
                onChange={this.handleTableChange}
              ></Table>
            </div>
          </div>
          {this.renderDataForm()}
        </Card>
        <ContractChangeBotTable></ContractChangeBotTable>
      </div>
    );
  }
}
export default MaterialPricing;
