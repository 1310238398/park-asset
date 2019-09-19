import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Tabs } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import AssetBuildMaint from './AssetBuildMaint';
import AssetOfficeTemplate from './AssetOfficeTemplate';

@connect(state => ({
  assetDatamaint: state.assetDatamaint,
  loading: state.loading.models.assetDatamaint,
}))
@Form.create()
class AssetDataMaintList extends PureComponent {
  componentDidMount() {
    // const { record_id, type } = this.props.location.query;
    this.dispatch({
      type: 'assetDatamaint/fetch',
      search: {},
      pagination: {},
    });
  }

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      location: {
        query: { recordID },
      },
    } = this.props;
    const { TabPane } = Tabs;
    const breadcrumbList = [
      { title: '资产数据维护' },
      { title: '资产数据维护', href: '/assetdatamaint/assetdatamaintlist' },
    ];

    return (
      <PageHeaderLayout title="资产数据维护" breadcrumbList={breadcrumbList}>
        <Card>
          <Tabs defaultActiveKey="1">
            <TabPane tab="写字楼管理" key="1">
              {/* 有数据直接出示界面数据，没有则出现导入界面 */}
              <AssetBuildMaint onProjectId={recordID} />
              <AssetOfficeTemplate />
            </TabPane>
            <TabPane tab="商铺管理" key="2">
              待定
            </TabPane>
            <TabPane tab="厂房管理" key="3">
              待定
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default AssetDataMaintList;
