import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Tabs } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
 import ApprovalProcess from './ApprovalProcess';
import FileListTab from './FileListTab';
@connect(state => ({
  designChange: state.designChange,
  loading: state.loading.models.designChange,
}))
@Form.create()
class ContractChangeBotTable extends PureComponent {
  render() {
    const { TabPane } = Tabs;
    return (
      <div>
        <Card>
          <Tabs defaultActiveKey="1">
            <TabPane tab="审批流程" key="1">
                 <ApprovalProcess></ApprovalProcess>
              </TabPane>
              <TabPane tab="相关附件" key="2">
                  <FileListTab></FileListTab>
              </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}
export default ContractChangeBotTable;
