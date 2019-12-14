import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, Select, Radio, Steps, Button, message } from 'antd';
@connect(state => ({
  currentVersion: state.currentVersion,
  costAccount: state.costAccount,
}))
@Form.create()
class NewVersionName extends PureComponent {
  state = {
      name: "",
  }


  componentDidMount() {}

  onCancelClick = () => {
    console.log('onCancelClick');

    this.dispatch({
      type: 'currentVersion/saveVersionNameVisible',
      payload: false,
    });
  };

  onOKClick = () => {
    const { name } = this.state;
    const {
      costAccount: { formID },
      currentVersion: { compareTree }
    } = this.props;
    // 提交
    this.dispatch({
        type: 'currentVersion/createNewVersion',
        payload: {
            project_id: formID,
            body: {
                change: compareTree,
                name: name,
            }
        },
    });

    this.dispatch({
      type: 'currentVersion/saveVersionNameVisible',
      payload: false,
    });
  
  };
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  nameChange = (e) => {

    console.log("名字发生变化");
    console.log(e.target.name);
    console.log(e.target.value);
    if (e.target.name === 'name') {
        this.setState({ name: e.target.value});
    }
    
  }

  render() {
    const {
      currentVersion: { versionNameVisible },
    } = this.props;
    const { name} = this.state;
    
    return (
      <Modal
        title="新版本名字"
        width={500}
        centered={true}
        visible={versionNameVisible}
        maskClosable={false}
        // confirmLoading={submitting}
        destroyOnClose={true}
        onOk={this.onOKClick}
        onCancel={this.onCancelClick}
        //   style={{ height: 800 }}
        // bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', height: '150px', overflowY: 'auto' }}
      >
      
        <Input placeholder="请输入新版本名字" name='name' onChange={(e) => this.nameChange(e) }></Input>
       
      </Modal>
    );
  }
}
export default NewVersionName;
