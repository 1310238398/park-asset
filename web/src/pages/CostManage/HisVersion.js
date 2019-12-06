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
        dataIndex: 'name',
        width: '10%',
        // ellipsis: true,
        // align: 'center',
        // fixed: 'left',
      },
      {
        title: '投资回报率(%)',
        dataIndex: 'rate',
        width: '10%',

        align: 'center',
      },
      {
        title: '项目净利润(万元)',
        dataIndex: 'net_profit',
        width: '10%',

        align: 'center',
      },
      {
        title: '开发成本',
        dataIndex: 'development_cost',
        width: '10%',
        align: 'center',
      },
      {
        title: '销售收入',
        dataIndex: 'sales_revenue',
        width: '10%',
        align: 'center',
      },
      {
        title: '负责人',
        dataIndex: 'person',
        width: '10%',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'time',
        width: '10%',
        align: 'center',
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
    tableData: [
      {
        record_id: '001',
        name: '版本1',
        cost_id: '001', // 成本项ID
        cost_parent_id: '', //成本项父级ID
        cost_parent_path: '', //成本项父级路经 具体到父级ID

        value: 111,
      },
      {
        record_id: '002',
        name: '版本2',
        cost_id: '002', // 成本项ID
        cost_parent_id: '', //成本项父级ID
        cost_parent_path: '', //成本项父级路经 具体到父级ID

        value: 111,
      },
      {
        record_id: '003',
        name: '版本3',
        cost_id: '003', // 成本项ID
        cost_parent_id: '', //成本项父级ID
        cost_parent_path: '', //成本项父级路经 具体到父级ID

        value: 111,
      },
    ],
  };

  componentDidMount = async () => {};

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  isEditing = record => record.cost_id === this.state.editingKey;
  mapEditColumns = columns => {
    const ecolumns = [];
    columns.forEach(item => {
      const eitem = { ...item };
      if (eitem.editable) {
        eitem.onCell = record => ({
          record,
          inputType: eitem.inputType,
          dataIndex: item.dataIndex,
          title: item.title,
          editing: this.isEditing(record),
        });
      }

      if (eitem.children) {
        eitem.children = this.mapEditColumns(eitem.children);
      }
      ecolumns.push(eitem);
    });
    return ecolumns;
  };

  cancel = () => {
    this.setState({ editingKey: '' });
  };
  edit(key) {
    console.log(`key:${key}`);
    this.setState({ editingKey: key });
  }

  save(form, key) {
    form.validateFields((error, row) => {
      console.log('row ');
      console.log(row);
      if (error) {
        return;
      }

      this.setState({ editingKey: '' });
    });
  }

  goToDetail(record_id) {
    console.log('goToDetail');

    //查询历史版本详情
    this.dispatch({
      type: 'hisVersion/changeInfoModalVisible',
      payload: true,
    });
  }

  renderInfo() {
      return <HisVersionInfo></HisVersionInfo>
  }

  render() {
    const {
      loading,
      costAccount: { formType },
    } = this.props;
    const { tableData, columns } = this.state;

    const ecolumns = this.mapEditColumns(columns);
    return (
      <div>
        <Table
          // components={components}
          bordered
          loading={loading}
          rowKey={record => record.record_id}
          dataSource={tableData}
          columns={formType === 'E' ? ecolumns : formType === 'V' ? view_columns : null} //{view_columns}
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
