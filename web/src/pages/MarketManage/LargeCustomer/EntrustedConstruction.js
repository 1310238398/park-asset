import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Row, Col, Input, Select, Button, Table } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import styles from './LargeCustomer.less';
@connect(state => ({
  projectManage: state.projectManage,
  // loading: state.loading.models.projectManage,
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

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
      // costAccount: { companyList, poltList },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearchFormSubmit} layout="inline">
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="项目名称">
              {getFieldDecorator('name')(<Input placeholder="请输入项目名称" />)}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="客户名称">
              {getFieldDecorator('customer')(<Input placeholder="请输入客户名称" />)}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="合同名称">
              {getFieldDecorator('contract_name')(<Input placeholder="请输入合同名称" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="合同类型">
              {getFieldDecorator('contract_type')(
                <Select placeholder="请选择合同类型" style={{ width: '100%' }}>
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
            <Form.Item label="审批对象">
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

  render() {
    const breadcrumbList = [
      { title: '营销管理' },
      { title: '大客户销售' },
      { title: '委托建设合同' },
    ];
    return (
      <PageHeaderLayout title="委托建设合同" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          </div>
          <div className={styles.tableListOperator}>
            <PButton code="add" icon="plus" type="primary" onClick={() => this.handleAddClick()}>
              新建
            </PButton>
          </div>
          <Table></Table>
        </Card>
        {this.renderNewForm()}
      </PageHeaderLayout>
    );
  }
}
export default EntrustedConstruction;
