import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Table, Modal, Select } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import ProjectManageCard from './ProjectManageCard';
import DicShow from '@/components/DictionaryNew/DicShow';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import styles from './ProjectManage.less';

@connect(state => ({
  projectManage: state.projectManage,
  loading: state.loading.models.projectManage,
}))
@Form.create()
class ProjectManageList extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    this.dispatch({
      type: 'projectManage/fetch',
      search: {},
      pagination: {},
    });
    this.dispatch({
      type: 'projectManage/queryCompany',
    });
  }

  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  handleAddClick = () => {
    this.dispatch({
      type: 'projectManage/loadForm',
      payload: {
        type: 'A',
      },
    });
  };

  handleEditClick = item => {
    this.dispatch({
      type: 'projectManage/loadForm',
      payload: {
        type: 'E',
        id: item.record_id,
      },
    });
  };

  handleDelClick = item => {
    Modal.confirm({
      title: `确定删除【项目数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, item.record_id),
    });
  };

  handleTableSelectRow = (keys, rows) => {
    this.setState({
      selectedRowKeys: keys,
      selectedRows: rows,
    });
  };

  handleTableChange = pagination => {
    this.dispatch({
      type: 'projectManage/fetch',
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.clearSelectRows();
  };

  handleResetFormClick = () => {
    const { form } = this.props;
    form.resetFields();

    this.dispatch({
      type: 'projectManage/fetch',
      search: {},
      pagination: {},
    });
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
      const formData = { ...values };
      if (formData.asset_type && formData.asset_type.length > 0) {
        formData.asset_type = formData.asset_type.join(',');
      } else {
        formData.asset_type = '';
      }
      this.dispatch({
        type: 'projectManage/fetch',
        search: formData,
        pagination: {},
      });
      this.clearSelectRows();
    });
  };

  handleDataFormSubmit = data => {
    this.dispatch({
      type: 'projectManage/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  handleDataFormCancel = () => {
    this.dispatch({
      type: 'projectManage/changeFormVisible',
      payload: false,
    });
  };

  handleItemDisableClick = item => {
    this.dispatch({
      type: 'projectManage/changeStatus',
      payload: { record_id: item.record_id, status: 2 },
    });
  };

  handleItemEnableClick = item => {
    this.dispatch({
      type: 'projectManage/changeStatus',
      payload: { record_id: item.record_id, status: 1 },
    });
  };

  // 跳转写字楼
  onItemDetailClick = item => {
    this.dispatch({
      type: 'projectManage/redirectBuilings',
      payload: item,
    });
  };

  handleDelOKClick(id) {
    this.dispatch({
      type: 'projectManage/del',
      payload: { record_id: id },
    });
    this.clearSelectRows();
  }

  renderDataForm() {
    return (
      <ProjectManageCard
        onCancel={this.handleDataFormCancel}
        onSubmit={this.handleDataFormSubmit}
      />
    );
  }

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
      projectManage: { companyList },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearchFormSubmit} layout="inline">
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="项目名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="资产类型">
              {getFieldDecorator('asset_type')(
                <DicSelect
                  vmode="sting"
                  pcode="pa$#atype"
                  selectProps={{ mode: 'multiple', placeholder: '请选择' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="所属公司">
              {getFieldDecorator('org_id')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {companyList &&
                    companyList.map(item => (
                      <Select.Option key={item.record_id} value={item.record_id}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
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
      projectManage: {
        data: { list, pagination },
      },
    } = this.props;

    const { selectedRowKeys, selectedRows } = this.state;

    const columns = [
      {
        title: '项目图片',
        dataIndex: 'photo',
        width: 100,
        render: value => {
          return <img src={value} alt="" style={{ width: 60, height: 60 }} />;
        },
      },
      {
        title: '项目名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '所属公司',
        dataIndex: 'org_name',
        width: 150,
      },
      {
        title: '项目地址',
        dataIndex: 'address',
        width: 150,
      },
      {
        title: '项目资产类型',
        dataIndex: 'asset_type',
        width: 150,
        render: value => {
          return <DicShow pcode="pa$#atype" code={value.split(',')} />;
        },
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    const breadcrumbList = [
      { title: '项目管理' },
      { title: '项目管理', href: '/project/projectmanage' },
    ];

    return (
      <PageHeaderLayout title="项目管理" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <PButton code="add" icon="plus" type="primary" onClick={() => this.handleAddClick()}>
                新建
              </PButton>
              {selectedRows.length === 1 && [
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
                // selectedRows[0].status === 2 && (
                //   <PButton
                //     key="enable"
                //     code="enable"
                //     icon="check"
                //     onClick={() => this.handleItemEnableClick(selectedRows[0])}
                //   >
                //     启用
                //   </PButton>
                // ),
                // selectedRows[0].status === 1 && (
                //   <PButton
                //     key="disable"
                //     code="disable"
                //     icon="stop"
                //     type="danger"
                //     onClick={() => this.handleItemDisableClick(selectedRows[0])}
                //   >
                //     禁用
                //   </PButton>
                // ),
              ]}
            </div>
            <div>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: this.handleTableSelectRow,
                }}
                loading={loading}
                rowKey={record => record.record_id}
                dataSource={list}
                columns={columns}
                pagination={paginationProps}
                onChange={this.handleTableChange}
                onRow={record => {
                  return {
                    onClick: () => {
                      this.onItemDetailClick(record);
                    },
                  };
                }}
                size="small"
              />
            </div>
          </div>
        </Card>
        {this.renderDataForm()}
      </PageHeaderLayout>
    );
  }
}

export default ProjectManageList;
