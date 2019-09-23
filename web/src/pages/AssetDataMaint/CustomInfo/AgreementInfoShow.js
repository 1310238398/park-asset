import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Tag } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from '../AssetsBuildInfo.less';

const { Description } = DescriptionList;
@connect(state => ({
  assetDatamaint: state.assetDatamaint,
}))
@Form.create()

//  企业入驻的模态对话框组件。
class AgreementInfoShow extends PureComponent {
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

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onModalCancelClick = () => {
    const { callback } = this.props;
    this.dispatch({
      type: 'assetDatamaint/changeFormVisible',
      payload: false,
    });
    callback();
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

  renderFirstView = () => {
    const {
      assetDatamaint: { formData },
    } = this.props;

    return (
      <div className={styles.main}>
        {/* <Card  bordered={false}> */}
        <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
          <Description term="合同编号">{formData.phone}</Description>
        </DescriptionList>

        <div className={styles.form} style={{ marginTop: 25 }}>
          <DescriptionList title="" size="large" col={4} style={{ marginBottom: 32 }}>
            <Description term="合同照片">{formData.phone}</Description>
            <Description term="租金计算方式">{formData.representative}</Description>
            <Description term="缴费周期">{formData.applicant_name}</Description>
            <Description term="提前付款天数">{formData.applicant_name}</Description>
          </DescriptionList>
        </div>
        <div className={styles.form} style={{ marginTop: 25 }}>
          <DescriptionList title="" size="large" col={4} style={{ marginBottom: 32 }}>
            <Description term="租赁开始日期">{formData.applicant_tel}</Description>
            <Description term="租赁结束日期">{formData.representative}</Description>
            <Description term="是否有免租期">{formData.applicant_name}</Description>
            <Description term="免租截止日期">{formData.applicant_name}</Description>
          </DescriptionList>
        </div>
        <div className={styles.form} style={{ marginTop: 25 }}>
          <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
            <Description term="合同签署日期">{formData.applicant_tel}</Description>
          </DescriptionList>
        </div>

        <Card title="押金信息" bordered={false}>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="应缴金额">{formData.applicant_tel}</Description>
              <Description term="实缴金额">{formData.applicant_tel}</Description>
              <Description term="收据照片">{formData.applicant_tel}</Description>
            </DescriptionList>
          </div>
        </Card>
      </div>
    );
  };

  render() {
    //   enterprise: { formVisible, submitting },
    // } = this.props;

    return <div>{this.renderFirstView()}</div>;
  }
}
export default AgreementInfoShow;
