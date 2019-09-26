import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Card, Button, Tag, Table, Tabs } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import CustomInfoShow from './CustomInfo/CustomInfoShow';
import AgreementInfoShow from './CustomInfo/AgreementInfoShow';
import RentDrawInfoShow from './CustomInfo/RentDrawInfoShow';
import DiscardOpertaPage from './DetailOperationPage/DiscardOpertaPage';
import styles from './AssetsBuildInfo.less';
import DicShow from '@/components/DictionaryNew/DicShow';

const { Description } = DescriptionList;
@connect(state => ({
  assetDatamaint: state.assetDatamaint,
}))
@Form.create()

//  企业入驻的模态对话框组件。
class AssetBuildShowMaint extends PureComponent {
  state = {
    showDisCard: false,
  };

  // 关闭弹窗
  handleFormCancel = () => {
    const { onCancel } = this.props;
    onCancel();
    // this.dispatch({
    //   type: 'assetDatamaint/changeFormVisibleBuild',
    //   payload: false,
    // });
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

  DisOper = () => {
    this.setState({
      showDisCard: true,
    });
  };

  DrawOper = () => {
    this.setState({
      showDrawCard: true,
    });
  };

  renderShowDisCarView = () => {
    const { showDisCard } = this.state;
    if (showDisCard) {
      return <DiscardOpertaPage onSubmit={this.DataDisCardBack} onCancel={this.cloeseDisCard} />;
    }
    return <React.Fragment></React.Fragment>;
  };

  renderShowDrawCarView = () => {
    const { showDrawCard } = this.state;
    if (showDrawCard) {
      return <RentDrawInfoShow onSubmit={this.DataDisCardBack} onCancel={this.cloeseDrawCard} />;
    }
    return <React.Fragment></React.Fragment>;
  };

  cloeseDisCard = () => {
    this.setState({ showDisCard: false });
  };

  cloeseDrawCard = () => {
    this.setState({ showDrawCard: false });
  };

  DataDisCardBack = () => {
    this.dispatch({
      type: 'assetDatamaint/SaveDataDisCard',
      data: '',
    });
  };

  // 判断数值
  statusValue = value => {
    if (value && value !== 0) {
      return (value / 100).toString();
    }
    return '0';
  };

  renderFirstView = () => {
    const {
      assetDatamaint: { formDataBuild, proData },
    } = this.props;
    const { TabPane } = Tabs;
    const operations = (
      <div>
        <Button onClick={() => this.DisOper()}>作废</Button>
        <Button onClick={() => this.DrawOper()}>退租</Button>
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
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="项目">{proData.name}</Description>
              <Description term="楼栋">{formDataBuild.name}</Description>
              <Description term="出租规模">
                {<DicShow pcode="pa$#build$#scale" code={[formDataBuild.is_all_rent]} />}
              </Description>
            </DescriptionList>
          </div>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="单元数">
                {formDataBuild.unit_num ? formDataBuild.unit_num.toString() : '0'}
              </Description>
              <Description term="楼层数">
                {formDataBuild.layer_num ? formDataBuild.layer_num.toString() : '0'}
              </Description>
              <Description term="装修情况">
                {formDataBuild.decoration === 0 ? (
                  ''
                ) : (
                  <DicShow pcode="pa$#build$#decora" code={[formDataBuild.decoration]} />
                )}
              </Description>
            </DescriptionList>
          </div>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="建筑面积（㎡）">
                {this.statusValue(formDataBuild.building_area)}
              </Description>
              <Description term="计租面积（㎡）">
                {this.statusValue(formDataBuild.rent_area)}
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
      assetDatamaint: { formVisibleBuild, submitting },
    } = this.props;
    return (
      <Modal
        title="楼栋详情"
        width={873}
        visible={formVisibleBuild}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onCancel={this.handleFormCancel}
        footer={[
          <Button key="back" onClick={this.handleFormCancel}>
            关闭
          </Button>,
        ]}
        style={{ top: 20 }}
        bodyStyle={{ height: 550, overflowY: 'scroll' }}
      >
        {this.renderFirstView()}
        {this.renderShowDisCarView()}
        {this.renderShowDrawCarView()}
      </Modal>
    );
  }
}
export default AssetBuildShowMaint;
