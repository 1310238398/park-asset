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
import DicShow from '@/components/DictionaryNew/DicShow';
const FormItem = Form.Item;
// 取得字典值对应的值
function arrCon(arrL, arr) {
  let arrName = '';
  arrL.forEach(el => {
    if (arr && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (el.value === arr[i]) {
          arrName += el.label;
          arrName += '，';
        }
      }
    }
  });
  return arrName.substring(0, arrName.length - 1);
}

@connect(state => ({
  contractSiging: state.contractSiging,
  visaChange: state.visaChange,
  loading: state.loading.models.contractSiging,
}))
@Form.create()
class VisaChange extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.data ? props.data : [],
    };
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

  componentDidMount() {
    this.props.dispatch({
      type: 'visaChange/fetchChangeReason',
    });
  }

  render() {
    const { dataSource } = this.state;
    const {
      visaChange: { visaChangeList },
    } = this.props;
    const columns = [
      {
        title: '签证编号',
        dataIndex: 'sn',
        width: 100,
      },
      {
        title: '签证原因',
        dataIndex: 'reason',
        width: 150,
        render: (text, record) => {
          return <div>{arrCon(visaChangeList, record.reason)}</div>;
        },
      },
      {
        title: '签证内容',
        dataIndex: 'content',
        width: 150,
      },
      {
        title: '签证报价',
        dataIndex: 'estimate',
        width: 100,
      },

      {
        title: '动态成本关联值',
        dataIndex: 'tags',
        width: 200,
      },
      {
        title: '审定金额',
        dataIndex: 'age',
        width: 100,
      },
      {
        title: '发起日期',
        dataIndex: 'launch_date',
        width: 140,
        render: (text, record) => {
          return (
            <div style={{ textAlign: 'center' }}>
              {!record.launch_date ? '' : moment(record.launch_date).format('YYYY-MM-DD')}
            </div>
          );
        },
      },
      {
        title: '发起人',
        dataIndex: 'launch_person',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 150,
        render: val => {
          let value = val.toString();
          return <DicShow pcode="contract$#ChangeStatus" code={[value]} />;
        },
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
export default VisaChange;
