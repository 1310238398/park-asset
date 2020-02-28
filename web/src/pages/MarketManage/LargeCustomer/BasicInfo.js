import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  message,
  Button,
  InputNumber,
  Row,
  Col,
  Icon,
  Upload,
  DatePicker,
  Card,
  Table,
  Popconfirm,
} from 'antd';
import PicturesWall2 from '../../../components/PicturesWall2/PicturesWall2';
import styles from '../../ProjectManage/ProjectManage.less';
import moment from 'moment';
const { Option } = Select;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@Form.create()
class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return (
        <InputNumber
          formatter={value => `${value}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}
          parser={value => value.replace(/\\s?|(,*)/g, '')}
          style={{ width: '100%' }}
        />
      );
    }
    else if (this.props.inputType === 'text') {
      return <Input />;
    }
    else {
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
  entrustedConstruction: state.entrustedConstruction,

  loading: state.loading.models.entrustedConstruction,
}))
@Form.create()
class BasicInfo extends PureComponent {
  state = {
    editingKey: '',
    addingNew: false, // 表示正在添加新的item
     temp_data : 
      [
        {
          record_id: "01",
          collection_name: "委托建设费",
          amount: 12345,
          mark: "备注内容",

        },
        { record_id: "02",
          collection_name: "委托建设费",
          amount: 12345,
          mark: "备注内容",

        },
        {
          record_id: "03",
          collection_name: "委托建设费",
          amount: 12345,
          mark: "备注内容",

        },
        {
          record_id: "04",
          collection_name: "委托建设费",
          amount: 12345,
          mark: "备注内容",

        },
        {
          record_id: "05",
          collection_name: "委托建设费",
          amount: 12345,
          mark: "备注内容",

        },
      ],
     
    
  };
  componentDidMount = async () => {
    const {
      entrustedConstruction: { formID, formType },
    } = this.props;

    this.dispatch({
      type: 'entrustedConstruction/fetchBasic',
      payload: {
        projectID: formID,
      },
    });
  };
  isEditing = record => record.record_id === this.state.editingKey;
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  save(form, key) {
    // key是项目业态id
    const {
      entrustedConstruction: {
       // collection_data: { list, pagination }, // 其他款项数据
      },
    } = this.props;
    const { temp_data: { list }} = this.state;
    console.log('要保存数据的key ' + key);

    form.validateFields(async (error, row) => {
      if (error) {
        return;
      }
      const newData = list;

      const index = newData.findIndex(item => key === item.record_id);
      if (index > -1) {
        const item = newData[index];
        row.record_id = key;
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        // let response;

        // response = await updateSalesPlan(row);
        // if (response.record_id && response.record_id !== '') {
        //   message.success('更新成功');
        //   this.setState({ editingKey: '' });
        //   this.dispatch({
        //     type: '',
        //     payload: {
        //       list: [...newData],
        //       pagination: pagination,
        //     },
        //   });
        // }


            this.setState({ editingKey: '' });
       
      }
    });
  }
  deleteNode(record_id) {

    const { temp_data } = this.state;
    let dataTemp = [...temp_data];
    if (record_id === '') {
      // 删除临时节点（想创建但是又取消的）

      dataTemp = dataTemp.filter(item => item.record_id !== record_id);
      this.setState({ temp_data: dataTemp});

      // this.dispatch({
      //   type: 'costExpenseNode/saveData',
      //   payload: dataTemp,
      // });
      return;
    }
  }
  edit(key) {
    this.setState({ editingKey: key });
  }
  cancel = (record_id) => {
    if (record_id === '') {
      // 如果是新建的取消 需要做删除

      console.log('删除想要添加的临时节点');
      this.deleteNode(record_id);
      this.setState({ addingNew: false });
    }
    this.setState({ editingKey: '' });
  };
  brotherLevelAdd = () => {
    console.log("新增");
  
    const { temp_data} = this.state;

    this.setState({ addingNew: true});
   
   
      
      // 直接顶层添加
     let temp = [...temp_data];
      const newItem = {
        record_id: "",
        collection_name: "新增的款项",
        amount: 0,
        mark: "",
      };
      temp.push(newItem);
     

      this.setState({ temp_data: temp});

      
      
      
    
   

  }
  render() {
    const {
      form: { getFieldDecorator },
      entrustedConstruction: { formType,  
        //collection_data: { list, pagination }
      },
    } = this.props;

    const { temp_data } = this.state;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const view_columns = [
      {
        title: '款项名称',
        dataIndex: 'collection_name',
        width: '20%',
       // ellipsis: true,
        align: 'center',
       
  
      },
    {
      title: '金额',
      dataIndex: 'amount',
      width: '20%',
     // ellipsis: true,
      align: 'center',
     
  
    },
    {
      title: '备注',
      dataIndex: 'mark',
      width: '20%',
     // ellipsis: true,
      align: 'center',
      
  
    },
    ];
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns= [
    {
      title: '款项名称',
      dataIndex: 'collection_name',
      width: '20%',
     // ellipsis: true,
      align: 'center',
      inputType: "text",
      editable: true,

    },
  {
    title: '金额',
    dataIndex: 'amount',
    width: '20%',
    inputType: "number",
   // ellipsis: true,
    align: 'center',
    editable: true,

  },
  {
    title: '备注',
    dataIndex: 'mark',
    width: '20%',
    inputType: "text",
   // ellipsis: true,
    align: 'center',
    editable: true,

  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: '10%',
    render: (text, record) => {
      const { editingKey, addingNew } = this.state;
      const editable = this.isEditing(record);

      return editable ? (
        <span>
          <EditableContext.Consumer>
            {form => (
              <a onClick={() => this.save(form, record.record_id)} style={{ marginRight: 8 }}>
                保存
              </a>
            )}
          </EditableContext.Consumer>
          <Popconfirm title="确定取消修改?" onConfirm={() => this.cancel(record.record_id)}>
            <a>取消</a>
          </Popconfirm>
        </span>
      ) : (
        <div>
          <a
            disabled={editingKey !== '' || addingNew}
            onClick={() => this.edit(record.record_id)}
            style={{ marginRight: 8 }}
          >
            编辑
          </a>
          <Popconfirm title="确定删除?" onConfirm={() => this.deletePlan(record.record_id)}>
            <a disabled={editingKey !== '' || addingNew}>删除</a>
          </Popconfirm>
        </div>
      );
    }
  }
];

    const columns2 = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.inputType, //col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
          // handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        {formType === 'E' && (
          <Form>
            <Card bodyStyle={{ paddingTop: 10 }} type="inner" title="基本信息">
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="合同名称" {...formItemLayout} >
                    {getFieldDecorator('contract_name', {
                      rules: [
                        {
                          required: true,
                          message: '请填写合同名称',
                        },
                      ],
                    })(<Input placeholder="请输入合同名称" />)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="合同编号" {...formItemLayout} >
                    {getFieldDecorator('contract_num', {
                      rules: [
                        {
                          required: true,
                          message: '请填写合同编号',
                        },
                      ],
                    })(<Input placeholder="请输入合同编号" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="甲方" {...formItemLayout} >
                    {getFieldDecorator('contract_jia', {
                      rules: [
                        {
                          required: true,
                          message: '请填写甲方名称',
                        },
                      ],
                    })(<Input placeholder="请输入甲方名称" />)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="乙方" {...formItemLayout} >
                    {getFieldDecorator('contract_yi', {
                      rules: [
                        {
                          required: true,
                          message: '请填写乙方名称',
                        },
                      ],
                    })(<Input placeholder="请输入乙方名称" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="客户名称" {...formItemLayout} >
                    {getFieldDecorator('customer_name', {
                      rules: [
                        {
                          required: true,
                          message: '请选择客户名称',
                        },
                      ],
                    })(
                      <Select placeholder="请选择客户名称" style={{ width: '100%' }}>
                        <Select.Option key="01" value="甲方">
                          甲方
                        </Select.Option>
                        <Select.Option key="02" value="乙方">
                          乙方
                        </Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="签订时间" >
                    {getFieldDecorator('sign_time', {
                      // initialValue: moment(formData.end_time),
                      rules: [
                        {
                          required: true,
                          message: '请选择时间',
                        },
                      ],
                    })(
                      <DatePicker
                        // showTime
                        style={{ width: '100%' }}
                        placeholder="请选择结束时间"
                        format="YYYY-MM-DD"
                        //locale={locale}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="审核进度" {...formItemLayout} >
                    {getFieldDecorator('contract_audit')(<div>审核中</div>)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="执行进度" {...formItemLayout} >
                    {getFieldDecorator('contract_execute')(<div>验收</div>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="项目" {...formItemLayout} >
                    {getFieldDecorator('contract_project', {
                      rules: [
                        {
                          required: true,
                          message: '请选择项目',
                        },
                      ],
                    })(
                      <Select placeholder="请选择项目" style={{ width: '100%' }}>
                        <Select.Option key="01" value="项目1">
                          项目1
                        </Select.Option>
                        <Select.Option key="02" value="项目2">
                          项目2
                        </Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="楼栋" {...formItemLayout} >
                    {getFieldDecorator('contract_execute', {
                      rules: [
                        {
                          required: true,
                          message: '请选择楼栋',
                        },
                      ],
                    })(
                      <Select placeholder="请选择楼栋" style={{ width: '100%' }}>
                        <Select.Option key="01" value="楼栋1">
                          楼栋1
                        </Select.Option>
                        <Select.Option key="02" value="楼栋2">
                          楼栋2
                        </Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="负责人" {...formItemLayout} >
                    {getFieldDecorator('contract_response', {
                      rules: [
                        {
                          required: true,
                          message: '请填写负责人名字',
                        },
                      ],
                    })(<Input placeholder="请输入负责人名称" />)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="联系电话" {...formItemLayout} >
                    {getFieldDecorator('contract_phone', {
                      rules: [
                        {
                          required: true,
                          message: '请填写联系电话',
                        },
                      ],
                    })(<Input placeholder="请输入联系电话" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="地上建筑面积单价" {...formItemLayout} >
                    {getFieldDecorator('contract_up_area_unit', {
                      rules: [
                        {
                          required: true,
                          message: '请填写单价',
                        },
                      ],
                    })(<InputNumber placeholder="请输入单价" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="地上建筑面积" {...formItemLayout} >
                    {getFieldDecorator('contract_up_area', {
                      rules: [
                        {
                          required: true,
                          message: '请填写地上建筑面积',
                        },
                      ],
                    })(<InputNumber placeholder="请输入地上建筑面积" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="地下建筑面积单价" {...formItemLayout} >
                    {getFieldDecorator('contract_down_area_unit', {
                      // rules: [
                      //   {
                      //     required: true,
                      //     message: '请填写地下建筑面积单价',
                      //   },
                      // ],
                    })(
                      <InputNumber placeholder="请输入地下建筑面积单价" style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="地下建筑面积" {...formItemLayout} >
                    {getFieldDecorator('contract_down_area', {
                      // rules: [
                      //   {
                      //     required: true,
                      //     message: '请填写地下建筑面积',
                      //   },
                      // ],
                    })(<InputNumber placeholder="请输入地下建筑面积" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="车位单价(/个)" {...formItemLayout} >
                    {getFieldDecorator('contract_car_unit')(
                      <InputNumber placeholder="请输入车位单价" style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="车位总数量" {...formItemLayout} >
                    {getFieldDecorator('contract_car')(
                      <InputNumber placeholder="请输入车位总数量" style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="合同类型" {...formItemLayout} >
                    {getFieldDecorator('contract_type', {
                      rules: [
                        {
                          required: true,
                          message: '请选择合同类型',
                        },
                      ],
                    })(
                      <Select placeholder="请选择合同类型" style={{ width: '100%' }}>
                        <Select.Option key="01" value="常规合同">
                          常规合同
                        </Select.Option>
                        <Select.Option key="02" value="委托建设合同">
                          委托建设合同
                        </Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>

                <Col md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="备注" >
                    {getFieldDecorator('contract_remark', {
                      // initialValue: formDataSupplement.remark,
                      rules: [
                        {
                          required: false,
                          message: '请输入备注',
                        },
                      ],
                    })(<Input.TextArea rows={2} placeholder="请输入备注" />)}
                  </Form.Item>
                </Col>
              </Row>
            
              {/* <Row gutter={16}>
                <Col md={24} sm={24} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button type="primary" htmlType="submit" style={{ width: 150 }}>
                    保存
                  </Button>
                </Col>
              </Row>  */}
            </Card>

            <Card
              bodyStyle={{ paddingTop: 10 }}
              title="其他款项"
              type="inner"
              style={{ marginTop: 20 }}
            >
              <EditableContext.Provider value={this.props.form}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 45}}>
              <Button onClick={() => this.brotherLevelAdd()} type="primary" style={{ marginBottom: 0 }}>
                 新增款项
              </Button>
              <div>
                <span>合同总价:&nbsp;</span><span>0.00元</span>
              </div>
              
                </div>
                <Table
                  components={components}
                  //loading={loading}
                  rowKey={record => record.record_id}
                  dataSource={temp_data}
                  columns={formType === 'E' ? columns2 : formType === 'V' ? view_columns : null} //{view_columns}
                  pagination={false}
                  // scroll={{ y: 500 }}
                  rowClassName="editable-row"
                  // rowClassName={() => 'editable-row'}
                  // onChange={this.handleTableChange}
                  // style={{ maxHeight: 500 }}
                  size="small"
                ></Table>
              </EditableContext.Provider>
            </Card>
            <Card
              bodyStyle={{ paddingTop: 10 }}
              title="合同附件"
              type="inner"
              style={{ marginTop: 20 }}
            >
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="上传合同" >
                    {getFieldDecorator('upload', {
                      // initialValue: moment(formData.end_time),
                      // rules: [
                      //   {
                      //     required: true,
                      //     message: '请选择时间',
                      //   },
                      // ],
                    })(<PicturesWall2 num={5} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
         
          <Row gutter={16} style={{ marginTop: 20}}>
                <Col md={24} sm={24} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button type="primary" htmlType="submit" style={{ width: 150 }}>
                    提交修改
                  </Button>
                </Col>
              </Row> 
          </Form>
        )}

        {formType === 'V' && (
         
            <Form> 
              <Card bordered={false} bodyStyle={{ paddingTop: 0 }}>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="合同名称" {...formItemLayout} >
                    {getFieldDecorator('contract_name_v', {})(<div>合同名称</div>)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="合同编号" {...formItemLayout} >
                    {getFieldDecorator('contract_num_v', {})(<div>合同编号</div>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="甲方" {...formItemLayout} >
                    {getFieldDecorator('contract_jia_v', {})(<div>甲方</div>)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="乙方" {...formItemLayout} >
                    {getFieldDecorator('contract_yi', {})(<div>乙方</div>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="客户名称" {...formItemLayout} >
                    {getFieldDecorator('customer_name_v', {

                    })(
                      <div>客户名称</div>
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                <Form.Item {...formItemLayout} label="签订时间" >
                    {getFieldDecorator('sign_time_v', {
                      // initialValue: moment(formData.end_time),
                    })(
                      // <DatePicker
                      //   // showTime
                      //   style={{ width: '100%' }}
                      //   placeholder="请选择结束时间"
                      //   format="YYYY-MM-DD"
                      //   //locale={locale}
                      // />
                      <div>{moment(new Date()).format('YYYY-MM-DD')}</div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="审核进度" {...formItemLayout} >
                    {getFieldDecorator('contract_audit_v')(<div>审核中</div>)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="执行进度" {...formItemLayout} >
                    {getFieldDecorator('contract_execute_v')(<div>验收</div>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="项目" {...formItemLayout} >
                    {getFieldDecorator('contract_project_v', {})(<div>项目</div>)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="楼栋" {...formItemLayout} >
                    {getFieldDecorator('contract_execute_v', {})(<div>楼栋</div>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="负责人" {...formItemLayout} >
                    {getFieldDecorator('contract_response_v', {})(<div>负责人</div>)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="联系电话" {...formItemLayout} >
                    {getFieldDecorator('contract_phone_v', {})(<div>联系电话</div>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="地上建筑面积单价(元)" {...formItemLayout} >
                    {getFieldDecorator('contract_up_area_unit_v', {
                      rules: [
                        {
                          required: true,
                          message: '请填写单价',
                        },
                      ],
                    })( <div style={{ width: '100%',textAlign: "left"}}>{`${1000}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</div>)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="地上建筑面积(m²)" {...formItemLayout} >
                    {getFieldDecorator('contract_up_area_v', {
                      rules: [
                        {
                          required: true,
                          message: '请填写地上建筑面积',
                        },
                      ],
                    })( <div style={{ width: '100%',textAlign: "left"}}>{`${1000}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</div>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="地下建筑面积单价(元)" {...formItemLayout} >
                    {getFieldDecorator('contract_down_area_unit_v', {
                      // rules: [
                      //   {
                      //     required: true,
                      //     message: '请填写地下建筑面积单价',
                      //   },
                      // ],
                    })(
                      <div style={{ width: '100%',textAlign: "left"}}>{`${1000}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</div>
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="地下建筑面积(m²)" {...formItemLayout} >
                    {getFieldDecorator('contract_down_area_v', {
                      // rules: [
                      //   {
                      //     required: true,
                      //     message: '请填写地下建筑面积',
                      //   },
                      // ],
                    })( <div style={{ width: '100%',textAlign: "left"}}>{`${1000}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</div>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="车位单价(/个)" {...formItemLayout} >
                    {getFieldDecorator('contract_car_unit_v')(
                     <div style={{ width: '100%',textAlign: "left"}}>{`${1000}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</div>
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="车位总数量" {...formItemLayout} >
                    {getFieldDecorator('contract_car_v')(
                      <div style={{ width: '100%',textAlign: "left"}}>{`${1000}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</div>
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="合同类型" {...formItemLayout} >
                    {getFieldDecorator('contract_type_v', {
                     
                    })(
                      <div>委托建设合同</div>
                    )}
                  </Form.Item>
                </Col>

                <Col md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="备注" >
                    {getFieldDecorator('contract_remark_v', {
                      // initialValue: formDataSupplement.remark,
                     
                    })(
                      <div style={{ lineHeight: '35px'}}>备注课程飓风的觉得不错v将对方还是舍不得的v恨不得备注课程飓风的觉得不错v将对方还是舍不得的v恨不得备注课程飓风的觉得不错v将对方还是舍不得的v恨不得备注课程飓风的觉得不错v将对方还是舍不得的v恨不得</div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              </Card>
              <Card
              bodyStyle={{ paddingTop: 10 }}
              title="其他款项"
              type="inner"
              style={{ marginTop: 20 }}
            >
              <EditableContext.Provider value={this.props.form}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 45}}>
            
              <div>
                <span>合同总价:&nbsp;</span><span>0.00元</span>
              </div>
              
                </div>
             

                <Table
                  components={components}
                  //loading={loading}
                  rowKey={record => record.record_id}
                  dataSource={temp_data}
                  columns={formType === 'E' ? columns2 : formType === 'V' ? view_columns : null} //{view_columns}
                  pagination={false}
                  // scroll={{ y: 500 }}
                  rowClassName="editable-row"
                  // rowClassName={() => 'editable-row'}
                  // onChange={this.handleTableChange}
                  // style={{ maxHeight: 500 }}
                  size="small"
                ></Table>
              </EditableContext.Provider>
            </Card>
            <Card
              bodyStyle={{ paddingTop: 10 }}
              title="合同附件"
              type="inner"
              style={{ marginTop: 20 }}
            >
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="" >
                    {getFieldDecorator('upload', {
                      // initialValue: moment(formData.end_time),
                      // rules: [
                      //   {
                      //     required: true,
                      //     message: '请选择时间',
                      //   },
                      // ],
                    })(<PicturesWall2 num={5} canUpload={false}/>)}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
         
            </Form>
          
        )}
      </div>
    );
  }
}
export default BasicInfo;
