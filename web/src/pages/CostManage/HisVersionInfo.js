import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Modal,
  Table,
  message,
} from 'antd';
import styles from './CostAccount.less';

@connect(state => ({
  hisVersion: state.hisVersion,
  loading: state.loading.models.hisVersion,
}))
class HisVersionInfo extends PureComponent {
  state = {
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        width: '10%',
      },
      {
        title: '科目名称',
        dataIndex: 'name',
        width: '20%',
        // ellipsis: true,
        // align: 'center',
        // fixed: 'left',
      },
      {
        title: '数值(万元/%)',
        dataIndex: 'value',
        width: '30%',
        align: 'center',
        render: (text, record) => {
          if ((text+"").indexOf('%') !== -1) {
            return <span>{text}</span>;
          } else {
            return (
              <span>
                {this.statusValueW(text).replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}
              </span>
            );
          }
        },
      },
      {
        title: '备注',
        dataIndex: 'memo',
        width: '30%',
        editable: true,
        inputType: 'text',
        align: 'center',
      },
    ],

    tableData: [
      {
        record_id: '001',
        name: '成本科目1',
        cost_id: '001', // 成本项ID
        cost_parent_id: '', //成本项父级ID
        cost_parent_path: '', //成本项父级路经 具体到父级ID

        value: 111,
      },
      {
        record_id: '002',
        name: '成本科目2',
        cost_id: '002', // 成本项ID
        cost_parent_id: '', //成本项父级ID
        cost_parent_path: '', //成本项父级路经 具体到父级ID

        value: 111,
      },
      {
        record_id: '003',
        name: '成本科目3',
        cost_id: '003', // 成本项ID
        cost_parent_id: '', //成本项父级ID
        cost_parent_path: '', //成本项父级路经 具体到父级ID

        value: 111,
      },
      {
        record_id: '004',
        name: '成本科目3',
        cost_id: '004', // 成本项ID
        cost_parent_id: '', //成本项父级ID
        cost_parent_path: '', //成本项父级路经 具体到父级ID

        value: 111,
      },
      {
        record_id: '005',
        name: '成本科目3',
        cost_id: '005', // 成本项ID
        cost_parent_id: '', //成本项父级ID
        cost_parent_path: '', //成本项父级路经 具体到父级ID

        value: 111,
      },
      {
        record_id: '006',
        name: '成本科目3',
        cost_id: '006', // 成本项ID
        cost_parent_id: '', //成本项父级ID
        cost_parent_path: '', //成本项父级路经 具体到父级ID

        value: 111,
      },
    ],
  };

  componentDidMount = async () => {
  
   
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };
  // 判断数值
  statusValueW = value => {
    if (value && value !== 0) {
      return (value / 10000).toFixed(2);
    }
    return 0;
  };

  onCancelClick = () => {
    this.dispatch({
      type: 'hisVersion/changeInfoModalVisible',
      payload: false,
    });
  };

  render() {
    const {
      loading,
      hisVersion: { infoModalVisible, formData },
    } = this.props;
    const { tableData, columns } = this.state;

    return (
      <Modal
        title="版本详情"
        width="60%"
        centered={true}
        visible={infoModalVisible}
        maskClosable={false}
        // confirmLoading={submitting}
        destroyOnClose={true}
        footer={null}
        onCancel={this.onCancelClick}
      >
        <Table
          // components={components}
          bordered
          loading={loading}
          rowKey={record => record.index}
          dataSource={tableData}
          columns={columns}
          pagination={false}
          scroll={{ y: 500, x: 'calc(100%)' }}
          rowClassName="editable-row"
        ></Table>
      </Modal>
    );
  }
}
export default HisVersionInfo;
