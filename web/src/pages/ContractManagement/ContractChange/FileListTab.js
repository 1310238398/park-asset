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
class fileListTab extends PureComponent {

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
      // {
      //   title: '图标',
      //   dataIndex: 'name',
      // },
      {
        title: '附件名称',
        dataIndex: 'name',
      },
      {
        title: '附件大小',
        dataIndex: 'index',
      },
      {
        title: '操作',
        dataIndex: '',
        width: 150,
        render: (text, record) => {
          return <span>
            <a  href={record.url} target="_blank">打开</a>
          </span>
        },
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
        creator:'里斯',
        date:'2019-10-23',
        status:'2'
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b541',
        index: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
        sex: 'nan',
        creator:'里斯',
        date:'2019-10-23',
        status:'2'
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b54e',
        index: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
        sex: 'nan',
        creator:'里斯',
        date:'2019-10-23',
        status:'2'
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
export default fileListTab;
