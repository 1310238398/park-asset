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
          <Description term="合同编号">{formData.code}</Description>
        </DescriptionList>

        <div className={styles.form} style={{ marginTop: 25 }}>
          <DescriptionList title="" size="large" col={4} style={{ marginBottom: 32 }}>
            <Description term="合同照片">
              <img src={formData.photo} alt="" style={{ width: 60, height: 60 }} />
            </Description>
            <Description term="租金计算方式">
              {formData.rent_calc_method === 1 ? '日租金' : '月租金'}
            </Description>
            <Description term="缴费周期">{formData.payment_cycle}</Description>
            <Description term="提前付款天数">{formData.advance_payment}</Description>
          </DescriptionList>
        </div>
        <div className={styles.form} style={{ marginTop: 25 }}>
          <DescriptionList title="" size="large" col={4} style={{ marginBottom: 32 }}>
            <Description term="租赁开始日期">{formData.lease_start_date}</Description>
            <Description term="租赁结束日期">{formData.lease_end_date}</Description>
            <Description term="是否有免租期">
              {formData.is_rent_free === 1 ? '是' : '否'}
            </Description>
            <Description term="免租截止日期">{formData.rent_free_deadline}</Description>
          </DescriptionList>
        </div>
        <div className={styles.form} style={{ marginTop: 25 }}>
          <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
            <Description term="合同签署日期">{formData.signing_date}</Description>
          </DescriptionList>
        </div>

        <Card title="押金信息" bordered={false}>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="应缴金额">{formData.deposit_due_amount}</Description>
              <Description term="实缴金额">{formData.deposit_actual_amount}</Description>
              <Description term="收据照片">
                <img
                  src={formData.deposit_receipt_photo}
                  alt=""
                  style={{ width: 60, height: 60 }}
                />
              </Description>
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
