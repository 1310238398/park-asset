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
// 计算合计值
function sum(type, arr) {
  var s = 0;
  arr.forEach(function(val, idx, arr) {
    switch (type) {
      case 'quote_c':
        s += val.quote_c;
        break;
      case 'quote_w':
        s += val.quote_w;
        break;
    }
  }, 0);
  return s;
}


@connect(state => ({
  contractSiging: state.contractSiging,
  materialPricing:state.materialPricing,
  loading: state.loading.models.contractSiging,
}))
@Form.create()
class MaterialPricing extends PureComponent {
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
  
  componentDidMount() {
    this.props.dispatch({
      type: 'materialPricing/fetchChangeReason',
    });
  }

  render() {
    const { dataSource } = this.state;
    const {
      materialPricing: { materialPricingList },
    } = this.props;
    const columns = [
      {
        title: '施工单位',
        dataIndex: 'working_name',
        width: 100,
      },
      {
        title: '批价原因',
        dataIndex: 'reason',
        width: 150,
        render: (text, record) => {
          return <div>{arrCon(materialPricingList, record.reason)}</div>;
        },
      },
      {
        title: '施工单位报价合计',
        dataIndex: 'quote_w',
        width: 150,
        render: (text, record) => {
          return <div>{sum('quote_w', record.quotes)}</div>;
        },
      },
      {
        title: '提案价合计',
        dataIndex: 'sex',
        width: 150,
      },

      {
        title: '审定价合计',
        dataIndex: 'tags',
        width: 150,
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
        width: 100,
        render: val => {
          let value =val.toString();
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
export default MaterialPricing;
