import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, Select, Radio } from 'antd';

@connect(state => ({
  costAccount: state.costAccount,
}))
@Form.create()
class AddNewSalesPlan extends PureComponent {

  componentDidMount() {
    // this.dispatch({
    //   type: 'projectManage/queryCompany',
    // });
  }
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onOKClick = () => {
    const { form, onSubmit } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const formData = { ...values };
      if (formData.photo && formData.photo.length > 0) {
        formData.photo = formData.photo.join('');
      } else {
        formData.photo = '';
      }

      if (formData.asset_type && formData.asset_type.length > 0) {
        formData.asset_type = formData.asset_type.join(',');
      } else {
        formData.asset_type = '';
      }
      onSubmit(formData);
    });
  };

  render() {
    const {
     costAccount: {  addSalesPlanVisible },
      form: { getFieldDecorator },
      onCancel,
    } = this.props;

    return (
      <Modal
      title="新增销售计划"
      width={800}
      visible={addSalesPlanVisible}
      maskClosable={false}
      destroyOnClose
      onOk={this.onOKClick}
      onCancel={onCancel}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}

      >


      </Modal>
    );
  }
}
export default AddNewSalesPlan;