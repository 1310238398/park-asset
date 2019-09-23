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
class CustomInfoShow extends PureComponent {
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

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  renderFirstView = () => {
    const {
      assetDatamaint: { formData },
    } = this.props;

    return (
      <div className={styles.main}>
        {/* <Card  bordered={false}> */}
        <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
          <Description term="租户类型">{formData.phone}</Description>
        </DescriptionList>
        <Card title="基本信息" bordered={false}>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="客户名称">{formData.phone}</Description>
              <Description term="营业执照编号">{formData.representative}</Description>
              <Description term="行业分类">{formData.applicant_name}</Description>
            </DescriptionList>
          </div>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="联系人姓名">{formData.applicant_tel}</Description>
              <Description term="联系人电话">{formData.representative}</Description>
              <Description term="邮箱号">{formData.applicant_name}</Description>
            </DescriptionList>
          </div>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="联系人地址">{formData.applicant_tel}</Description>
            </DescriptionList>
          </div>

          {/* 个人信息显示 */}
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="租户姓名">{formData.applicant_tel}</Description>
              <Description term="租户电话">{formData.representative}</Description>
              <Description term="邮箱号">{formData.applicant_name}</Description>
            </DescriptionList>
          </div>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="业主地址">{formData.applicant_tel}</Description>
            </DescriptionList>
          </div>
        </Card>

        <Card title="开票信息" bordered={false}>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="发票抬头">{formData.applicant_tel}</Description>
              <Description term="税号">{formData.applicant_tel}</Description>
              <Description term="开户行及账号">{formData.applicant_tel}</Description>
            </DescriptionList>
          </div>
        </Card>
      </div>
    );
  };

  render() {
    // const {
    //   enterprise: { formVisible, submitting },
    // } = this.props;

    return <div>{this.renderFirstView()}</div>;
  }
}
export default CustomInfoShow;
