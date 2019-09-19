import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Tabs, Alert, Steps, Button } from 'antd';
import PicturesWall from '../../components/PicturesWall/PicturesWall';
import styles from './AssetDataMaint.less';

@connect(state => ({
  assetDatamaint: state.assetDatamaint,
  loading: state.loading.models.assetDatamaint,
}))
@Form.create()
class AssetOfficeTemplate extends PureComponent {
  state = {
    current: 0,
  };

  componentDidMount() {
    // const { record_id, type } = this.props.location.query;
    this.dispatch({
      type: 'assetDatamaint/fetch',
      search: {},
      pagination: {},
    });
  }

  onChange = current => {
    this.setState({ current });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // 下载模板
  downLoad = () => {
    // console.log('点击下载事件');
  };

  renderTitle = () => {
    return (
      <div>
        模板下载
        <a onClick={() => this.downLoad()} style={{ marginLeft: '20px' }}>
          下载模板
        </a>
      </div>
    );
  };

  renderTitleTwo = () => {
    return (
      <div style={{ display: 'flex' }}>
        模板上传
        <a style={{ marginLeft: '20px' }}>
          <PicturesWall bucket="oper" num={1} listType="text" />
        </a>
      </div>
    );
  };

  render() {
    const { TabPane } = Tabs;
    const { Step } = Steps;
    const { current } = this.state;
    return (
      <div>
        <Card>
          <Alert message="请选择写字楼基础信息创建方式" type="info" showIcon />
          <Tabs defaultActiveKey="1">
            <TabPane tab="批量导入" key="1">
              <Alert
                message=""
                description="此方式无需手动录入资产信息，可按照模板的形式整理完成后进行模板导入更新，所有资产可直接同步至平台，

              图片无法进行导入，还需手动上传，注意此处只是写字楼的基本信息，若想要导入其他资产类别的信息，请选择
              
              对应的不同模块进行导入"
                type="warning"
              />
              <div style={{ marginTop: '20px' }}>
                <Steps direction="vertical" current={current} onChange={this.onChange}>
                  <Step
                    title={this.renderTitle()}
                    description="下载此模板，按照此模板要求，将写字楼的基本信息进行录入，并进行保存"
                  />
                  <Step
                    title={this.renderTitleTwo()}
                    description="将保存的模板文件，点击“上传”按钮，进行上传"
                  />
                  <Step
                    title="完成更新"
                    description="模板上传完成，点击下部的“完成”按钮即可完成数据更新，数据更新完成后，对于需要调整的地方，可直接选择
资产，点击“编辑”按钮进行编辑即可。"
                  />
                </Steps>
              </div>
              <div className={styles.BtnFin}>
                <Button type="primary">完成</Button>
              </div>
            </TabPane>
            <TabPane tab="手动创建" key="2">
              <div className={styles.BtnFin}>
                <Button type="primary">新建楼栋</Button>
              </div>
              <Steps current={3}>
                <Step title="第一步  新建楼栋" description="" />
                <Step title="第二步  新建单元、楼层" description="" />
                <Step title="第三步   新建门牌" description="" />
              </Steps>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default AssetOfficeTemplate;
