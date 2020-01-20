import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card,} from 'antd';
import styles from '../../ProjectManage/ProjectManage.less';

@connect(state => ({
    entrustedConstruction: state.entrustedConstruction,
  
    loading: state.loading.models.entrustedConstruction,
  }))
  class OperationHis extends PureComponent {
      state = {

      };
      componentDidMount = () => {};

      dispatch = action => {
        const { dispatch } = this.props;
        dispatch(action);
      };

      handleTableChange = pagination => {
        this.dispatch({
          type: '',
          pagination: {
            current: pagination.current,
            pageSize: pagination.pageSize,
          },
        });
        this.clearSelectRows();
      };

      render() {

        const {
            loading
        } = this.props;
    const columns = [
      
        {
          title: '操作',
          dataIndex: 'operation',
          width: 200,
          align: 'center',
        },
        {
          title: '操作人',
          dataIndex: 'oper_people',
          width: 150,
          align: 'center',
        },
        {
          title: '时间',
          dataIndex: 'oper_time',
          width: 150,
          align: 'center',
        },
       
      ];

      const list = [
          {
            record_id: "01",
            operation: "上传合同",
            oper_people: "岳彩彩",
            oper_time: "2020-01-12"

          },
          {
            record_id: "02",
            operation: "上传合同",
            oper_people: "岳彩彩",
            oper_time: "2020-01-12"

          },
          {
            record_id: "03",
            operation: "上传合同",
            oper_people: "岳彩彩",
            oper_time: "2020-01-12"

          },
          {
            record_id: "04",
            operation: "上传合同",
            oper_people: "岳彩彩",
            oper_time: "2020-01-12"

          }
      ];

      const pagination= {
        current: 1,
        pageSize: 5,
      };

      const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => <span>共{total}条</span>,
        ...pagination,
      };

      return (
          <Card bordered={false} bodyStyle={{ paddingTop: 0 }}>

            <Table
              loading={loading}
              rowKey={record => record.record_id}
              dataSource={list}
              columns={columns}
              scroll={{ y: 500 }}
              pagination={paginationProps}
              onChange={this.handleTableChange}
            >

            </Table>
          </Card>
      );
      }
    
  }

  export default OperationHis;