import React, { PureComponent } from 'react';
import { Row, Col, Card, Form, Input, Button, Table, Modal, Select,Descriptions } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import DicShow from '@/components/DictionaryNew/DicShow';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import Link from 'umi/link';
import styles from './CostAccount.less';
//import { catchClause } from '@babel/types';
const data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    key: i.toString(),
    name: `控股集团测试长度测试长度测试长度 ${i}`,
    isPro: false,
    type:"",
    floor_area:"",
    return_rate:"",

   
    children: [
      {
        key: i.toString() + '-1',
        name: '二级公司测试长度测试长度测试长度' + i.toString() + '-1',
        isPro: false,
        type:"",
        floor_area:"",
        return_rate:"",
      },
      {
        key: i.toString() + '-2',
        name: '二级公司测试长度测试长度' + i.toString() + '-2',
        isPro: false,
        type:"",
        floor_area:"",
        return_rate:"",
        children: [
          {
            key: i.toString() + '-2-1',
            name: '汉峪金谷项目测试长度测试长度测试长度' + i.toString() + '-2-1',
            isPro: true,
            type:"商业",
        floor_area:"189，000",
        return_rate:"40%",
          },
        ],
      },
    ],
  });
}
@connect(state => ({
  projectManage: state.projectManage,
  costAccount: state.costAccount,
  loading: state.loading.models.costAccount,  //加载中效果
}))

// 成本核算列表界面
@Form.create()
class CostAccountList extends PureComponent {
  state = {
    projectList:[],
   
      selectedRowKeys: [],
      selectedRows: [],
      
    
  };
  componentDidMount() {
    // 调接口
    // this.dispatch({
    //   type: 'costAccount/fetch',
    //   search: {},
    //   pagination: {},
    // });
    // this.dispatch({
    //   type: 'projectManage/queryCompany',
    // });
    // this.dispatch({
    //   type: 'projectManage/queryPlotList',
    // });

   
  }


  // clearSelectRows = () => {
  //   const { selectedRowKeys } = this.state;
  //   if (selectedRowKeys.length === 0) {
  //     return;
  //   }
  //   this.setState({ selectedRowKeys: [], selectedRows: [] });
  // };

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

  // handleTableSelectRow = (keys, rows) => {
  //   this.setState({
  //     selectedRowKeys: keys,
  //     selectedRows: rows,
  //   });
  // };

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
    // return (
    //   <ProjectManageCard
    //     onCancel={this.handleDataFormCancel}
    //     onSubmit={this.handleDataFormSubmit}
    //   />
    // );
  }
  renderDataNewForm() {
    // return (
    //   <ProjectManageCardNew
    //     onCancel={this.handleDataNewFormCancel}
    //     onSubmit={this.handleDataFormSubmit}
    //   />
    // );
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
          <Col md={6} sm={24}>
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
          </Col>
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
        </Row>
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="所属公司">
              {getFieldDecorator('org_id')(
                <Select placeholder="请选择公司" style={{ width: '100%' }}>
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

 goToDetail() {


 }


  render() {
    const {
      loading,
      costAccount: {
        data: { list, pagination },
      },
    } = this.props;

  //  const { selectedRowKeys, selectedRows } = this.state;

    const columns = [
      {
        title: '组织机构/项目',
        dataIndex: 'name',
        width: "20%",
        ellipsis: true

        // render: value => {
        //   return <img src={value} alt="" style={{ width: 60, height: 60 }} />;
        // },
      },
      {
        title: '项目类型',
        dataIndex: 'type',
        width: "10%",
      },
      {
        title: '总建筑面积',
        dataIndex: 'floor_area',
        width: "15%",
      },
      { title: '项目收入', dataIndex: 'total_sale', width: "15%" },
      {
        title: '项目收益率',
        dataIndex: 'return_rate',
        width: "15%",
      },
      { // 非项目行 该单元格可以为null
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '15%',
        render: (text, record) => {
          const { editingKey } = this.state;
        
          return !record.isPro ? null:(  
            <div>
            <PButton   code="edit"  onClick={() => {}}>
              编辑
            </PButton>
            <Link to="/cost/detail">
              <PButton  code="view" style={{ marginLeft: 8 }} onClick={() => {}}>
              查看
              </PButton>
            </Link>
           
         
            </div>
          
          );
        },
      },
      // {
      //   title: '项目资产类型',
      //   dataIndex: 'asset_type',
      //   width: 150,
      //   render: value => {
      //     return <DicShow pcode="pa$#atype" code={value.split(',')} />;
      //   },
      // },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    const breadcrumbList = [
      { title: '成本管理' },
      { title: '成本核算', href: '/cost/list' },
    ];


    
   
    return (
      
      <PageHeaderLayout title="成本核算" breadcrumbList={breadcrumbList}
      //  content={ this.renderContent()}
       >
         
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              {/* <PButton code="add" icon="plus" type="primary" onClick={() => this.handleAddClick()}>
                新建
              </PButton> */}
              {/* {selectedRows.length === 1 && [
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
               
              ]} */}
            </div>
            <div>
              <Table
                // rowSelection={{
                //   selectedRowKeys,
                //   onChange: this.handleTableSelectRow,
                // }}
             
                loading={loading}
                rowKey={record => record.record_id}
                dataSource={data}
                columns={columns}
                pagination={false}//{paginationProps}
                scroll={{ y: 500}}
                onChange={this.handleTableChange}
                // onRow={record => {
                //   return {
                //     onClick: () => {
                //       this.onItemDetailClick(record);
                //     },
                //   };
                // }}
               // size="small"
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
export default CostAccountList;