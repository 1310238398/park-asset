import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, Tree, Table, Card, Select, Button } from 'antd';
import PicturesWall from '../../components/PicturesWall/PicturesWall';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import GetLocation from './GetLocation';
import styles from './ProjectManage.less';

const { TreeNode } = Tree;
@connect(state => ({
  projectManage: state.projectManage,
}))
@Form.create()
class OrganizationSelect extends PureComponent {
  state = {
    expandedKeys: ['0-0-0', '0-0-1'],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    // this.dispatch({
    //   type: 'projectManage/queryCompany',
    // });
  }

  onOKClick = () => {
    const { form, onSubmit } = this.props;
    const { selectedRows } = this.state;

    console.log("选中的数据 ");
    console.log(selectedRows);
    // form.validateFieldsAndScroll((err, values) => {
    //   if (err) {
    //     return;
    //   }
    //   const formData = { ...values };

    //   onSubmit(formData);
    // });
    onSubmit(selectedRows);
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // // 地图选取经纬度
  // changeMap() {
  //   this.setState({ showMap: true });
  // }

  // // 关闭地图
  // cancelMap() {
  //   this.setState({ showMap: false });
  // }

  // // 地图经纬度
  // onDataMap(data) {
  //   // console.log('经纬度', data);
  //   const { form } = this.props;
  //   // let buildings = form.getFieldValue('location');
  //   form.setFieldsValue({ location: data });
  // }

  // renderMap() {
  //   if (this.state.showMap) {
  //     return (
  //       <div>
  //         <GetLocation onCancel={this.cancelMap} onSubmit={this.onDataMap} />
  //       </div>
  //     );
  //   }
  // }

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });

    handleSelect = (record, selected, selectedRows, nativeEvent) => {
      console.log("TablehandleSelect ");
     
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

    clearSelectRows = () => {
      const { selectedRowKeys } = this.state;
      if (selectedRowKeys.length === 0) {
        return;
      }
      this.setState({ selectedRowKeys: [], selectedRows: [] });
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
        
        this.dispatch({
          type: 'projectManage/fetch',
          search: formData,
          pagination: {},
        });
        this.clearSelectRows();
      });
    };

    renderSearchForm() {
      const {
        form: { getFieldDecorator },
        projectManage: { companyList, poltList },
      } = this.props;
  
      return (
        <Form onSubmit={this.handleSearchFormSubmit} layout="inline">
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="姓名" style={{marginBottom: 0}}>
                {getFieldDecorator('name')(<Input placeholder="请输入姓名" />)}
              </Form.Item>
            </Col>

            <Col md={12} sm={24}>
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
    const {
      projectManage: {
        formData,
        submitting,
        data: { list, pagination },
        selectUserFromOrganizationVisible,
      },
      form: { getFieldDecorator },
      onCancel,
    } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;

    const treeData = [
      {
        title: '0-0',
        key: '0-0',
        children: [
          {
            title: '0-0-0',
            key: '0-0-0',
            children: [
              { title: '0-0-0-0', key: '0-0-0-0' },
              { title: '0-0-0-1', key: '0-0-0-1' },
              { title: '0-0-0-2', key: '0-0-0-2' },
            ],
          },
          {
            title: '0-0-1',
            key: '0-0-1',
            children: [
              { title: '0-0-1-0', key: '0-0-1-0' },
              { title: '0-0-1-1', key: '0-0-1-1' },
              { title: '0-0-1-2', key: '0-0-1-2' },
            ],
          },
          {
            title: '0-0-2',
            key: '0-0-2',
          },
        ],
      },
      {
        title: '0-1',
        key: '0-1',
        children: [
          { title: '0-1-0-0', key: '0-1-0-0' },
          { title: '0-1-0-1', key: '0-1-0-1' },
          { title: '0-1-0-2', key: '0-1-0-2' },
        ],
      },
      {
        title: '0-2',
        key: '0-2',
      },
    ];

    const tableData = [

      {
        name: "张三",
        company: "山东高新通",
        department: "技术部",
        position: "员工",
        record_id:"01",
      },
      
      {
        name: "张三",
        company: "山东高新通",
        department: "技术部",
        position: "员工",
        record_id:"02",
      },
      
      {
        name: "张三",
        company: "山东高新通",
        department: "技术部",
        position: "员工",
        record_id:"03",
      },
      
      {
        name: "张三",
        company: "山东高新通",
        department: "技术部",
        position: "员工",
        record_id:"04",
      },
      
      {
        name: "张三",
        company: "山东高新通",
        department: "技术部",
        position: "员工",
        record_id:"05",
      },
      
      {
        name: "张三",
        company: "山东高新通",
        department: "技术部",
        position: "员工",
        record_id:"06",
      },
      
    ];

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const formItemLayout2 = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };

    const columns = [
      
      {
        title: '姓名',
        dataIndex: 'name',
        width: 100,
      },
      {
        title: '公司',
        dataIndex: 'company',
        width: 150,
       
      },
      { 
        title: '部门',
       dataIndex: 'department', 
       width: 100 
      },
      { 
        title: '职位',
       dataIndex: 'position', 
       width: 100 
      },
     
    
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    return (
      <Modal
        title="请选择人员"
        width={800}
        visible={selectUserFromOrganizationVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        // style={{ Top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto', paddingBottom: 15, paddingTop: 15 }}
      >
        <div style={{ width: '100%'}}>
          <Row style={{ marginBottom: 5, display:"flex", justifyContent: "flex-start", alignItems: "center"}}>
            <Col span={6} style={{ paddingRight: 10}}>
              <span>所有部门：</span>
            </Col>
            <Col span={18}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            </Col>
          </Row>
          <Row>
          <Col span={6} style={{ paddingRight: 10}}>
          
            {/* <div style={{ height: 300, overflow: "auto"}}> */}
            <Card bodyStyle={{height: 300, overflow: "auto", paddingRight: 10, paddingTop: 10, paddingBottom: 10}}>
              <Tree
              checkable
              onExpand={this.onExpand}
              expandedKeys={this.state.expandedKeys}
              autoExpandParent={this.state.autoExpandParent}
              onCheck={this.onCheck}
              checkedKeys={this.state.checkedKeys}
              onSelect={this.onSelect}
              selectedKeys={this.state.selectedKeys}
              //style={{ height:300}}
              scroll={{y: 300}}
            >
              {this.renderTreeNodes(treeData)}
            </Tree>
            {/* </div> */}
            </Card>
          </Col>

          <Col span={18}>
          <Table
                rowSelection={{
                  selectedRowKeys,
                //  onChange: this.handleTableSelectRow,
                 // type: "radio",
                 onSelect: this.handleSelect,
                }}
              //  loading={loading}
                defaultExpandAllRows={true}
                rowKey={record => record.record_id}
                dataSource={tableData}
                columns={columns}
                pagination={paginationProps}
                onChange={this.handleTableChange}
                scroll={{ y: 350}}
                // onRow={record => {
                //   return {
                //     onClick: () => {
                //       this.onItemDetailClick(record);
                //     },
                //   };
                // }}
                size="small"
              />
          </Col>
        </Row>
        </div>
        
      </Modal>
    );
  }
}

export default OrganizationSelect;
