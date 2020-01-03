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
   this.state={
     dataSource : props.data ? props.data :[]
   }
  }
  static getDerivedStateFromProps(nextProps, state) {
    if ('data' in nextProps) {
      return {
        ...state,
        dataSource: nextProps.data,
      };
    }
    return state;
  }

  render() {
    const { dataSource } = this.state;
    const columns = [
      {
        title: '结算编号',
        dataIndex: 'report_no',
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
        dataIndex: 'report_date',
        width: 150,
        render: (text, record) => {
          return (
            <div style={{ textAlign: 'center' }}>
              {!record.report_date ? '' : moment(record.report_date).format('YYYY-MM-DD')}
            </div>
          );
        },
      },
      {
        title: '发起人',
        dataIndex: 'zaojiazixun_jingban',
        width: 150,
      },
    ];
   

    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div>
              <Table
                dataSource={dataSource.list}
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
