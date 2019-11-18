import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';


const { TabPane } = Tabs;


import DicSelect from '@/components/DictionaryNew/DicSelect';

@connect(state => ({
  //projectManage: state.projectManage,
}))

export default class CostAccountDetail extends PureComponent {
  constructor(props) {
    super(props);
   
   
  }


  

  state = {
    formData: {},
    treeData: [],
   
   
  };

  componentDidMount() {
  
  }

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  callback(key) {
    console.log(key);
  }

  render() {
   

    return (
      <Tabs defaultActiveKey="1" onChange={this.callback}>
      <TabPane tab="Tab 1" key="1">
        Content of Tab Pane 1
      </TabPane>
      <TabPane tab="Tab 2" key="2">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="Tab 3" key="3">
        Content of Tab Pane 3
      </TabPane>
    </Tabs>
    );
  }
}
