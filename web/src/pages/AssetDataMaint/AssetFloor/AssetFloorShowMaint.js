import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Card, Button, Table, Tabs } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import CustomInfoShow from '../CustomInfo/CustomInfoShow';
import AgreementInfoShow from '../CustomInfo/AgreementInfoShow';
import styles from '../AssetsBuildInfo.less';

const { Description } = DescriptionList;
@connect(state => ({
  assetDatamaint: state.assetDatamaint,
}))
@Form.create()

//  楼层的模态对话框组件。
class AssetFloorShowMaint extends PureComponent {
  // 判断数值
  statusValue = value => {
    if (value && value !== 0) {
      return (value / 100).toString();
    }
    return '';
  };

  onTableChange = pagination => {
    this.dispatch({
      type: 'assetDatamaint/fetch',
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  renderFirstView = () => {
    const {
      assetDatamaint: { formDataFloor },
    } = this.props;
    const { TabPane } = Tabs;
    const operations = (
      <div>
        <Button>作废</Button>
        <Button>退租</Button>
        <Button>续签</Button>
      </div>
    );
    const columns = [
      {
        title: '缴费周期',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '应收金额（元）',
        dataIndex: 'sequence',
        width: 100,
      },
      {
        title: '缴费期限',
        dataIndex: 'hidden',
        width: 100,
      },
    ];
    return (
      <div className={styles.main}>
        <Card title="基本信息" bordered={false}>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="楼层">{formDataFloor.name}</Description>
            </DescriptionList>
          </div>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="楼层数">
                {formDataFloor.layer_num ? formDataFloor.layer_num.toString() : '0'}
              </Description>
            </DescriptionList>
          </div>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={2} style={{ marginBottom: 32 }}>
              <Description term="建筑面积（㎡）">
                {this.statusValue(formDataFloor.building_area)}
              </Description>
              <Description term="计租面积（㎡）">
                {this.statusValue(formDataFloor.rent_area)}
              </Description>
            </DescriptionList>
          </div>
        </Card>
        <Card>
          <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
            <TabPane tab="客户信息" key="1">
              <CustomInfoShow />
            </TabPane>
            <TabPane tab="合同信息" key="2">
              <AgreementInfoShow />
            </TabPane>
            <TabPane tab="租金信息" key="3">
              <Table
                // loading={loading}
                rowKey={record => record.record_id}
                // dataSource={list}
                columns={columns}
                //  pagination={paginationProps}
                // onChange={this.onTableChange}
                size="small"
              />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  };

  render() {
    const {
      assetDatamaint: { formVisibleFloor, submitting },
      onCancel,
    } = this.props;

    return (
      <Modal
        title="楼层详情"
        width={873}
        visible={formVisibleFloor}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel}>
            关闭
          </Button>,
        ]}
        style={{ top: 20 }}
        bodyStyle={{ height: 550, overflowY: 'scroll' }}
      >
        {this.renderFirstView()}
      </Modal>
    );
  }
}
export default AssetFloorShowMaint;
