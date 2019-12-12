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
        memo:	"备注",
        type: 1,
        previous: "123345",
        current: "345333",
        difference:"23232",

        
      },
      {
        record_id: '002',
        name: '成本科目2',
        memo:	"备注",
        type: 1,

        previous:"123454",
        current: "345567",
         difference:"23232",
      },
      {
        record_id: '003',
        name: '成本科目3',
        memo:	"备注",
        type: 1,
        previous: "123345",
        current: "345333",
        difference:"23232",
      },
      {
        record_id: '004',
        name: '成本科目3',
        memo:	"备注",
        type: 1,

        previous: "123345",
        current: "345333",
        difference:"23232",
      },
      {
        record_id: '005',
        name: '成本科目3',
        memo:	"备注",
        type: 1,

        previous: "123345",
        current: "345333",
        difference:"23232",
      },
      {
        record_id: '006',
        name: '成本科目3',
        memo:	"备注",
        type: 1,
        previous: "123345",
        current: "345333",
        difference:"23232",
      },
    ],
    editingKey: '',

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

  onOKClick = () => {
    const { currentVersion : { compareTree, saveType},
    costAccount: { formID }
  
  } = this.props;
    console.log("暂存数据 ");
    console.log(compareTree);
    if (saveType === '1') { // 创建新版本
    this.dispatch({
      type: 'currentVersion/saveNewFormVisible',
      payload: false,
    });
    this.dispatch({
      type: 'currentVersion/saveVersionNameVisible',
      payload: true,
    });
    }
    else if (saveType === '2') { // 保存旧版本

      this.dispatch({
        type: 'currentVersion/updateOldVersion',
        payload: {
            project_id: formID,
            body: {
                change: compareTree,
            }
        },
      });
      this.dispatch({
        type: 'currentVersion/saveNewFormVisible',
        payload: false,
      });
    }
   
    
   
    // 编辑新版本的名字
  }

  edit(key) {
    console.log(`key:${key}`);
    this.setState({ editingKey: key });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  save(form, key) {
    const { currentVersion: { compareTree }} = this.props;

    form.validateFields((error, row) => {
      console.log('row ');
      console.log(row);
      if (error) {
        return;
      }

      const newData = [...compareTree];
      let keys = [];
      keys = key.split('/');
      console.log(keys);

      let index_ = -1;
      let newData1 = [...newData];

      for (let i = 0; i < keys.length; i++) {
        let keychild = '';
        keychild = keys[i];
        let index = newData1.findIndex(item => keychild === item.record_id);
        if (index > -1 && (i === keys.length - 1 )) {
          const item = newData[index];
          let item2 = {...newData[index]};
          item2.memo = row.memo;
          newData.splice(index, 1, {
            ...item,
            ...item2,
          });
          this.setState({ editingKey: '' });

          this.dispatch({
            type: 'currentVersion/saveCompareTree',
            payload: newData,
          });

        }
        else if (  index_ > -1 &&
          newData1[index_].children &&
          newData1[index_].children.length > 0 &&
          i < keys.length - 1) 
        {
          console.log('进入下一层');
          newData1 = newData1[index_].children;
          console.log('newData1 ' + newData1.length);
        }
       
      }

     


     
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

    // 判断数值
    statusValueW = value => {
      if (value && value !== 0) {
        return (value / (10000)).toFixed(2);
      }
      return 0;
    };
  render() {
    const {
      loading,
      currentVersion: { submitting, newFormVisible,  compareTree, saveTitle, compareVersionList},
      costAccount: { formType },
    } = this.props;
    const { tableData } = this.state;
    const columns = [
      {
        title: '科目名称',
        dataIndex: 'name',
        width: '20%',
      
      },
      {
        title: <div>{compareVersionList[0] && compareVersionList[0].name || '上一版本'}<br></br>(万元/%)</div>,
        dataIndex: compareVersionList[0] && compareVersionList[0].key || 'last',
        width: '15%',

        align: 'center',
        render: (text, record) => {
          if (text.indexOf("%") !== -1) {
            return <span>{text}</span>
        }
        else {
            return <span>{this.statusValueW(text).replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</span>
        }
        }
      },
      {
        title: <div>{compareVersionList[1] && compareVersionList[1].name || '当前版本'}<br></br>(万元/%)</div>,
        dataIndex: compareVersionList[1] && compareVersionList[1].key || 'current',
        width: '15%',
        align: 'center',
        render: (text, record) => {
          if (text.indexOf("%") !== -1) {
            return <span>{text}</span>
        }
        else {
            return <span>{this.statusValueW(text).replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</span>
        }
        }
      },
      // {
      //   title: <div>差额<br></br>(万元/%)</div>,
      //   dataIndex: 'difference',
      //   width: '15%',
      //   align: 'center',
      //   render: (text, record) => {
      //     if (text.indexOf("%") !== -1) {
      //       return <span>{text}</span>
      //   }
      //   else {
      //       return <span>{this.statusValueW(text).replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</span>
      //   }
      //   }
      // },
      {
        title: '备注',
        dataIndex: 'memo',
        width: '20%',
        editable: true,
        inputType: 'text',

        align: 'center',
      },

      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '20%',
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
    ];
    const components = {
      body: {
        //row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const ecolumns = this.mapEditColumns(columns);
    return (
      <Modal
        title={saveTitle}
        width="60%"
        centered={true}
        visible={newFormVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose={true}
         onOk={this.onOKClick}
        onCancel={this.onCancelClick}
        //   style={{ height: 800 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', height: '500px', overflowY: 'auto' }}
      >
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={compareTree}
            columns={formType === 'E' ? ecolumns : formType === 'V' ? view_columns : null} //{view_columns}
            rowClassName="editable-row"
            rowKey={record => record.record_id}
            loading={loading}
            pagination={false}
          ></Table>
        </EditableContext.Provider>
      </Modal>
    );
  }
}
export default CreateNewVersion;
