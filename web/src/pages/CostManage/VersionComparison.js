import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
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
import styles from './CostAccount.less';
import {} from '@/services/costAccount';
const FormItem = Form.Item;
const EditableContext = React.createContext();

@connect(state => ({
  // projectManage: state.projectManage,
  costAccount: state.costAccount,
  hisVersion: state.hisVersion,
  versionComparison: state.versionComparison,
  loading: state.loading.models.currentVersion,
}))
@Form.create()
class VersionComparison extends PureComponent {
  state = {
    columns: [
      {
        title: '科目名称',
        dataIndex: 'name',
        width: 150,
        // ellipsis: true,
        // align: 'center',
        // fixed: 'left',
      },
      // {
      //     title: '起始版本',
      //     dataIndex: 'start',
      //     width: 100,

      //     align: 'center',

      // },
      // {
      //     title: '中间版本',

      //     children: [
      //         {
      //             title: '中间版本1',
      //             dataIndex: 'middle01',
      //             width: 100,
      //             align: 'center',
      //         },
      //         {
      //             title: '中间版本2',
      //             dataIndex: 'middle02',
      //             width: 100,
      //             align: 'center',
      //         },
      //         {
      //             title: '中间版本3',
      //             dataIndex: 'middle03',
      //             width: 100,
      //             align: 'center',
      //         },
      //     ]

      // },
      // {
      //     title: '最终版本',
      //     dataIndex: 'end',
      //     width: 100,

      //     align: 'center',

      // },
      {
        title: '备注',
        dataIndex: 'memo',
        width: 150,
        editable: true,
        inputType: 'text',

        align: 'center',
      },
    ],
 

    editingKey: '',
  };

  componentDidMount = async () => {
    const {
      costAccount: { formID },
    } = this.props;

    this.dispatch({
      type: 'hisVersion/fetch',
      payload: {
        projectID: formID,
        flag: 2,
      },
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // 按照条件查询项目
  handleSearchFormSubmit = e => {
    const {
      costAccount: { formID },
    } = this.props;
    const { columns } = this.state;

    let columns_new = [...columns];

    if (e) {
      e.preventDefault();
    }

    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }
      const formData = { ...values };
      console.log('formData ');
      console.log(formData);
      // 更新table 表头
   
      // let co = {
      //   title: JSON.parse(formData.start_version).version_name,
      //   dataIndex: 'test',
      //   width: 150,
      // };
      // columns_new.splice(1, 0 , co);
      // this.setState({ columns: [...columns_new] });

      let list = [];
      list.push(formData.start_version);
      for (let i = 0; i < formData.middle_version.length; i++) {
        list.push(formData.middle_version[i]);
      }

      list.push(formData.end_version);

      this.dispatch({
        type: 'versionComparison/fetchCompare',
        payload: {
          params: {
            project_id: formID,
            list: list,
          },
        },
      });
    });
  };

  handleResetFormClick = () => {
    const { form } = this.props;
    form.resetFields();

    // this.dispatch({
    //   type: 'projectManage/fetch',
    //   search: {},
    //   pagination: {},
    // });
  };
  renderSearchForm() {
    const {
      form: { getFieldDecorator },

      hisVersion: { data },
      versionComparison: { compareVersionList}
    } = this.props;
    const { versionList } = this.state;
    let versions = [...data];
    let compareVersionList_temp = [];

   for (let i = 0; i < compareVersionList.length; i++) {

    if (i === 0 || i === (compareVersionList.length - 1)) {

      continue;
    }

    compareVersionList_temp.push(compareVersionList[i].key);
   }
    return (
      <Form onSubmit={this.handleSearchFormSubmit} layout="inline">
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item
              label="起始版本"
              style={{ paddingBottom: 10, paddingTop: 0, marginBottom: 0 }}
            >
              {getFieldDecorator('start_version', {
                initialValue: compareVersionList[0] && compareVersionList[0].key,
              })(
                <Select placeholder="请选择起始版本" style={{ width: '100%' }}>
                  {versions &&
                    versions.map(item => (
                      <Select.Option key={item.record_id} value={item.record_id}>
                        {item.version_name}
                      </Select.Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item
              label="中间版本"
              style={{ paddingBottom: 10, paddingTop: 0, marginBottom: 0 }}
            >
              {getFieldDecorator('middle_version', {
                initialValue: compareVersionList_temp,
              })(
                <Select placeholder="请选择中间版本" style={{ width: '100%' }} mode="multiple">
                  {versions &&
                    versions.map(item => (
                      <Select.Option key={item.record_id} value={item.record_id}>
                        {item.version_name}
                      </Select.Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item
              label="最终版本"
              style={{ paddingBottom: 10, paddingTop: 0, marginBottom: 0 }}
            >
              {getFieldDecorator('end_version', {
                initialValue: compareVersionList[compareVersionList.length - 1] && compareVersionList[compareVersionList.length - 1].key,
              })(
                <Select placeholder="请选择最终版本" style={{ width: '100%' }}>
                  {versions &&
                    versions.map(item => (
                      <Select.Option key={item.record_id} value={item.record_id}>
                        {item.version_name}
                      </Select.Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleResetFormClick}>
                  重置
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      costAccount: { formType },
      versionComparison: { data,  columns },
    } = this.props;
   

    return (
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
        <EditableContext.Provider value={this.props.form}>
          <Table
            bordered
            loading={loading}
            rowKey={record => record.record_id}
            dataSource={data}
            columns={columns} 
            pagination={false}
            scroll={{ y: 800, x: 'calc(100%)' }}
            // rowClassName="editable-row"
          ></Table>
        </EditableContext.Provider>
      </div>
    );
  }
}
export default VersionComparison;
