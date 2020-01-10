import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Row, Col, Input, Select, Button, Table } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import styles from '../MarketManage2.less';
@connect(state => ({
  entrustedConstruction: state.entrustedConstruction,
  loading: state.loading.models.entrustedConstruction,
}))
@Form.create()
class FileManage extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };
  componentDidMount() {}
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

  renderNewForm() {
    return <div></div>;
  }

  handleAddClick = () => {
    // this.dispatch({
    //   type: 'projectManage/loadForm',
    //   payload: {
    //     type: 'A',
    //   },
    // });
  };

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
      // costAccount: { companyList, poltList },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearchFormSubmit} layout="inline">
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="文件名称">
              {getFieldDecorator('file_name')(<Input placeholder="请输入文件名称" />)}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="合同名称">
              {getFieldDecorator('contract_name')(<Input placeholder="请输入合同名称" />)}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="节点名称">
              {getFieldDecorator('node_name')(<Input placeholder="请输入节点名称" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="文件类型">
              {getFieldDecorator('file_type')(
                <Select placeholder="请选择文件类型" style={{ width: '100%' }}>
                  <Select.Option key="1" value="常规合同">
                  合同
                  </Select.Option>
                  <Select.Option key="2" value="委托建设合同">
                  补充协议
                  </Select.Option>
                  <Select.Option key="2" value="委托建设合同">
                  工作联系单
                  </Select.Option>
                  <Select.Option key="2" value="委托建设合同">
                  往来函件
                  </Select.Option>
                  <Select.Option key="2" value="委托建设合同">
                  开发建设证件
                  </Select.Option>
                 
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

  handleSelect = (record, selected, selectedRows, nativeEvent) => {
    console.log('handleSelect ');
    console.log(record);
    console.log(selected);
    console.log(selectedRows);
    let rows = [];
    let keys = [];
    if (selected) {
      rows.push(record);
      keys.push(record.record_id);

      this.setState({
        selectedRowKeys: [...keys],
        selectedRows: [...rows],
      });
    } else {
      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
      });
    }
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

  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  render() {
    const {
      loading,
      entrustedConstruction: {
        data: { pagination },
      },
    } = this.props;
    const breadcrumbList = [{ title: '营销管理' }, { title: '大客户销售' }, { title: '文件管理' }];

    const { selectedRowKeys, selectedRows } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };
    const columns = [
      {
        title: '文件',
        dataIndex: 'file_name',
        width: 150,
      },
      {
        title: '合同名称',
        dataIndex: 'contract_name',
        width: 200,
      },

      {
        title: '文件类型',
        dataIndex: 'type',
        width: 150,
      },
      {
        title: '节点',
        dataIndex: 'node_name',
        width: 150,
      },
      {
        title: '上传人',
        dataIndex: 'upload_person',
        width: 150,
      },
      {
        title: '上传时间',
        dataIndex: 'upload_time',
        width: 150,
      },
      {
        title: '备注',
        dataIndex: 'mark',
        width: 150,
      },
    ];
    const list = [
      {
        record_id: '01',
        file_name: '文件名字',
        contract_name: '合同名字',

        type: '文件类型',
        node_name: '节点',
        upload_person: '上传人',
        upload_time: '上传时间',
        mark: '备注',
      },
      {
        record_id: '02',
        file_name: '文件名字',
        contract_name: '合同名字',

        type: '文件类型',
        node_name: '节点',
        upload_person: '上传人',
        upload_time: '上传时间',
        mark: '备注',
      },
      {
        record_id: '03',
        file_name: '文件名字',
        contract_name: '合同名字',

        type: '文件类型',
        node_name: '节点',
        upload_person: '上传人',
        upload_time: '上传时间',
        mark: '备注',
      },
      {
        record_id: '04',
        file_name: '文件名字',
        contract_name: '合同名字',

        type: '文件类型',
        node_name: '节点',
        upload_person: '上传人',
        upload_time: '上传时间',
        mark: '备注',
      },
    ];

    return (
      <PageHeaderLayout title="文件管理" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length === 1 && [
                <PButton
                  key="view"
                  code="view"
                  icon="eye"
                  onClick={() => this.handleEditClick(selectedRows[0])}
                >
                  查看
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
                  key="down"
                  code="download"
                  icon="download"
                  onClick={() => this.handleEditClick(selectedRows[0])}
                >
                  下载
                </PButton>,
              ]}
            </div>
            <div>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  //  onChange: this.handleTableSelectRow,
                  // type: "radio",
                  onSelect: this.handleSelect,
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
               // size="small"
              ></Table>
            </div>
          </div>
        </Card>
        {this.renderNewForm()}
      </PageHeaderLayout>
    );
  }
}
export default FileManage;
