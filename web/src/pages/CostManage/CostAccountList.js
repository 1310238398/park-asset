import React, { PureComponent } from 'react';
import { Row, Col, Card, Form, Input, Button, Table, Modal, Select,Descriptions } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import DicShow from '@/components/DictionaryNew/DicShow';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import styles from './CostAccount.less';
//import { catchClause } from '@babel/types';
const data = [];
for (let i = 0; i < 3; i++) {
  data.push({
    key: i.toString(),
    name: `控股集团 ${i}`,
    isPro: false,
    type:"",
    floor_area:"",
    return_rate:"",

   
    children: [
      {
        key: i.toString() + '-1',
        name: '二级公司' + i.toString() + '-1',
        isPro: false,
        type:"",
        floor_area:"",
        return_rate:"",
      },
      {
        key: i.toString() + '-2',
        name: '二级公司' + i.toString() + '-2',
        isPro: false,
        type:"",
        floor_area:"",
        return_rate:"",
        children: [
          {
            key: i.toString() + '-2-1',
            name: '汉峪金谷项目' + i.toString() + '-2-1',
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
   
      // selectedRowKeys: [],
      // selectedRows: [],
      expandHang: [],
      expandedRowKeys: [],
  };
  componentDidMount() {
    // 调接口
    this.dispatch({
      type: 'projectManage/fetch',
      search: {},
      pagination: {},
    });
    this.dispatch({
      type: 'costAccount/queryCompany',
    });
    this.dispatch({
      type: 'costAccount/queryPlotList',
    });
  }

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
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

  // 按照条件查询项目
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
    
      this.dispatch({
        type: 'projectManage/fetch',
        search: formData,
        pagination: {},
      });
      this.clearSelectRows();
    });
  };



  // 跳转写字楼
  
  renderSearchForm() {
    const {
      form: { getFieldDecorator },
      costAccount: { companyList, poltList },
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
            <Form.Item label="所属公司" >
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

  handleOnExpand = (expanded, record) => {
    console.log('handleOnExpand');
    const { expandHang } = this.state;

    //  let tempHang = expandHang;
    if (expanded) {
      console.log('true');
      console.log('push');
      expandHang.push(record.record_id);
      expandHang.sort();
    } else {
      console.log('false');
      for (let i = 0; i < expandHang.length; i++) {
        if (expandHang[i] === record.record_id) {
          if (i > 0) {
            console.log('pop');
            expandHang.splice(i, 1);
          } else {
            expandHang.splice(0, 1);
          }
        }
        if (record.children) {
          for (let y = 0; y < record.children.length; y++) {
            if (expandHang[i] === record.children[y].record_id) {
              console.log('hahah');
              delete expandHang[i];
            }
          }
        }
      }
    }
    this.setState({
      expandedRowKeys: [...expandHang],
    });

    console.log(this.state.expandHang);
  };

  goToDetail(item, type1) {
    // type V 查看  E 编辑

    
    this.dispatch({
      type: 'costAccount/redirectDetail',
      payload: {
        record_id: item.record_id,
        operType: type1
      },
    
    });


  }
 

  

  render() {
    const {
      loading,
      projectManage: {
        data: { list, pagination },
      },
    } = this.props;

  //  const { selectedRowKeys, selectedRows } = this.state;

    const columns = [
      {
        title: '组织机构/项目',
        dataIndex: 'name',
        width: "20%",
      //  ellipsis: true,
        // render: value => {
        //   return <img src={value} alt="" style={{ width: 60, height: 60 }} />;
        // },
      },
      {
        title: '项目类型',
        dataIndex: 'type',
        width: "10%",
        align:"center",
        render: (text, record) => {
          if (text === 1) {
            return <div>住宅</div>

          }
          else if (text === 2) {
            return <div>商业</div>
          }

        }
      },
      {
        title: '总建筑面积',
        dataIndex: 'floor_area',
        width: "15%",
        align:"center",
      },
      { title: '项目收入', dataIndex: 'total_sale', width: "15%" },
      {
        title: '项目收益率',
        dataIndex: 'return_rate',
        width: "15%",
        align:"center",
      },
      { // 非项目行 该单元格可以为null
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '15%',
        align:"center",
        render: (text, record) => {
          const { editingKey } = this.state;
        
          return record.org_id !== "" ? <div>
            <PButton   code="edit"  onClick={() => {this.goToDetail(record, 'E');}}>
              编辑
            </PButton>
            
              <PButton  code="view" style={{ marginLeft: 8 }} onClick={() => {this.goToDetail(record, 'V');}}>
              查看
              </PButton>
          
           
         
            </div>
            :
            null
          
         
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
              
            </div>
            <div>
              <Table
                // rowSelection={{
                //   selectedRowKeys,
                //   onChange: this.handleTableSelectRow,
                // }}
             
                loading={loading}
                rowKey={record => record.record_id}
                expandedRowKeys={this.state.expandedRowKeys}
                dataSource={list}//{data}
                columns={columns}
                pagination={false}//{paginationProps}
                scroll={{ y: 500}}
                onChange={this.handleTableChange}
                onExpand={this.handleOnExpand}

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
     
      </PageHeaderLayout>
   
    );
  }

}
export default CostAccountList;