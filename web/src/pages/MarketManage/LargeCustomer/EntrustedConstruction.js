import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card,  Row, Col,Form, Input, Select, Button, Table } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import styles from '../MarketManage2.less';
@connect(state => ({
  entrustedConstruction: state.entrustedConstruction,
   loading: state.loading.models.entrustedConstruction,
}))
@Form.create()
class EntrustedConstruction extends PureComponent {
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

  handleEditClick = (record_id) => {
      // type V 查看  E 编辑
    this.dispatch({
      type: 'entrustedConstruction/redirectDetail',
      payload: {
        record_id: record_id,
        operType: "E"
      },
    
    });
  }

  handleViewClick = (record_id) => {
    // type V 查看  E 编辑
  this.dispatch({
    type: 'entrustedConstruction/redirectDetail',
    payload: {
      record_id: record_id,
      operType: "V"
    },
  
  });
}


  handleDownClick = () => {
  this.dispatch({
      type: 'entrustedConstruction/redirectFileDown',
     
    });
    
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
            <Form.Item label="项目名称" >
              {getFieldDecorator('name')(<Input placeholder="请输入项目名称" />)}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="客户名称" >
              {getFieldDecorator('customer')(<Input placeholder="请输入客户名称" />)}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="合同名称" >
              {getFieldDecorator('contract_name')(<Input placeholder="请输入合同名称" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col md={6} sm={24} >
            <Form.Item label="合同类型" >
              {getFieldDecorator('contract_type')(
                <Select placeholder="请选择合同类型" style={{ width: '100%'}}>
                  <Select.Option key="1" value="常规合同">
                    常规合同
                  </Select.Option>
                  <Select.Option key="2" value="委托建设合同">
                    委托建设合同
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="审批对象" >
              {getFieldDecorator('approval_name')(<Input placeholder="请输入审批对象姓名" />)}
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
    console.log("handleSelect ");
    console.log(record)
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

    }
    else {
      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
      });
    }
  }

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

  

  render() {
    const {
      loading,
      entrustedConstruction: {
        data: {  pagination },
      },
    } = this.props;
    const breadcrumbList = [
      { title: '营销管理' },
      { title: '大客户销售' },
      { title: '委托建设合同' },
    ];

    const { selectedRowKeys, selectedRows } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };
    const columns = [
      {
        title: '合同名称',
        dataIndex: 'contract_name',
        width: 200,
      },
      {
        title: '客户',
        dataIndex: 'customer_name',
        width: 150,
      },
      {
        title: '项目',
        dataIndex: 'project',
        width: 150,
      },
      {
        title: '审核进度',
        dataIndex: 'audit_progress',
        width: 150,
      },
      {
        title: '审批人',
        dataIndex: 'audit_person',
        width: 150,
      },
      {
        title: '执行进度',
        dataIndex: 'execution_progress',
        width: 150,
      },
      {
        title: '累计付款比例',
        dataIndex: 'payment_proportion',
        width: 150,
      },
    ];
    const list = [
      {
        record_id: "01",
        contract_name: '合同名称',
        customer_name: '客户名称',
        project: '合同所属项目',
        audit_progress: '审核进度',
        audit_person: '审核人',
        execution_progress: '执行进度',
        payment_proportion: '付款比例',
      },
      {
        record_id: "02",
        contract_name: '合同名称',
        customer_name: '客户名称',
        project: '合同所属项目',
        audit_progress: '审核进度',
        audit_person: '审核人',
        execution_progress: '执行进度',
        payment_proportion: '付款比例',
      },
      {
        record_id: "03",
        contract_name: '合同名称',
        customer_name: '客户名称',
        project: '合同所属项目',
        audit_progress: '审核进度',
        audit_person: '审核人',
        execution_progress: '执行进度',
        payment_proportion: '付款比例',
      },
      {
        record_id: "04",
        contract_name: '合同名称',
        customer_name: '客户名称',
        project: '合同所属项目',
        audit_progress: '审核进度',
        audit_person: '审核人',
        execution_progress: '执行进度',
        payment_proportion: '付款比例',
      },
    ];

    return (
      <PageHeaderLayout title="委托建设合同" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <PButton code="add" icon="plus" type="primary" onClick={() => this.handleAddClick()}>
                新建
              </PButton>
              {
                selectedRows.length === 1 && [
                 <PButton
                key="edit"
                code="edit"
                icon="edit"
                onClick={() => {this.handleEditClick(selectedRows[0])}}
              >
                编辑
              </PButton>,
              <PButton
                key="view"
                code="view"
                icon="eye"
                onClick={() => {this.handleViewClick(selectedRows[0])}}
              >
                查看
              </PButton>,
              <PButton
                  key="del"
                  code="delete"
                  icon="delete"
                  type="danger"
                  onClick={() => {}}
                >
                  删除
                </PButton>
                ]
              }
             
                <PButton
                key="down"
                code="download"
                icon="download"
                onClick={() => this.handleDownClick()}
              >
                附件下载
              </PButton>
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
export default EntrustedConstruction;
