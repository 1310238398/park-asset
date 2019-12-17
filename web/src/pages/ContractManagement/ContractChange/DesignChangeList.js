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
import DesignChangeDetail from './DesignChangeDetail';
import DesignChangeShow from './DesignChangeShow';
import ContractChangeBotTable from './ContractChangeBotTable';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import DicShow from '@/components/DictionaryNew/DicShow';
const FormItem = Form.Item;
@connect(state => ({
  designChange: state.designChange,
  contractSupplement: state.contractSupplement,
  loading: state.loading.models.designChange,
}))
@Form.create()
class DesignChangeList extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    const {
      designChange: { formID },
    } = this.props;

    this.dispatch({
      type: 'designChange/fetch',
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
        designChange: { formID },
      } = this.props;
      const formData = { ...values };
      console.log('form数据  ' + JSON.stringify(formData));

      this.dispatch({
        type: 'designChange/fetch',
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
      designChange: {
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

        response = await updatedesignChange(row);
        if (response.record_id && response.record_id !== '') {
          message.success('更新成功');
          this.setState({ editingKey: '' });
          this.dispatch({
            type: 'designChange/saveData',
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
      type: 'designChange/del',
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
      type: 'designChange/loadDesignChangeForm',
      payload: {
        type: 'A',
      },
    });
  };
  // 编辑合同界面
  handleEditClick = item => {
    this.dispatch({
      type: 'designChange/loadDesignChangeForm',
      payload: {
        type: 'E',
        id: item.record_id,
      },
    });
  };


  handleResetFormClick = () => {
    const {
      form,
      designChange: { formID },
    } = this.props;
    form.resetFields();

    this.dispatch({
      type: 'designChange/fetch',
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
      designChange: { formID },
    } = this.props;
    this.dispatch({
      type: 'designChange/fetch',
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
      type: 'designChange/changeFormVisibleDesignChange',
      payload: false,
    });
  };
  // 保存提交合同
  handleDataFormSubmit = data => {
    this.dispatch({
      type: 'designChange/submit',
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
          onCancel={this.handleDataFormCancel}
          onSubmit={this.handleDataFormSubmit}
        />
      );
    } else {
      return <DesignChangeShow onCancel={this.handleDataFormCancel} />;
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
      type: 'designChange/delDesignChange',
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
            <Form.Item {...formItemLayout} label="设计编号">
              {getFieldDecorator('name')(<Input placeholder="请输入设计编号" />)}
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
      designChange: {
        formTypeDesignChange,
        dataDesignChange: { list, pagination },
      },
    } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;
    const columns = [
      {
        title: '设计变更主题名称',
        dataIndex: 'index',
      },
      {
        title: '设计变更编号',
        dataIndex: 'sn',
      },
      {
        title: '合同名称',
        dataIndex: 'name',
      },
      {
        title: '预估变更金额',
        dataIndex: 'property',
      },
      {
        title: '审定金额',
        dataIndex: 'sex',
        width: 150,
      },

      {
        title: '发起日期',
        dataIndex: 'address',
        width: 140,
      },
      {
        title: '发起人',
        dataIndex: 'age',
        width: 140,
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
        property: ['nice', 'developer'],
        sex: 100.09,
        sn:'222222'
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b541',
        status: 1,
        index: '合同名称2',
        name: 'Jim Green',
        age: '2019-01-12',
        address: '2',
        property: ['loser'],
        sex: 100,
        sn:'222222'
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b54e',
        status: 2,
        index: '合同名称3',
        name: 'Joe Black',
        age: '2019-01-12',
        address: '1',
        property: ['cool', 'teacher'],
        sex: 200,
        sn:'222222'
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
export default DesignChangeList;
