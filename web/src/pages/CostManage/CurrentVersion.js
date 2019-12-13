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
import CreateNewVersion from './CreateNewVersion';
import SelectNewVersionMode from './SelectNewVersionMode';
import NewVersionName from './NewVersionName';
import { updateCurrentVersionInfo } from '@/services/costAccount';
const FormItem = Form.Item;
const EditableContext = React.createContext();
class EditableCell extends React.Component {
  state = {
    toposNode: ['税种1', '税种2', '税种3'],
  };
  renderToposNode = data => {
    let ret = [];
    ret = data.map(obj => {
      return (
        <Select.Option key={obj} value={obj}>
          {obj}
        </Select.Option>
      );
    });
    return ret;
  };
  getInput = () => {
    let handleChange = value => {
      console.log(value);
    };
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    } else if (this.props.inputType === 'select') {
      const { toposNode } = this.state;
      return (
        <div>
          <Select
            //mode="multiple"
            style={{ width: 120 }}
            onBlur={handleChange}
            // onChange={handleChange}
          >
            {this.renderToposNode(toposNode)}
          </Select>
        </div>
      );
    } else if (this.props.inputType === 'text') {
      return <Input />;
    }
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
      // style={{ paddingLeft: 5, paddingRight: 5 }}
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
  // projectManage: state.projectManage,
  costAccount: state.costAccount,
  currentVersion: state.currentVersion,
  // costList: state.costList,
  loading: state.loading.models.currentVersion,
}))
@Form.create()
class CurrentVersion extends PureComponent {
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
          if (text && text.indexOf('%') !== -1) {
            return <span>{text}</span>;
          } else {
            return (
              <span>
                {text && this.statusValueW(text).replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}
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
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '10%',
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

                        record.index
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
              <a disabled={editingKey !== ''} onClick={() => this.edit(record.index)}>
                编辑
              </a>
            </div>
          );
        },
      },
    ],

    view_columns:  [
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
          if (text && text.indexOf('%') !== -1) {
            return <span>{text}</span>;
          } else {
            return (
              <span>
                {text && this.statusValueW(text).replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}
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
    editingKey: '',
  };

  componentDidMount = async () => {
    const {
      costAccount: { formID },
    } = this.props;

    this.dispatch({
      type: 'currentVersion/fetch',
      payload: formID,
    });
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

  isEditing = record => record.index === this.state.editingKey;
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

  save(form, index) {
    const {
      currentVersion: { data, currentVersionID },
    } = this.props;

    form.validateFields(async (error, row) => {
      console.log('row ');
      console.log(row);
      if (error) {
        return;
      }

      const newData = data;

      const index_ = newData.findIndex(item => index === item.index);
      if (index_ > -1) {
        const item = newData[index_];
        row.index = index;
        newData.splice(index_, 1, {
          ...item,
          ...row,
        });
        let response;
        response = await updateCurrentVersionInfo(row, currentVersionID);
        if (response.status && response.status === 'OK') {
          message.success('更新成功');
          this.setState({ editingKey: '' });
          this.dispatch({
            type: 'currentVersion/saveData',
            payload: [...newData],
          });
        }
      }
    });
  }

  renderSaveVersion = () => {
    return <CreateNewVersion></CreateNewVersion>;
  };

  renderSelectNewMode = () => {
    return <SelectNewVersionMode></SelectNewVersionMode>;
  };
  renderNewVersionName = () => {
    return <NewVersionName></NewVersionName>;
  };

  selectCreateMode() {
    // 选择创建方式
    console.log('选择创建方式');
    this.dispatch({
      type: 'currentVersion/saveSelectNewModeVisile',
      payload: true,
    });
  }

  submitAudit() { // 提交审核
    const { costAccount:{ formID }} = this.props;
    this.dispatch({
      type: 'currentVersion/submitExamine',
      payload: formID,
    });

  }

  auditPass() {
    const { costAccount:{ formID }} = this.props;
    this.dispatch({
      type: 'currentVersion/auditPass',
      payload: formID,
    });
  }

  auditReject() {
    const { costAccount:{ formID }} = this.props;
    this.dispatch({
      type: 'currentVersion/auditRejected',
      payload: formID,
    });
  }

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      costAccount: { formType },
      currentVersion: { canSave, data, canExamine },
    } = this.props;
    const { tableData, columns, view_columns } = this.state;

    const components = {
      body: {
        // row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const ecolumns = this.mapEditColumns(columns);
    return (
      <div>
        <EditableContext.Provider value={this.props.form}>
          {
            formType === "E" &&   <div style={{ marginTop: 0, marginBottom: 10, textAlign: 'left' }}>
            <Button
              type="primary"
              disabled={!canSave}
              style={{ marginRight: 20}}
              onClick={() => {
                this.selectCreateMode();
              }}
            >
              保存版本
            </Button>
            <Button
              type="primary"
              disabled={!canSave}
              onClick={() => {
                this.submitAudit();
              
              }}
            >
              提交审核
            </Button>
          </div>
          }
        
          <Table
            components={components}
            bordered
            loading={loading}
            rowKey={record => record.index}
            dataSource={data}
            columns={formType === 'E' ? ecolumns : formType === 'V' ? view_columns : null} //{view_columns}
            pagination={false}
            scroll={{ y: 500, x: 'calc(100%)' }}
            rowClassName="editable-row"
          ></Table>
          {
            formType === 'E' && 
            <div style={{ marginTop: 20, marginBottom: 20, textAlign: 'center' }}>
            <Button
              type="primary"
              disabled={!canExamine}
              style={{ marginRight: 20}}
              onClick={() => {
                this.auditPass();
              }}
            >
              通过
            </Button>
            <Button
              type="primary"
              disabled={!canExamine}
             
              onClick={() => {
                this.auditReject();
              }}
            >
              驳回
            </Button>
          </div>
          }
           
        </EditableContext.Provider>
        {this.renderSaveVersion()}
        {this.renderSelectNewMode()}
        {this.renderNewVersionName()}
      </div>
    );
  }
}
export default CurrentVersion;
