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
import moment from 'moment';
const FormItem = Form.Item;

// 计算合计值
function sum(type, arr) {
  var s = 0;
  arr.forEach(function(val, idx, arr) {
    switch (type) {
      case 'quote_c':
        s += val.quote_c;
        break;
      case 'quote_w':
        s += val.quote_w;
        break;
    }
  }, 0);
  return s;
}

@connect(state => ({
  materialPricing: state.materialPricing,
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
      materialPricing: { proID },
    } = this.props;

    this.dispatch({
      type: 'materialPricing/fetchMaterialPricing',
      payload: {
        search: {},
        pagination: {},
        proID: proID,
      },
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

    const { form } = this.props;

    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }
      const {
        materialPricing: { proID },
      } = this.props;
      const formData = { ...values };
      console.log('form数据  ' + JSON.stringify(formData));

      this.dispatch({
        type: 'materialPricing/fetchMaterialPricing',
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
        type: 'materialPricing/loadMaterialPricingForm',
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
      this.dispatch({
        type: 'materialPricing/loadMaterialPricingForm',
        payload: {
          type: 'E',
          id: item.record_id,
          proID: proID,
        },
      });
    }
  };

  // 重置查询表单
  handleResetFormClick = () => {
    const {
      form,
      materialPricing: { proID },
    } = this.props;
    form.resetFields();

    this.dispatch({
      type: 'materialPricing/fetchMaterialPricing',
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
      materialPricing: { proID },
    } = this.props;
    this.dispatch({
      type: 'materialPricing/fetch',
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
      type: 'materialPricing/changeFormVisibleMaterialPricing',
      payload: false,
    });
  };
  // 保存提交合同
  handleDataFormSubmit = data => {
    this.dispatch({
      type: 'materialPricing/submitMaterialPricing',
      payload: data,
    });
    this.clearSelectRows();
  };

  // 保存材料
  handleModalChange = data => {
    console.log(data);
    // this.props.dispatch({
    //   type: 'productModule/saveFormDataPro',
    //   payload: data,
    // });
  };

  // 查看单个合同信息
  handleSeeClick = item => {
    this.dispatch({
      type: 'materialPricing/loadMaterialPricingForm',
      payload: {
        type: 'S',
        id: item.record_id,
      },
    });
  };
  // 提交审核
  handleCommitClick = item => {
    this.dispatch({
      type: 'materialPricing/commitMaterialPricingForm',
      payload: {
        id: item.record_id,
      },
    });
    this.clearSelectRows();
  };

  // 渲染新增页面还是编辑页面还是查看页面
  renderDataForm() {
    const {
      materialPricing: { formTypeMaterialPricing, formDataMaterialPricing },
    } = this.props;
    console.log(formDataMaterialPricing);
    if (formTypeMaterialPricing !== 'S') {
      return (
        <MaterialPricingDetail
          data={formDataMaterialPricing}
          formTypeMaterialPricing={formTypeMaterialPricing}
          onCancel={this.handleDataFormCancel}
          onSubmit={this.handleDataFormSubmit}
          onChange={this.handleModalChange}
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
              {getFieldDecorator('working_company')(<Input placeholder="请输入施工单位" />)}
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
      materialPricing: {
        formTypeMaterialPricing,
        dataMaterialPricing: { list, pagination },
      },
    } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;
    const columns = [
      {
        title: '材料批价主题名称',
        width: 200,
        dataIndex: 'name',
      },
      {
        title: '材料批价申请编号',
        width: 150,
        dataIndex: 'sn',
      },
      {
        title: '合同编号',
        width: 150,
        dataIndex: 'comcontract_sn',
      },
      {
        title: '合同名称',
        dataIndex: 'comcontract_name',
        width: 200,
      },
      {
        title: '施工单位报价',
        dataIndex: 'quote_w',
        width: 150,
        render: (text, record) => {
          return <div>{sum('quote_w', record.quotes)}</div>;
        },
      },
      {
        title: '建设单位批价',
        dataIndex: 'quote_c',
        width: 150,
        render: (text, record) => {
          return <div>{sum('quote_c', record.quotes)}</div>;
        },
      },
      {
        title: '发起日期',
        dataIndex: 'launch_date',
        width: 140,
        render: (text, record) => {
          return (
            <div style={{ textAlign: 'center' }}>
              {!record.launch_date ? '' : moment(record.launch_date).format('YYYY-MM-DD')}
            </div>
          );
        },
      },
      {
        title: '发起人',
        dataIndex: 'launch_person',
        width: 150,
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
                scroll={{ x: 1300 }}
                onChange={this.handleTableChange}
                size="small"
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
