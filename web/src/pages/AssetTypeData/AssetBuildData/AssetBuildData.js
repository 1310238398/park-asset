import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Table, Modal, message } from 'antd';
import PButton from '@/components/PermButton';
import AssetBuildEdit from './AssetBuildEdit';
// import AssetBuildShowMaint from './AssetBuildShowMaint';
import styles from './AssetBuildData.less';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import DicShow from '@/components/DictionaryNew/DicShow';
import ProSelect from '@/components/ProSelectID/ProSelect';

@connect(state => ({
  assetBuildData: state.assetBuildData,
  loading: state.loading.models.assetBuildData,
}))
@Form.create()
class AssetBuildData extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    project_id: '',
  };

  //   componentDidMount() {
  //     const { onProjectId } = this.props;
  //     this.dispatch({
  //       type: 'assetDatamaint/fetchBuidings',
  //       search: {
  //         project_id: onProjectId,
  //         building_type: 1,
  //       },
  //       pagination: {},
  //     });
  //   }

  handleTableChange = pagination => {
    this.dispatch({
      type: 'assetBuildData/fetchBuidings',
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.clearSelectRows();
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onResetFormClick = () => {
    const { form } = this.props;
    form.resetFields();
    // this.dispatch({
    //   type: 'assetDatamaint/fetchBuidings',
    //   search: { project_id: onProjectId, building_type: 1 },
    //   pagination: {},
    // });
  };

  // 跳转 如果有单元数，就跳转单元，如果没有，就跳转楼层。
  onItemDetailClick = item => {
    if (item.unit_num !== 0) {
      this.dispatch({
        type: 'assetBuildData/cellRoute',
        payload: item,
        unit:1,
      });
    } else {
      this.dispatch({
        type: 'assetBuildData/floorRoute',
        payload: {item,loudongName:'',unit:0}
      });
    }
  };

  // 新建楼栋
  handleAddBuildClick = () => {
    const { project_id } = this.state;
    if (project_id) {
      this.dispatch({
        type: 'assetBuildData/LoadBuild',
        payload: {
          type: 'A',
          inProjectID: project_id,
        },
      });
    } else {
      message.warning('请选择项目名称，进行相应的数据操作');
    }
  };

  // 编辑单元
  handleEditClick = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }
    const item = selectedRows[0];
    const { project_id } = this.state;
    if (project_id) {
      this.dispatch({
        type: 'assetBuildData/LoadBuild',
        payload: {
          type: 'E',
          id: item.record_id,
          inProjectID: project_id,
        },
      });
    } else {
      message.warning('请选择项目名称，进行相应的数据操作');
    }
  };

  // 判断数值
  statusValue = value => {
    if (value && value !== 0) {
      return value / 100;
    }
    return 0;
  };

  // 删除单元
  handleDelClick = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }
    const item = selectedRows[0];
    Modal.confirm({
      title: `确定删除【楼栋数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, item.record_id),
    });
  };

  // 查看单元
  handleSeeClick = () => {
    const { onProjectId } = this.props;
    const { selectedRows, } = this.state;
    if (selectedRows.length === 0) {
      return;
    }
    const item = selectedRows[0];
    this.dispatch({
      type: 'assetBuildData/LoadBuild',
      payload: {
        type: 'S',
        id: item.record_id,
        inProjectID: onProjectId,
      },
    });
  };

  handleFormBuildShow = () => {
    this.dispatch({
      type: 'assetBuildData/changeFormVisibleBuild',
      payload: false,
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

  // 关闭弹窗
  handleFormCancel = () => {
    this.dispatch({
      type: 'assetBuildData/changeFormVisibleBuild',
      payload: false,
    });
  };

  // 提交数据
  handleFormSubmit = data => {
    const {
      assetBuildData: { formTypeBuild },
    } = this.props;
    this.dispatch({
      type: 'assetBuildData/submitBuild',
      payload: data,
    });
    if (formTypeBuild === 'E') {
      this.clearSelectRows();
    }
  };

  // 查询表单数据
  handleSearchFormSubmit = e => {
    if (e) {
      e.preventDefault();
    }

    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        message.warning('请选择项目名称，进行相应的数据操作');
        return;
      }
      let formData = { ...values };
      //TODO
      this.setState({ project_id: formData.project_id });
      this.dispatch({
        type: 'assetBuildData/fetchBuidings',
        building_type: 1,
        search: { ...values, building_type: 1 },
        pagination: {},
      });
      this.clearSelectRows();
    });
  };

  handleTableSelectRow = (selectedRowKeys, selectedRows) => {
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

  handleDelOKClick(id) {
    this.dispatch({
      type: 'assetBuildData/delBuild',
      payload: { record_id: id },
    });
    this.clearSelectRows();
  }

  handleChangePro = e => {
    this.setState({ project_id: e });
    this.dispatch({
        type:'assetBuildData/saveProjectID',
        payload:e
    })
  };

  // 显示弹窗
  renderDataForm() {
    const {
      assetBuildData: { formTypeBuild },
    } = this.props;
    if (formTypeBuild === 'A' || formTypeBuild === 'E') {
      return <AssetBuildEdit onCancel={this.handleFormCancel} onSubmit={this.handleFormSubmit} />;
    }
    // if (formTypeBuild === 'S') {
    //   return <AssetBuildShowMaint onCancel={this.handleFormBuildShow} />;
    // }
    return <React.Fragment></React.Fragment>;
  }

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
            <Form.Item {...formItemLayout} label="项目名称">
              {getFieldDecorator('project_id', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(<ProSelect onChange={this.handleChangePro} />)}
            </Form.Item>
          </Col>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="楼栋号">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="出租规模">
              {getFieldDecorator('is_all_rent')(
                <DicSelect
                  vmode="string"
                  pcode="pa$#build$#scale"
                  placeholder="请选择"
                  selectProps={{ placeholder: '请选择' }}
                />
              )}
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
          <Col {...col} offset={1}>
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
      assetBuildData: {
        dataBuild: { list, pagination },
      },
    } = this.props;

    const { selectedRowKeys, selectedRows } = this.state;
    const columns = [
      {
        title: '楼栋号',
        dataIndex: 'name',
        width: 100,
      },
      {
        title: '是否整栋出租',
        dataIndex: 'is_all_rent',
        width: 150,
        render: val => {
          return <span>{val === 1 ? '是' : '否'}</span>;
        },
      },
      {
        title: '出租状态',
        dataIndex: 'rent_status',
        width: 150,
        render: val => {
          if (val === 0) {
            return '';
          }
          return <DicShow pcode="pa$#build$#rente" code={[val]} />;
        },
      },
      {
        title: '建筑面积（㎡）',
        dataIndex: 'building_area',
        width: 150,
        render: val => {
          return <span>{this.statusValue(val)}</span>;
        },
      },

      // 判断是否是整栋出租
      // 整栋&&（未租||锁定） 已租面积和出租率是0， 未租面积=计租面积
      // 整栋&&已租  已租面积=计租面积 未租面积=0 出租率=100%
      {
        title: '已租面积（㎡）',
        dataIndex: 'rent_area',
        width: 150,
        render: item => {
          if (item.is_all_rent === 1) {
            if (item.rent_status !== 3) {
              return 0;
            }
            return -1;
          }
          return <span>{this.statusValue(item.rent_area)}</span>;
        },
      },
      {
        title: '出租率',
        dataIndex: '',
        width: 150,
        render: item => {
          if (item.is_all_rent === 1) {
            if (item.rent_status !== 3) {
              return 0;
            }
            return <span>100%</span>;
          }
          return <span>{this.statusValue(item.rent_area)}</span>;
        },
      },
      {
        title: '未租面积（㎡）',
        dataIndex: 'parent_path',
        width: 150,
        render: item => {
          if (item.is_all_rent === 1 && item.rent_status !== 3) {
            return item.rent_area;
          }
          return <span>{this.statusValue(item.rent_area)}</span>;
        },
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <PButton
                code="addbuild"
                icon="plus"
                type="primary"
                onClick={() => this.handleAddBuildClick()}
              >
                新建楼栋
              </PButton>
              <PButton
                code="tembuild"
                // icon="plus"
                type="primary"
                onClick={() => this.handleAddClick()}
              >
                模板下载
              </PButton>
              <PButton
                code="loadbuild"
                // icon="plus"
                type="primary"
                onClick={() => this.handleAddClick()}
              >
                批量导入
              </PButton>
              {selectedRows.length === 1 && [
                <PButton
                  key="edit"
                  code="editbuild"
                  icon="edit"
                  onClick={() => this.handleEditClick(selectedRows[0])}
                >
                  编辑
                </PButton>,
                <PButton
                  key="del"
                  code="delbuild"
                  icon="delete"
                  type="danger"
                  onClick={() => this.handleDelClick(selectedRows[0])}
                >
                  删除
                </PButton>,
                // <PButton code="querybuild" onClick={() => this.handleSeeClick(selectedRows[0])}>
                //   查看
                // </PButton>,
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
          {this.renderDataForm()}
        </Card>
      </div>
    );
  }
}
export default AssetBuildData;
