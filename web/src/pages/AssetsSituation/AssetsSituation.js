import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Table, Modal, Select } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import DicShow from '@/components/DictionaryNew/DicShow';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import styles from './AssetsSituation.less';

@connect(state => ({
  projectManage: state.projectManage,
  loading: state.loading.models.projectManage,
}))
@Form.create()
class AssetsSituationList extends PureComponent {
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
        <div>1212</div>
    //   <ProjectManageCard
    //     onCancel={this.handleDataFormCancel}
    //     onSubmit={this.handleDataFormSubmit}
    //   />
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
      { title: '资产管理' },
      { title: '资产管理', href: '/assetssituation/assetssituationlist' },
    ];

    return (
      <PageHeaderLayout title="资产管理" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div>
              <Table
               
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

export default AssetsSituationList;
