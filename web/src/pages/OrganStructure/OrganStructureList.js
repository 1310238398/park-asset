import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Table, Modal, Layout, Tree } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import OrganStructureCard from './OrganStructureCard';
import DicShow from '@/components/DictionaryNew/DicShow';
import DicSelect from '@/components/DictionaryNew/DicSelect';

import styles from './OrganStructure.less';

@connect(({ organStructure, loading }) => ({
  organStructure,
  loading: loading.models.organStructure,
}))
@Form.create()
class OrganStructureList extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    treeSelectedKeys: [],
  };

  componentDidMount() {
    this.dispatch({
      type: 'organStructure/loadTree',
    });

    this.dispatch({
      type: 'organStructure/fetch',
      search: {},
      pagination: {},
    });
  }

  handleEditClick = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }
    const item = selectedRows[0];
    this.dispatch({
      type: 'organStructure/loadForm',
      payload: {
        type: 'E',
        id: item.record_id,
      },
    });
  };

  handleAddClick = () => {
    this.dispatch({
      type: 'organStructure/loadForm',
      payload: {
        type: 'A',
      },
    });
  };

  handleDelClick = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }
    const item = selectedRows[0];
    Modal.confirm({
      title: `确定删除【机构数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, item.record_id),
    });
  };

  onTableSelectRow = (selectedRowKeys, selectedRows) => {
    let keys = [];
    let rows = [];
    if (selectedRowKeys.length > 0 && selectedRows.length > 0) {
      keys = [selectedRowKeys[selectedRowKeys.length - 1]];
      rows = [selectedRows[selectedRows.length - 1]];
    }
    this.setState({
      selectedRowKeys: keys,
      selectedRows: rows,
    });
  };

  onTableChange = pagination => {
    this.dispatch({
      type: 'organStructure/fetch',
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.clearSelectRows();
  };

  onResetFormClick = () => {
    const { form } = this.props;
    form.resetFields();
    this.dispatch({
      type: 'organStructure/fetch',
      search: { parent_id: this.getParentID() },
      pagination: {},
    });
  };

  onSearchFormSubmit = e => {
    if (e) {
      e.preventDefault();
    }

    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.dispatch({
        type: 'organStructure/fetch',
        search: {
          ...values,
          parent_id: this.getParentID(),
        },
        pagination: {},
      });
      this.clearSelectRows();
    });
  };

  handleFormSubmit = data => {
    this.dispatch({
      type: 'organStructure/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  handleFormCancel = () => {
    this.dispatch({
      type: 'organStructure/changeFormVisible',
      payload: false,
    });
  };

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

  getParentID = () => {
    const { treeSelectedKeys } = this.state;
    let parentID = '';
    if (treeSelectedKeys.length > 0) {
      [parentID] = treeSelectedKeys;
    }
    return parentID;
  };

  handleDelOKClick(id) {
    this.dispatch({
      type: 'organStructure/del',
      payload: { record_id: id },
    });
    this.clearSelectRows();
  }

  renderDataForm() {
    return <OrganStructureCard onCancel={this.handleFormCancel} onSubmit={this.handleFormSubmit} />;
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.name} key={item.record_id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode title={item.name} key={item.record_id} dataRef={item} />;
    });

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.onSearchFormSubmit} layout="inline">
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item label="机构名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="机构类型">
              {getFieldDecorator('org_type')(
                <DicSelect
                  vmode="int"
                  pcode="pa$#organtype"
                  selectProps={{ placeholder: '请选择' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
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
      organStructure: {
        data: { list, pagination },
        treeData,
        expandedKeys,
      },
    } = this.props;

    const { selectedRowKeys } = this.state;

    const columns = [
      {
        title: '机构名称',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '机构类型',
        dataIndex: 'org_type',
        width: 150,
        render: value => {
          return <DicShow pcode="pa$#organtype" code={[value]} />;
        },
      },

      {
        title: '排序值',
        dataIndex: 'sequence',
        width: 100,
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    const breadcrumbList = [
      { title: '基础数据' },
      { title: '机构组织', href: '/basic/organstructurelist' },
    ];

    return (
      <PageHeaderLayout title="组织机构管理" breadcrumbList={breadcrumbList}>
        <Layout>
          <Layout.Sider
            width={200}
            style={{ background: '#fff', borderRight: '1px solid lightGray' }}
          >
            <Tree
              expandedKeys={expandedKeys}
              onSelect={keys => {
                this.setState({
                  treeSelectedKeys: keys,
                });

                const {
                  organStructure: { search },
                } = this.props;

                const item = {
                  parent_id: '',
                };

                if (keys.length > 0) {
                  [item.parent_id] = keys;
                }

                this.dispatch({
                  type: 'organStructure/fetch',
                  search: { ...search, ...item },
                  pagination: {},
                });

                this.clearSelectRows();
              }}
              onExpand={keys => {
                this.dispatch({
                  type: 'organStructure/saveExpandedKeys',
                  payload: keys,
                });
              }}
            >
              {this.renderTreeNodes(treeData)}
            </Tree>
          </Layout.Sider>
          <Layout.Content>
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
                  {selectedRowKeys.length === 1 && [
                    <PButton
                      key="edit"
                      code="edit"
                      icon="edit"
                      onClick={() => this.handleEditClick()}
                    >
                      编辑
                    </PButton>,
                    <PButton
                      key="del"
                      code="del"
                      icon="delete"
                      type="danger"
                      onClick={() => this.handleDelClick()}
                    >
                      删除
                    </PButton>,
                  ]}
                </div>
                <Table
                  rowSelection={{
                    selectedRowKeys,
                    onChange: this.onTableSelectRow,
                  }}
                  loading={loading}
                  rowKey={record => record.record_id}
                  dataSource={list}
                  columns={columns}
                  pagination={paginationProps}
                  onChange={this.onTableChange}
                  size="small"
                />
              </div>
            </Card>
          </Layout.Content>
        </Layout>
        {this.renderDataForm()}
      </PageHeaderLayout>
    );
  }
}
export default OrganStructureList;
