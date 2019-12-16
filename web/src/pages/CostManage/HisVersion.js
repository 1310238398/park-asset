import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
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
import styles from './CostAccount.less';
import {} from '@/services/costAccount';
import HisVersionInfo from './HisVersionInfo';
import moment from 'moment';
const FormItem = Form.Item;

@connect(state => ({
  // projectManage: state.projectManage,
  costAccount: state.costAccount,
  hisVersion: state.hisVersion,

  loading: state.loading.models.hisVersion,
}))
class HisVersion extends PureComponent {
  state = {
    columns: [
      {
        title: '版本名',
        dataIndex: 'version_name',
        width: '10%',
        // ellipsis: true,
        // align: 'center',
        // fixed: 'left',
      },
      {
        title: '投资回报率(%)',
        dataIndex: 'payback_rate',
        width: '10%',

        align: 'center',
      },
      {
        title: '项目净利润(万元)',
        dataIndex: 'net_profit',
        width: '10%',
        align: 'center',
        render: (text, record) => {
          return <span>{this.statusValueW(text).replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</span>
        }
      },
      {
        title: '开发成本(万元)',
        dataIndex: 'total_cost',
        width: '10%',
        align: 'center',
        render: (text, record) => {
          return <span>{this.statusValueW(text).replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</span>
        }
      },
      {
        title: '销售收入(万元)',
        dataIndex: 'total_sale',
        width: '10%',
        align: 'center',
        render: (text, record) => {
          return <span>{this.statusValueW(text).replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</span>
        }
      },
      {
        title: '负责人',
        dataIndex: 'principal',
        width: '10%',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'done_time',
        width: '10%',
        align: 'center',
        render: (text, record) => {

         return  record.done_time === null ? "":
          moment(record.done_time).format('YYYY-MM-DD')
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '10%',
        align: 'center',
        // fixed: 'right',
        render: (text, record) => {
          return (
            <div style={{ textAlign: 'center' }}>
              <a
                onClick={() => {
                  this.goToDetail(record.record_id);
                }}
              >
                查看
              </a>
            </div>
          );
        },
      },
    ],
   
  };

  componentDidMount = async () => {
    const { costAccount: { formID }} = this.props;
    this.dispatch(
      {
        type: "hisVersion/fetch",
        payload:{
          projectID: formID,
          flag: 2
        }
      }
    );
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // 判断数值
  statusValueW = value => {
    if (value && value !== 0) {
      return (value / (10000)).toFixed(2);
    }
    return '0';
  };
  goToDetail(record_id) {
    console.log('goToDetail');
  
    this.dispatch({
      type: "hisVersion/fetchForm",
      payload: {
        record_id: record_id,
      }
    });
    // this.dispatch({
    //   type: 'hisVersion/saveFormID',
    //   payload:  record_id 
      
    // });

    //查询历史版本详情
    // this.dispatch({
    //   type: 'hisVersion/changeInfoModalVisible',
    //   payload: true,
    // });
  }

  renderInfo() {
      return <HisVersionInfo></HisVersionInfo>
  }

  render() {
    const {
      loading,
      costAccount: { formType },
      hisVersion: {data},
    } = this.props;
    const {  columns } = this.state;

   
    return (
      <div>
        <Table
       
          bordered
          loading={loading}
          rowKey={record => record.record_id}
          dataSource={data}//{tableData}
          columns={columns}
          pagination={false}
          scroll={{ y: 800, x: 'calc(100%)' }}
          rowClassName="editable-row"
        ></Table>
        {
            this.renderInfo()
        }
      </div>
    );
  }
}
export default HisVersion;
