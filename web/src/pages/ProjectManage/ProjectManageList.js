import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Table, Modal, Select,Descriptions,Menu, Dropdown } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import ProjectManageCard from './ProjectManageCard';
import ProjectManageCardNew from './ProjectManageCardNew';
import DicShow from '@/components/DictionaryNew/DicShow';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import styles from './ProjectManage.less';

@connect(state => ({
  projectManage: state.projectManage,
  loading: state.loading.models.projectManage,
}))
@Form.create()
class ProjectManageList extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    // 查询列表
    this.dispatch({
      type: 'projectManage/fetch',
      search: {},
      pagination: {},
    });
    this.dispatch({
      type: 'projectManage/queryCompany',
    });
    this.dispatch({
      type: 'projectManage/queryPlotList',
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
  


  editPro = (item, index) => {
    this.dispatch({
      type: 'projectManage/loadForm',
      payload: {
        type: 'E',
        id: item.record_id,
        currentIndex: index,
      },
    });
    
  }

  handleDelClick = item => {
    Modal.confirm({
      title: `确定删除【项目数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, item.record_id),
    });
  };

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

  handleTableSelectRow = async (selectedRowKeys, selectedRows) => {
  
    // console.log("handleTableSelectRow");
    // console.log(selectedRowKeys);
    // console.log(selectedRows);
    // let keys = [];
    // let rows = [];
    // if (selectedRowKeys.length > 0 && selectedRows.length > 0) {
    //   let itemKey = selectedRowKeys[selectedRowKeys.length - 1];
    //   let itemRow = selectedRows[selectedRows.length - 1];
    //   keys.push(itemKey);
    //   rows.push(itemRow);
    //   console.log("keys ");
    //   console.log(keys);
    //   console.log(rows);
    // }
    // await  this.setState({
    //   selectedRowKeys: [...keys],
    //   selectedRows: [...rows],
    // });

    // console.log("selectedRows ");
    // console.log(this.state.selectedRows);
  
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
    console.log("哈哈哈2");
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
  handleDataNewFormCancel = () => {
   
    this.dispatch({
      type: 'projectManage/changeNewFormVisible',
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
      <ProjectManageCard
        onCancel={this.handleDataFormCancel}
        onSubmit={this.handleDataFormSubmit}
      />
    );
  }
  renderDataNewForm() {
    return (
      <ProjectManageCardNew
        onCancel={this.handleDataNewFormCancel}
        onSubmit={this.handleDataFormSubmit}
      />
    );
  }



  renderSearchForm() {
    const {
      form: { getFieldDecorator },
      projectManage: { companyList, poltList },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearchFormSubmit} layout="inline">
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="项目名称">
              {getFieldDecorator('name')(<Input placeholder="请输入项目名称" />)}
            </Form.Item>
          </Col>
          {/* <Col md={6} sm={24}>
            <Form.Item label="资产类型">
              {getFieldDecorator('asset_type')(
                <DicSelect
                  vmode="sting"
                  pcode="pa$#atype"
                  placeholder="请选择资产类型"
                  selectProps={{ mode: 'multiple', placeholder: '请选择' }}
                />
              )}
            </Form.Item>
          </Col> */}
          <Col md={6} sm={24}>
            <Form.Item label="项目类型">
              {getFieldDecorator('project_type')(
                <DicSelect
                  vmode="sting"
                  pcode="pro"
                  placeholder="请选择项目类型"
                  selectProps={{ placeholder: '请选择' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col md={12} sm={24}>
            <Form.Item label="所属公司">
              {getFieldDecorator('org_id')(
                <Select placeholder="请选择公司" style={{ width: 300 }}>
                  {companyList &&
                    companyList.map(item => (
                      <Select.Option key={item.record_id} value={item.record_id}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
         
          <Col md={6} sm={24}>
            <Form.Item label="所属地块">
              {getFieldDecorator('plot_id')(
                <Select placeholder="请选择地块" style={{ width: '100%' }}>
                  {poltList &&
                    poltList.map(item => (
                      <Select.Option key={item.record_id} value={item.record_id}>
                        {item.name}
                      </Select.Option>
                    ))}
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

  renderContent() { return (<Descriptions size="small" column={3} >
  <Descriptions.Item label="当前项目">汉峪金谷</Descriptions.Item>
  
      </Descriptions>); };

getMenu = (record) => {
     
  return (
  <Menu >
    <Menu.Item  onClick={() => this.editPro(record, 0)} key={1}>
      
       基本信息
      
    </Menu.Item>
  
    <Menu.Item onClick={() => this.editPro(record, 1)} key={2}>
    
       项目业态
      
    </Menu.Item>
    <Menu.Item onClick={() => this.editPro(record, 2)} key={3}>
    
   交付标准
   
 </Menu.Item>
  </Menu>);
};
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
        title: '项目名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '项目类型',
        dataIndex: 'type',
        width: 150,
        render: (text, record) => {

          if (text === 1) {
              return "住宅";

          }
          else if (text === 2) {
            return "写字楼";
          }
        }
      },
      { 
        title: '占地面积',
       dataIndex: 'cover_area', 
       width: 150 
      },
      { 
        title: '开工日期',
       dataIndex: 'start_time', 
       width: 150 
      },
      {
        title: '竣工日期',
        dataIndex: 'end_time',
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
      { title: '项目管理' },
      { title: '项目管理', href: '/project/projectmanage' },
    ];



    
   
    return (
      
      <PageHeaderLayout title="项目管理" breadcrumbList={breadcrumbList}
      
     >
         
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <PButton code="add" icon="plus" type="primary" onClick={() => this.handleAddClick()}>
                新建
              </PButton>
              {selectedRows.length === 1 
              && 
              (selectedRows[selectedRows.length - 1].org_id !== "") 
              && [
               <Dropdown overlay={() => this.getMenu(selectedRows[0])} placement="bottomCenter">
                <PButton
                  key="edit"
                  code="edit"
                  icon="edit"
                 // onClick={() => this.handleEditClick(selectedRows[0])}
                >
                  编辑
                </PButton>
                 </Dropdown>,
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
                size="small"
              />
            </div>
          </div>
        </Card>
        {this.renderDataForm()}
        {this.renderDataNewForm()}
      </PageHeaderLayout>
   
    );
  }
}

export default ProjectManageList;
