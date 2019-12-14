import React, { PureComponent } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Form } from 'antd';


@Form.create()
class ContractPlanInfo extends PureComponent{

    // renderTitle(){
    //     const {
    //         form : { getFieldDecorator },
    //     } = this.props;
    //     return (
    //         <Form>

    //         </Form>
    //     )
    // }
    
    render(){

        const breadcrumbList = [
            { title : '成本管理' },
            { title : '合约规划' },
        ];

        return(
            <PageHeaderLayout title={'合约规划'} breadcrumbList={breadcrumbList}>
            </PageHeaderLayout>
        )
    }
}

export default ContractPlanInfo;