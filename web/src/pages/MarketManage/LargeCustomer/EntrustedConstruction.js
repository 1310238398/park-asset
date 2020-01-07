import React, { PureComponent } from 'react';
import { connect } from 'dva';
@connect(state => ({
  projectManage: state.projectManage,
  // loading: state.loading.models.projectManage,
}))
class EntrustedConstruction extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };
  componentDidMount() {}
  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  renderNewForm() {
      return (
          <div></div>
      );
  }
  render() {
    return <PageHeaderLayout title="项目管理" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>

       
        </Card> 
        {this.renderNewForm()}
    </PageHeaderLayout>;
  }
}
export default EntrustedConstruction;
