import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Avatar, Modal, Card, Button, Tag } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './AssetsBuildInfo.less';

const { Description } = DescriptionList;
@connect(state => ({
  enterprise: state.enterprise,
}))
@Form.create()

//  企业入驻的模态对话框组件。
class AssetUnitShowMaint extends PureComponent {
  //  默认的组件挂载时的初始化。
  componentDidMount() {
    const { id, type } = this.props;
    this.dispatch({
      type: 'enterprise/loadForm',
      payload: {
        id,
        type,
      },
    });
  }

  onModalCancelClick = () => {
    const { callback } = this.props;
    this.dispatch({
      type: 'enterprise/changeFormVisible',
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
      enterprise: { formData },
    } = this.props;
    let headerImgUrl = null;

    if (formData.logo) {
      headerImgUrl = formData.logo;
    } else {
      headerImgUrl = '/s/mall/noimage.jpg';
    }

    let pidImage1 = '';
    let pidImage2 = '';
    if (formData.representative_idcard_front) {
      pidImage1 = formData.representative_idcard_front;
    } else {
      pidImage1 = '/s/mall/noimage.jpg';
    }
    if (formData.representative_idcard_back) {
      pidImage2 = formData.representative_idcard_back;
    } else {
      pidImage2 = '/s/mall/noimage.jpg';
    }
    return (
      <div className={styles.main}>
        <Card title="企业基本信息" bordered={false}>
          <div className={styles.topInfo}>
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
              {/* <span>
                企业简介：
                {formData.memo}
              </span> */}
            </div>
          </div>
          <div className={styles.form} style={{ marginTop: 25 }}>
            <DescriptionList title="" size="large" col={3} style={{ marginBottom: 32 }}>
              <Description term="企业电话">{formData.phone}</Description>
              <Description term="法定代表人">{formData.representative}</Description>
              <Description term="企业管理员">{formData.applicant_name}</Description>
              <Description term="联系电话">{formData.applicant_tel}</Description>
            </DescriptionList>
          </div>
        </Card>
        <Card title="经营单位基本信息" bordered={false}>
          <div className={styles.form}>
            <DescriptionList title="" size="large" style={{ marginBottom: 32 }}>
              <Description term="统一社会信用代码">{formData.credit_code}</Description>
            </DescriptionList>
            <DescriptionList col={1} style={{ marginBottom: 32 }}>
              <Description term="经营范围">{formData.business_scope}</Description>
            </DescriptionList>

            <DescriptionList title="" size="large" style={{ marginBottom: 32 }}>
              <Description term="法定代表人信息">
                <div style={{ display: 'flex' }}>
                  {pidImage1 && (
                    <div
                      className={styles.formImage}
                      style={{ width: 248, height: 160, marginLeft: 20 }}
                    >
                      <img src={pidImage1} alt="身份证" />
                    </div>
                  )}
                  {pidImage2 && (
                    <div
                      className={styles.formImage}
                      style={{ width: 248, height: 160, marginLeft: 20 }}
                    >
                      <img src={pidImage2} alt="身份证" />
                    </div>
                  )}
                </div>
              </Description>
            </DescriptionList>

            <DescriptionList>
              <Description term="热门企业">
                {formData.flag && formData.flag === 1 ? '是' : '否'}
              </Description>
            </DescriptionList>
          </div>
        </Card>
      </div>
    );
  };

  render() {
    const {
      enterprise: { formVisible, submitting },
    } = this.props;

    return (
      <Modal
        title="企业详情"
        width={873}
        visible={formVisible}
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
