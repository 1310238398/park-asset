import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Card, Button, Tag, Table, Tabs } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import CustomInfoShow from './CustomInfo/CustomInfoShow';
import AgreementInfoShow from './CustomInfo/AgreementInfoShow';
import styles from './AssetsBuildInfo.less';

const { Description } = DescriptionList;
@connect(state => ({
  assetDatamaint: state.assetDatamaint,
}))
@Form.create()

//  企业入驻的模态对话框组件。
class AssetUnitShowMaint extends PureComponent {
  //  默认的组件挂载时的初始化。
  componentDidMount() {
    const { id, type } = this.props;
    this.dispatch({
      type: 'assetDatamaint/loadForm',
      payload: {
        id,
        type,
      },
    });
  }

  onModalCancelClick = () => {
    // const { callback } = this.props;
    this.dispatch({
      type: 'assetDatamaint/changeFormVisible',
      payload: false,
    });
    // callback();
  };

  statusRender = status => {
    switch (status) {
      case 1:
        return <Tag color="blue">待审核</Tag>;
      case 2:
        return <Tag color="green">申请通过</Tag>;
      case 3:
        return <Tag color="red">申请驳回</Tag>;
      default:
        return '';
    }
  };

  renderBuildingType = value => {
    switch (value) {
      case 1:
        return <Tag color="blue">购买</Tag>;
      case 2:
        return <Tag color="green">租赁</Tag>;
      case 3:
        return <Tag color="yellow">自用</Tag>;
      default:
        return '';
    }
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
      assetDatamaint: { formData },
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

    // const paginationProps = {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   showTotal: total => <span>共{total}条</span>,
    //   ...pagination,
    // };

    return (
      <div className={styles.main}>
        <Card title="基本信息" bordered={false}>
          {/* <div className={styles.topInfo}>
            <div className={styles.topInfoLeft}>
              <Avatar
                src={headerImgUrl}
                shape="circle"
                size={100}
                style={{ marginLeft: 49 }}
                onClick={() => this.shouBigImage(headerImgUrl)}
              />
            </div>
            <div className={styles.topInfoCenter}>
              <span>{formData.name}</span>
              <span>
                企业联系电话：
                {formData.phone}
                企业邮箱：
                {formData.zip_code}
              </span>
              <span>
                入驻园区地址：
                {formData.buildings &&
                  formData.buildings.map(item => {
                    return (
                      <Tag>
                        {item.building_name} {this.renderBuildingType(item.incoming_type)}
                      </Tag>
                    );
                  })}
              </span>
       
            </div>
          </div> */}
          <p>A3-5</p>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="园区">{formData.phone}</Description>
              <Description term="楼栋">{formData.representative}</Description>
              <Description term="出租规模">{formData.applicant_name}</Description>
            </DescriptionList>
          </div>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="单元数">{formData.applicant_tel}</Description>
              <Description term="楼层数">{formData.representative}</Description>
              <Description term="装修情况">{formData.applicant_name}</Description>
            </DescriptionList>
          </div>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="建筑面积（㎡）">{formData.applicant_tel}</Description>
              <Description term="计租面积（㎡）">{formData.representative}</Description>
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
      assetDatamaint: { formVisibleUnit, submitting },
    } = this.props;

    return (
      <Modal
        title="企业详情"
        width={873}
        visible={formVisibleUnit}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onCancel={this.onModalCancelClick}
        footer={[
          <Button key="back" onClick={this.onModalCancelClick}>
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
export default AssetUnitShowMaint;
