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
  loading: state.loading.models.contractSiging,
}))
@Form.create()
class ContractSettlement extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const {
      formID
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
        title: '结算编号',
        dataIndex: 'name',
        width: 100,
      },
      {
        title: '对应合同金额',
        dataIndex: 'index',
        width: 150,
      },
      {
        title: '报送结算金额',
        dataIndex: 'address',
        width: 150,
      },
      {
        title: '确认结算金额',
        dataIndex: 'sex',
        width: 150,
      },

      {
        title: '其中甲供材金额',
        dataIndex: 'tags',
        width: 150,
      },
      {
        title: '应支付结算金额',
        dataIndex: 'age',
        width: 150,
      },
      {
        title: '发起日期',
        dataIndex: 'date',
        width: 150,
      },
      {
        title: '发起人',
        dataIndex: 'creator',
        width: 150,
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
        creator:'王五',
        date:'2019-02-10'
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b541',
        index: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
        sex: 'nan',
        creator:'王五',
        date:'2019-02-10'
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b54e',
        index: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
        sex: 'nan',
        creator:'王五',
        date:'2019-02-10'
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
export default ContractSettlement;
