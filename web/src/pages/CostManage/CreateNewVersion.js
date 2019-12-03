import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Modal,
  Row,
  Col,
  Select,
  Radio,
  Steps,
  Button,
  message,
  Table,
  Popconfirm,
} from 'antd';

const EditableContext = React.createContext();
class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber placeholder="请输入" />;
    }
    return <Input placeholder="请输入" />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      // form: { getFieldDecorator, getFieldValue },
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `请输入 ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

@connect(state => ({
  currentVersion: state.currentVersion,
  costAccount: state.costAccount,
  loading: state.loading.models.currentVersion,
}))
@Form.create()
class CreateNewVersion extends PureComponent {
  state = {
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
    editingKey: '',
    columns: [
      {
        title: '科目名称',
        dataIndex: 'name',
        width: '20%',
        // ellipsis: true,
        // align: 'center',
        // fixed: 'left',
      },
      {
        title: '数值(万元)',
        dataIndex: 'value',
        width: '35%',

        align: 'center',
      },
      {
        title: '备注',
        dataIndex: 'memo',
        width: '30%',
        editable: true,
        inputType: 'text',

        align: 'center',
      },

      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '15%',
        align: 'center',
        // fixed: 'right',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <div style={{ textAlign: 'center' }}>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() =>
                      this.save(
                        form,
                        record.parent_path !== ''
                          ? record.parent_path + '/' + record.record_id
                          : record.record_id
                      )
                    }
                    style={{ marginRight: 8 }}
                  >
                    保存
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="确定取消修改?" onConfirm={() => this.cancel()}>
                <a>取消</a>
              </Popconfirm>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <a disabled={editingKey !== ''} onClick={() => this.edit(record.record_id)}>
                编辑
              </a>
            </div>
          );
        },
      },
    ],
  };
  componentDidMount() {}
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onCancelClick = () => {
    this.dispatch({
      type: 'currentVersion/saveNewFormVisible',
      payload: false,
    });
  };

  edit(key) {
    console.log(`key:${key}`);
    this.setState({ editingKey: key });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
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
  isEditing = record => record.record_id === this.state.editingKey;
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

  render() {
    const {
      loading,
      currentVersion: { submitting, newFormVisible },
      costAccount: { formType },
    } = this.props;
    const { tableData, columns } = this.state;
    const components = {
      body: {
        //row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const ecolumns = this.mapEditColumns(columns);
    return (
      <Modal
        title="创建新版本"
        width="60%"
        centered={true}
        visible={newFormVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose={true}
        // onOk={this.onOKClick}
        onCancel={this.onCancelClick}
        //   style={{ height: 800 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', height: '500px', overflowY: 'auto' }}
      >
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={tableData}
            columns={formType === 'E' ? ecolumns : formType === 'V' ? view_columns : null} //{view_columns}
            rowClassName="editable-row"
            rowKey={record => record.record_id}
            loading={loading}
          ></Table>
        </EditableContext.Provider>
      </Modal>
    );
  }
}
export default CreateNewVersion;
