import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Table, Select } from 'antd';
import moment from 'moment';
import { stringify } from 'qs';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from '../AssetDataMaint.less';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import PButton from '@/components/PermButton';
import DicShow from '@/components/DictionaryNew/DicShow';

@connect(state => ({
  statistic: state.statistic,
  loading: state.loading.models.statistic,
}))
@Form.create()
class AssetSearch extends PureComponent {
  componentDidMount() {
    this.dispatch({
      type: 'statistic/fetch',
      search: { rent_cycle: this.getCurYear() },
      pagination: {},
    });
  }

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
        type: 'statistic/fetch',
        search: { ...values },
        pagination: {},
      });
    });
  };

  onResetFormClick = () => {
    const { form } = this.props;
    form.resetFields();
    this.dispatch({
      type: 'statistic/fetch',
      search: { rent_cycle: this.getCurYear() },
      pagination: {},
    });
  };

  // handleExportClick = () => {
  //   const { form } = this.props;
  //   form.validateFields({ force: true }, (err, values) => {
  //     if (err) {
  //       return;
  //     }
  //     this.dispatch({
  //       type: 'statistic/exportData',
  //       search: { ...values },
  //     });
  //   });
  // };

  // download = () => {
  //   fetch('http://localhost:8000/api/v1/statistics/project/export?rent_cycle=2019').then(res => res.blob().then(blob => {
  //     debugger
  //     let a = document.createElement('a');
  //     let url = window.URL.createObjectURL(blob);
  //     let filename = res.headers.get('Content-Disposition');
  //     if (filename) {
  //       filename = filename.match(/\"(.*)\"/)[1]; //提取文件名
  //       filename = decodeURI(filename)
  //       a.href = url;
  //       a.download = filename; //给下载下来的文件起个名字
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //       a = null;
  //     }
  //   }));
  // };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // 判断数值
  statusValue = value => {
    if (value && value !== 0) {
      return value / 100;
    }
    return 0;
  };

  getCurYear = () => {
    const t = moment().format('YYYY');
    return t;
  };

  getTimeList = () => {
    const t = this.getCurYear();
    const t1 = parseInt(t, 10) + 1;
    const tList = [t, t1];
    const cList = ['', '-1', '-2', '-3', '-4'];
    const vList = ['', '一季度', '二季度', '三季度', '四季度'];
    const timeList = [];
    for (let i = 0; i < tList.length; i += 1) {
      for (let j = 0; j < cList.length; j += 1) {
        timeList.push({ tCode: tList[i] + cList[j], tName: tList[i] + vList[j] });
      }
    }
    return timeList;
  };

  exportHandle = () => {
    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }
      const params = { ...values };
      window.open(`/api/v1/statistics/project/export?${stringify(params)}`);
    });
  };

  handleTableChange = pagination => {
    this.props.dispatch({
      type: 'statistic/fetch',
      search: { rent_cycle: this.getCurYear() },
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
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
              {getFieldDecorator('org_name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="资产类型">
              {getFieldDecorator('asset_type')(
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
              {getFieldDecorator('project_name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="租金收缴周期">
              {getFieldDecorator('rent_cycle', { initialValue: this.getCurYear() })(
                <Select>
                  {this.getTimeList().map(item => (
                    <Option value={item.tCode} key={item.tCode}>
                      {item.tName}
                    </Option>
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
      statistic: {
        data: { list, pagination },
      },
    } = this.props;
    const columns = [
      {
        title: '公司名称',
        dataIndex: 'org_name',
        width: 200,
      },
      {
        title: '资产类型',
        dataIndex: 'asset_type',
        width: 100,
        render: val => {
          if (val === 0) {
            return '';
          }
          return <DicShow pcode="pa$#atype" code={[val]} />;
        },
      },
      {
        title: '项目名称',
        dataIndex: 'project_name',
        width: 200,
      },
      {
        title: '计租面积（㎡）',
        dataIndex: 'rent_area',
        width: 200,
        render: val => {
          return <span>{this.statusValue(val)}</span>;
        },
      },
      {
        title: '已租面积（㎡）',
        dataIndex: 'rented_area',
        width: 200,
        render: val => {
          return <span>{this.statusValue(val)}</span>;
        },
      },
      {
        title: '未租面积（㎡）',
        width: 200,
        render: item => {
          if (item.rent_area) {
            if (item.rented_area) {
              return <span>{this.statusValue(item.rent_area - item.rented_area)}</span>;
            }
            return 0;
          }
          return 0;
        },
      },
      {
        title: '出租率',
        width: 200,
        render: item => {
          if (item.rent_area && item.rent_area > 0) {
            if (item.rented_area && item.rented_area > 0) {
              return <span>{(item.rented_area / item.rent_area).toFixed(2)}</span>;
            }
            return 0;
          }
          return 0;
        },
      },
      {
        title: '应收租金（万元）',
        dataIndex: 'payment_amount',
        width: 200,
      },
      {
        title: '实收租金（万元）',
        dataIndex: 'actual_amount',
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
                onClick={() => this.exportHandle()}
              >
                导出明细
              </PButton>
            </div>
            <div>
              <Table
                loading={loading}
                rowKey={record => record.org_id}
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
