import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Table, Select } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from '../AssetDataMaint.less';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import PButton from '@/components/PermButton';

@connect(state => ({
  projectManage: state.projectManage,
  loading: state.loading.models.projectManage,
}))
@Form.create()
class AssetSearch extends PureComponent {
  componentDidMount() {
    this.dispatch({
      type: 'assetDatamaint/fetch',
      search: {},
      pagination: {},
    });
  }

  handleTableChange = pagination => {
    this.dispatch({
      type: 'assetDatamaint/fetchBuidings',
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  // 查询数据
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
        type: 'assetDatamaint/fetchBuidings',
        building_type: 1,
        search: { ...values },
        pagination: {},
      });
    });
  };

  onResetFormClick = () => {
    const { form } = this.props;
    form.resetFields();
    this.dispatch({
      type: 'assetDatamaint/fetchBuidings',
      search: {},
      pagination: {},
    });
  };

  handleExportClick = () => {
    this.dispatch({
      type: 'assetDatamaint/fetchBuidings',
      search: {},
      pagination: {},
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  getTimeList = () => {
    const t = moment().format('YYYY');
    const t1 = parseInt(t, 10) + 1;
    const tList = [t, t1];
    const cList = ['', '-01', '-02', '-03', '-04'];
    const vList = ['', '一季度', '二季度', '三季度', '四季度'];
    const timeList = [];
    for (let i = 0; i < tList.length; i += 1) {
      for (let j = 0; j < cList.length; j += 1) {
        timeList.push({ code: tList[i] + cList[j], name: tList[i] + vList[j] });
      }
    }
    return timeList;
  };

  renderSearchForm() {
    const { Option } = Select;
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
      md: 8,
    };
    return (
      <Form onSubmit={this.handleSearchFormSubmit} layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={16}>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="公司名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="资产类型">
              {getFieldDecorator('is_all_rent')(
                <DicSelect
                  vmode="string"
                  pcode="pa$#atype"
                  placeholder="请选择"
                  selectProps={{ placeholder: '请选择' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="项目名称">
              {getFieldDecorator('rent_status')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="出租状态">
              {getFieldDecorator('rent_status')(
                <DicSelect
                  vmode="string"
                  pcode="pa$#build$#rente"
                  placeholder="请选择"
                  selectProps={{ placeholder: '请选择' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="租金收缴周期">
              {getFieldDecorator('rent_status')(
                <Select>
                  {this.getTimeList().map(item => (
                    <Option value={item.code}>{item.name}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={4} offset={4}>
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
    const breadcrumbList = [
      { title: '资产管理' },
      { title: '资产查询', href: '/assetdatamaint/assetsearch' },
    ];
    const {
      loading,
      projectManage: {
        data: { list, pagination },
      },
    } = this.props;

    const columns = [
      {
        title: '公司名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '资产类型',
        dataIndex: 'sequence',
        width: 100,
      },
      {
        title: '项目名称',
        dataIndex: 'memo',
        width: 200,
      },
      {
        title: '是否整栋出租',
        dataIndex: 'memo',
        width: 100,
      },
      {
        title: '出租状态',
        dataIndex: 'memo',
        width: 100,
      },
      {
        title: '计租面积（㎡）',
        dataIndex: 'memo',
        width: 200,
      },
      {
        title: '已租面积（㎡）',
        dataIndex: 'memo',
        width: 200,
      },
      {
        title: '未租面积（㎡）',
        dataIndex: 'memo',
        width: 200,
      },
      {
        title: '出租率',
        dataIndex: 'memo',
        width: 200,
      },
      {
        title: '应收租金（万元）',
        dataIndex: 'memo',
        width: 200,
      },
      {
        title: '实收租金（万元）',
        dataIndex: 'memo',
        width: 200,
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };
    return (
      <PageHeaderLayout title="资产查询" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <PButton
                code="export"
                icon="export"
                type="primary"
                onClick={() => this.handleExportClick()}
              >
                导出
              </PButton>
            </div>
            <div>
              <Table
                loading={loading}
                rowKey={record => record.record_id}
                dataSource={list}
                columns={columns}
                pagination={paginationProps}
                onChange={this.handleTableChange}
                size="small"
              />
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default AssetSearch;
