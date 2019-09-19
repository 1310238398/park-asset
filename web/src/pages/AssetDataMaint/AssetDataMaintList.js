import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Table, Modal, Tabs } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import DicShow from '@/components/DictionaryNew/DicShow';

import styles from './AssetDataMaint.less';

@connect(state => ({
  projectManage: state.projectManage,
  loading: state.loading.models.projectManage,
}))
@Form.create()
class AssetDataMaintList extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    // const { record_id, type } = this.props.location.query;
    this.dispatch({
      type: 'projectManage/fetch',
      search: {},
      pagination: {},
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
      this.dispatch({
        type: 'projectManage/fetch',
        search: values,
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

  //   renderDataForm() {}

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
            <Form.Item {...formItemLayout} label="楼栋号">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="建筑类型">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="在租均价">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
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
      projectManage: {
        data: { list, pagination },
      },
    } = this.props;

    const { selectedRowKeys, selectedRows } = this.state;
    const { TabPane } = Tabs;
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
        dataIndex: 'floor_area',
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
      { title: '资产数据维护' },
      { title: '资产数据维护', href: '/assetdatamaint/assetdatamaintlist' },
    ];

    return (
      <PageHeaderLayout title="资产数据维护" breadcrumbList={breadcrumbList}>
        <Card>
          <Tabs defaultActiveKey="1">
            <TabPane tab="写字楼管理" key="1">
              <Card>
                <Row gutter={16}>
                  <Col className="gutter-row" span={6}>
                    <div className={styles.gutterboxbuild}>
                      <div>
                        <img src="" alt="" />
                      </div>
                      <div>
                        <p>总楼栋数</p>
                        <p>5楼</p>
                      </div>
                    </div>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <div className={styles.gutterboxbuild}>
                      <div>
                        <img src="" alt="" />
                      </div>
                      <div>
                        <p>资产总面积（㎡）</p>
                        <p>291738.23</p>
                      </div>
                    </div>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <div className={styles.gutterboxbuild}>
                      <div>
                        <img src="" alt="" />
                      </div>
                      <div>
                        <p>已租面积（㎡）</p>
                        <p>
                          291738.23|<span className={styles.guttetZb}>18.91%</span>
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <div className={styles.gutterboxbuild}>
                      <div>
                        <img src="" alt="" />
                      </div>
                      <div>
                        <p>未租面积（㎡）</p>
                        <p>291738.23</p>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: '10px' }}>
                  {/* <Col className="gutter-row" span={6}>
                    <div className={styles.gutterboxbuild}>
                      <div>
                        <img src="" alt=""/>
                      </div>
                      <div>
                        <p>未租空置（㎡）</p>
                        <p>
                          100000|<span className={styles.guttetZb}>81.96%</span>
                        </p>
                      </div>
                    </div>
                  </Col> */}
                  <Col className="gutter-row" span={6}>
                    <div className={styles.gutterboxbuild}>
                      <div>
                        <img src="" alt="" />
                      </div>
                      <div>
                        <p>出租均价（元/㎡/天）</p>
                        <p>2.23</p>
                      </div>
                    </div>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <div className={styles.gutterboxbuild}>
                      <div>
                        <img src="" alt="" />
                      </div>
                      <div>
                        <p>入驻企业总数</p>
                        <p>40</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
              <Card bordered={false}>
                <div className={styles.tableList}>
                  <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
                  <div className={styles.tableListOperator}>
                    <PButton
                      code="add"
                      icon="plus"
                      type="primary"
                      onClick={() => this.handleAddClick()}
                    >
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
                {/* {this.renderDataForm()} */}
              </Card>
            </TabPane>
            <TabPane tab="商铺管理" key="2">
              待定
            </TabPane>
            <TabPane tab="厂房管理" key="3">
              待定
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default AssetDataMaintList;
