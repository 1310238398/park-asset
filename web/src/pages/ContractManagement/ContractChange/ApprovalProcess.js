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
import styles from './ContractChange.less';
const FormItem = Form.Item;
@connect(state => ({
  contractSiging: state.contractSiging,
  loading: state.loading.models.contractSiging,
}))
@Form.create()
class ApprovalProcess extends PureComponent {

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
        title: '节点',
        dataIndex: 'name',
      },
      {
        title: '意见',
        dataIndex: 'index',
      },
      {
        title: '操作',
        dataIndex: 'address',
      },
      {
        title: '操作人',
        dataIndex: 'sex',
      },
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
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b541',
        index: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
        sex: 'nan',
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b54e',
        index: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
        sex: 'nan',
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
                size="small"
              ></Table>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
export default ApprovalProcess;
