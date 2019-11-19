import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, Select, Radio, Table, message, Divider, Button } from 'antd';
import styles from './CostAccount.less';
const FormItem = Form.Item;

@connect(state => ({
  costAccount: state.costAccount,
  loading: state.loading.models.costAccount,
}))
// 销售计划页面
@Form.create()
class SalesPlan1 extends PureComponent {
  state = {
    data: [
      {
        name: '住宅地上10层',
        area: 100.0,
        unit_price: 1,
        total_contract_price: 0,
        repayment_amount: 0,
      },
      {
        name: '住宅地上17层',
        area: 100.0,
        unit_price: 1,
        total_contract_price: 0,
        repayment_amount: 0,
      },
      {
        name: '地下车位',
        area: 100.0,
        unit_price: 1,
        total_contract_price: 0,
        repayment_amount: 0,
      },
    ],

    yearList: ['2020', '2019', '2018', '2017'],
    currentQuarter: '第一季度', // 当前季度
  };
  componentDidMount() {}

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  handleSelectChange = value => {
    console.log('handleChange');
    console.log(`selected ${value}`);

    // 调接口查询
  };

  // 季度选择
  handleQuarterChange = e => {

    console.log("季度选择 "+e.target.value);
    this.setState({currentQuarter: e.target.value});
  }

  render() {
    const { loading } = this.props;
    const { data, yearList, currentQuarter } = this.state;

    const columns = [
      {
        title: '业态名称',
        dataIndex: 'name',
        width: '20%',
        ellipsis: true,
      },
      {
        title: '面积(万m²)',
        dataIndex: 'area',
        width: '10%',
      },
      {
        title: '单价(万元)',
        dataIndex: 'unit_price',
        width: '15%',
      },
      { title: '合同额(万元)', dataIndex: 'total_contract_price', width: '15%' },
      {
        title: '回款额(万元)',
        dataIndex: 'repayment_amount',
        width: '15%',
      },
    ];

    return (
      <div>
        <div className={styles.top_div}>
          <Select
            placeholder="请选择年份"
            // defaultValue="lucy"
            style={{ width: 120 }}
            onChange={this.handleSelectChange}
          >
            {yearList &&
              yearList.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
          </Select>
          <Button type="primary" onClick={() => {}}>
            新增计划
          </Button>
        </div>
        <Divider style={{ marginTop: 15, marginBottom: 15 }}></Divider>
        <div className={styles.quarter_group_div}>
           <Radio.Group defaultValue="第一季度" buttonStyle="solid" onChange={this.handleQuarterChange} style={{width: '50%', display: 'flex',justifyContent:'space-around'}}>
          <Radio.Button value="第一季度">第一季度</Radio.Button>
          <Radio.Button value="第二季度">第二季度</Radio.Button>
          <Radio.Button value="第三季度">第三季度</Radio.Button>
          <Radio.Button value="第四季度">第四季度</Radio.Button>
          <Radio.Button value="合计">合计</Radio.Button>
        </Radio.Group>
        
        </div>
        <div style={{display:'flex', justifyContent:'center', width:'100%'}}>
           <div style={{display:'flex', justifyContent:'center', width:'50%'}}>
            <Divider style={{marginTop:0, marginBottom:0}}></Divider>
        </div>
        </div>
       
      
       
        <div className={styles.quarter_div}>
              <div>{currentQuarter}</div>
              <div style={{marginLeft: 50}}>总计:&nbsp;100.000</div>
              <Button style={{}}>编辑</Button>
              <Button>删除</Button>
        </div>
        <Table
          loading={loading}
          rowKey={record => record.key}
          dataSource={data}
          columns={columns}
          pagination={false}
          scroll={{ y: 500 }}
          style={{ maxHeight: 500 }}
        ></Table>
      </div>
    );
  }
}
export default SalesPlan1;
