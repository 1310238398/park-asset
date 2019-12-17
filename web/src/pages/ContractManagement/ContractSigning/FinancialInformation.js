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
class FinancialInformation extends PureComponent {
 
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
        title: '序号',
        dataIndex: 'index',
        width: 100,
      },
      {
        title: '日期',
        dataIndex: 'date',
        width: 150,
      },
      {
        title: '财务编号',
        dataIndex: 'address',
        width: 200,
      },
      {
        title: '财务名称',
        dataIndex: 'sex',
        width: 200,
      },
      {
        title: '凭证号',
        dataIndex: 'tags',
        width: 150,
      },
      {
        title: '摘要',
        dataIndex: 'age',
        width: 150,
      },
      {
        title: '开发成本',
        dataIndex: 'ye',
        width:  100,
      },
      {
        title: '应付账款',
        dataIndex: 'yif',
        width:  100,
      },
      {
        title: '预付账款',
        dataIndex: 'yf',
        width:  100,
      },
      {
        title: '其他应收款',
        dataIndex: 'ys',
        width: 150,
      },
      {
        title: '期间费用',
        dataIndex: 'qj',
        width:  100,
      },{
        title: '操作人',
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
        date:'2019-10-22',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
        sex: 'nan',
        ye:233,
        yf:333,
        creator:'sssss',
        qt:222,
        qj:4455,
        ys:333,
        yif:3335
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b541',
        index: '2',
        date:'2019-10-22',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
        sex: 'nan',
        ye:555,
        yf:333,
        creator:'sssss',
        qt:222,
        qj:4455,
        ys:333,
        yif:3335
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b54e',
        index: '3',
        date:'2019-10-22',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
        sex: 'nan',
        ye:233,
        yf:333,
        creator:'sssss',
        qt:222,
        qj:4455,
        ys:333,
        yif:3335
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
                scroll={{ x: 1200 }} 
              ></Table>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
export default FinancialInformation;
