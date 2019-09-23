import React, { PureComponent } from 'react';
import { Form, Card, Tabs, Modal } from 'antd';
import { connect } from 'dva';
import AgreementInfoShow from './AgreementInfoShow';

@connect(({ assetDatamaint }) => ({
  assetDatamaint,
}))
@Form.create()
class RentDrawInfoShow extends PureComponent {
  render() {
    const { TabPane } = Tabs;
    const {
      assetDatamaint: { formTitleBuild, submitting },
      //   form: { getFieldDecorator, getFieldValue },
      onCancel,
    } = this.props;
    return (
      <Modal
        title={formTitleBuild}
        width={850}
        visible
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Card>
          <Form className="custominfo-form">
            <h1>退租事项办结</h1>
            <Tabs>
              <TabPane tab="合同正常结束" key="1">
                <AgreementInfoShow />
              </TabPane>
              <TabPane tab="合同提前结束" key="2">
                <AgreementInfoShow />
              </TabPane>
            </Tabs>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default RentDrawInfoShow;
