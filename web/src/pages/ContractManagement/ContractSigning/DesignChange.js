import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
  Card,
  Col,
  Input,
  Modal,
  Dropdown,
  Popconfirm,
  Select,
  Radio,
  Table,
  message,
  Divider,
  Button,
  InputNumber,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import styles from './ContractSigning.less';
const FormItem = Form.Item;
@connect(state => ({
  contractSiging: state.contractSiging,
  contractSupplement: state.contractSupplement,
  loading: state.loading.models.contractSiging,
}))
@Form.create()
class DesignChange extends PureComponent {

  componentDidMount() {
    const {
      contractSiging: { formID },
    } = this.props;

    // this.dispatch({
    //   type: 'contractSiging/fetch',
    //   search: {},
    //   pagination: {},
    //   pro_id: formID,
    // });
  }

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      contractSiging: {
        formTypeSiging,
        dataSiging: { list, pagination },
      },
    } = this.props;
    const columns = [
      {
        title: '设计编号',
        dataIndex: 'index',
        width: 100,
      },
      {
        title: '变更部位',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '变更内容',
        dataIndex: 'address',
        width: 150,
      },
      {
        title: '变更原因',
        dataIndex: 'sex',
        width: 150,
      },
      {
        title: '预估变更金额',
        dataIndex: 'tags',
        width: 150,
      },
      {
        title: '审定金额',
        dataIndex: 'age',
        width: 100,
      }, {
        title: '发起日期',
        dataIndex: 'date',
        width: 140,
      },
      {
        title: '发起人',
        dataIndex: 'creator',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
      }
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    const data = [
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b542',
        index: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
        sex: 'nan',
        date:'2019-10-12',
        status:'2',
        creator:'张三'
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b541',
        index: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
        sex: 'nan',
        date:'2019-10-12',
        status:'1',
        creator:'张三'
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b54e',
        index: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
        sex: 'nan',
        date:'2019-10-12',
        status:'0',
        creator:'张三'
      },
    ];

    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div>
              <Table
                dataSource={data}
                columns={columns}
                pagination={false}
              ></Table>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
export default DesignChange;
