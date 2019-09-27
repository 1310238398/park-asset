import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Table, Modal } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import MassifCard from './MassifCard';
import MassifShow from './MassifShow';

import styles from './Massif.less';

@connect(state => ({
  massif: state.massif,
  loading: state.loading.models.MassifList,
}))
@Form.create()
class MassifList extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    this.dispatch({
      type: 'massif/fetch',
      search: {},
      pagination: {},
    });
    this.dispatch({
      type: 'massif/queryCompany',
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
      type: 'massif/loadForm',
      payload: {
        type: 'A',
      },
    });
  };

  handleEditClick = item => {
    this.dispatch({
      type: 'massif/loadForm',
      payload: {
        type: 'E',
        id: item.record_id,
      },
    });
  };

  handleSeeClick = item => {
    this.dispatch({
      type: 'massif/loadForm',
      payload: {
        type: 'S',
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
      type: 'massif/fetch',
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
      type: 'massif/fetch',
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
        type: 'massif/fetch',
        search: formData,
        pagination: {},
      });
      this.clearSelectRows();
    });
  };

  handleDataFormSubmit = data => {
    this.dispatch({
      type: 'massif/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  handleDataFormCancel = () => {
    this.dispatch({
      type: 'massif/changeFormVisible',
      payload: false,
    });
  };

  handleItemDisableClick = item => {
    this.dispatch({
      type: 'massif/changeStatus',
      payload: { record_id: item.record_id, status: 2 },
    });
  };

  handleItemEnableClick = item => {
    this.dispatch({
      type: 'massif/changeStatus',
      payload: { record_id: item.record_id, status: 1 },
    });
  };

  // 跳转写字楼
  onItemDetailClick = item => {
    this.dispatch({
      type: 'massif/redirectBuilings',
      payload: item,
    });
  };

  handleDelOKClick(id) {
    this.dispatch({
      type: 'massif/del',
      payload: { record_id: id },
    });
    this.clearSelectRows();
  }

  renderDataForm() {
    const {
      massif: { formType },
    } = this.props;

    if (formType !== 'S') {
      return (
        <MassifCard onCancel={this.handleDataFormCancel} onSubmit={this.handleDataFormSubmit} />
      );
    } else {
      return <MassifShow onCancel={this.handleDataFormCancel} />;
    }
    return <React.Fragment></React.Fragment>;
  }

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearchFormSubmit} layout="inline">
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="地块名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
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
      massif: {
        data: { list, pagination },
      },
    } = this.props;

    const { selectedRowKeys, selectedRows } = this.state;

    const columns = [
      {
        title: '地块图片',
        dataIndex: 'photo',
        width: 100,
        render: value => {
          return <img src={value} alt="" style={{ width: 60, height: 60 }} />;
        },
      },
      {
        title: '地块名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '地块地址',
        dataIndex: 'address',
        width: 150,
      },
      {
        title: '地块经纬度',
        dataIndex: 'location',
        width: 150,
      },
      {
        title: '备注',
        dataIndex: 'memo',
        width: 150,
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    const breadcrumbList = [
      { title: '地块管理' },
      { title: '地块管理管理', href: '/massif/massif' },
    ];

    return (
      <PageHeaderLayout title="地块管理" breadcrumbList={breadcrumbList}>
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
                <PButton key="see" code="see" onClick={() => this.handleSeeClick(selectedRows[0])}>
                  查看
                </PButton>,
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
                // onRow={record => {
                //   return {
                //     onClick: () => {
                //       this.onItemDetailClick(record);
                //     },
                //   };
                // }}
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

export default MassifList;
