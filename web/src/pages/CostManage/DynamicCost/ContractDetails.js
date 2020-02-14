import React, { PureComponent } from 'react';
import { Modal, Button, Tabs, Card, Spin } from 'antd';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import DicShow from '@/components/DictionaryNew/DicShow';
import styles from './DynamicCostShow.less';
import PaymentInformation from '../../ContractManagement/ContractSigning/PaymentInformation';
import FinancialInformation from '../../ContractManagement/ContractSigning/FinancialInformation';
import VisaChange from '../../ContractManagement/ContractSigning/VisaChange';
import DesignChange from '../../ContractManagement/ContractSigning/DesignChange';
import MaterialPricing from '../../ContractManagement/ContractSigning/MaterialPricing';
import ContractSettlement from '../../ContractManagement/ContractSigning/ContractSettlement';


const { Description } = DescriptionList;

const { TabPane } = Tabs;


@connect(state => ({
    contractSiging: state.contractSiging,
}))
class ContractDetail extends PureComponent {

    state = {
        const_attas: [],
    }

    componentWillMount() {
        const {
            info,
            projectID,
        } = this.props;
        this.dispatch({
            type: 'contractSiging/loadSigingForm',
            payload: {
                type: 'S',
                id: info.contract_id,
                proID: projectID,
            },
        });
        this.dispatch({
            type: 'contractSiging/fetchDesiginOneSiging',
            payload: info.contract_id,
        });
    }

    dispatch = action => {
        const { dispatch } = this.props;
        dispatch(action);
    };

    renderShowView() {

        const {
            contractSiging: {
                formDataSiging,
                planName,
                desiginData,
            },
        } = this.props;

        const attas = formDataSiging.attas ? formDataSiging.attas : [];
        let design = Object.keys(desiginData).length;

        return (
            <div className={styles.main}>
                <div className={styles.form} style={{ marginTop: 25 }}>
                    <DescriptionList title="" size="large" col={2} style={{ marginBottom: 32, width: '100%' }}>
                        <Description term="合同编号" style={{ width: '80%' }}>{formDataSiging.sn ? formDataSiging.sn : ''}</Description>
                    </DescriptionList>
                    <DescriptionList title='' size='large' col={2} style={{ marginBottom: 32, width: '100%' }}>
                        <Description term='合同名称' style={{ width: '50%' }}>{formDataSiging.name}</Description>
                        <Description term='合同类别' style={{ width: '50%' }}>
                            {
                                <DicShow
                                    pcode="contract$#contractType"
                                    code={[formDataSiging.category]}
                                    show={name}
                                />
                            }
                        </Description>
                    </DescriptionList>
                    <DescriptionList title='' size='large' col={2} style={{ marginBottom: 32, width: '100%' }}>
                        <Description term='所属科目' style={{ width: '50%' }}>{formDataSiging.subject}</Description>
                        <Description term='所属科目分项' style={{ width: '50%' }}>{formDataSiging.subject_subitem}</Description>
                    </DescriptionList>
                    <DescriptionList title='' size='large' col={2} style={{ marginBottom: 32, width: '100%' }}>
                        <Description term='选择合约规划' style={{ width: '50%' }}>{planName}</Description>
                        <Description term='虚拟合同' style={{ width: '50%' }}>{formDataSiging.virtual === 0 ? '否' : '是'}</Description>
                    </DescriptionList>
                    <DescriptionList title='' size='large' col={2} style={{ marginBottom: 32, width: '100%' }}>
                        <Description term='合同性质' style={{ width: '50%' }}>
                            {
                                <DicShow
                                    pcode="contract$#contractNature"
                                    code={[formDataSiging.property]}
                                    show={name}
                                />
                            }
                        </Description>
                        <Description term='是否结算' style={{ width: '50%' }}>
                            {formDataSiging.settlement === 0 ? '否' : '是'}
                        </Description>
                    </DescriptionList>
                    <DescriptionList title='' size='large' col={2} style={{ marginBottom: 32, width: '100%' }}>
                        <Description term='甲方单位' style={{ width: '50%' }}>{formDataSiging.jiafang_name}</Description>
                        <Description term='负责人' style={{ width: '50%' }}>{formDataSiging.jiafang_sign}</Description>
                    </DescriptionList>
                    <DescriptionList title='' size='large' col={2} style={{ marginBottom: 32, width: '100%' }}>
                        <Description term='乙方单位' style={{ width: '50%' }}>{formDataSiging.yifang_name}</Description>
                        <Description term='负责人' style={{ width: '50%' }}>{formDataSiging.yifang_sign}</Description>
                    </DescriptionList>
                    <DescriptionList title='' size='large' col={2} style={{ marginBottom: 32, width: '100%' }}>
                        <Description term='丙方单位' style={{ width: '50%' }}>{formDataSiging.bingfang_name}</Description>
                        <Description term='负责人' style={{ width: '50%' }}>{formDataSiging.bingfang_sign}</Description>
                    </DescriptionList>
                    <DescriptionList title='' size='large' col={2} style={{ marginBottom: 32, width: '100%' }}>
                        <Description term='合同金额' style={{ width: '50%' }}>{formDataSiging.amount}元</Description>
                        <Description term='甲供材料金额' style={{ width: '50%' }}>{formDataSiging.jia_stuffs_amount}元</Description>
                    </DescriptionList>
                    <DescriptionList title='' size='large' col={2} style={{ marginBottom: 32, width: '100%' }}>
                        <Description term='不计成本金额' style={{ width: '50%' }}>{formDataSiging.uncost_amount}元</Description>
                        <Description term='有效签约金额' style={{ width: '50%' }}>{formDataSiging.vali_sign_amount}元</Description>
                    </DescriptionList>
                    <DescriptionList title="" size="large" col={2} style={{ marginBottom: 32, width: '100%' }}>
                        <Description term="付款方式" style={{ width: '80%' }}>
                            {
                                <DicShow
                                    pcode="contract$#PaymentMethod"
                                    code={[formDataSiging.pay_type]}
                                    show={name}
                                />
                            }
                        </Description>
                    </DescriptionList>
                    <DescriptionList title="" size="large" col={2} style={{ marginBottom: 32, width: '100%' }}>
                        <Description term="付款条件" style={{ width: '80%' }}>{formDataSiging.pay_precondition}</Description>
                    </DescriptionList>
                    <DescriptionList title="" size="large" col={2} style={{ marginBottom: 32, width: '100%' }}>
                        <Description term="合同内容" style={{ width: '80%' }}>{formDataSiging.content}</Description>
                    </DescriptionList>
                    <DescriptionList title="" size="large" col={2} style={{ marginBottom: 32, width: '100%' }}>
                        <Description term="备注" style={{ width: '80%' }}>{formDataSiging.remark}</Description>
                    </DescriptionList>
                    <DescriptionList title="" size="large" col={2} style={{ marginBottom: 32, width: '100%' }}>
                        <Description term="附件信息" style={{ width: '80%' }}>
                            {
                                attas && attas.length ? (
                                    <div>
                                        {attas.map((item, index) => {
                                            return <a href={(item.url)} key={index} download={item.name}>
                                                {item.name}
                                            </a>
                                        })}
                                    </div>
                                ) : null
                            }
                        </Description>
                    </DescriptionList>
                    <Card>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab='审批流程' key='1'>
                                审批流程待定
                            </TabPane>
                            <TabPane tab='付款信息' key='2'>
                                <PaymentInformation />
                            </TabPane>
                            <TabPane tab='财务信息' key='3'>
                                <FinancialInformation />
                            </TabPane>
                            <TabPane tab='签证变更' key='4'>
                                <VisaChange data={design > 0 ? desiginData[0].visaData : []} />
                            </TabPane>
                            <TabPane tab='设计变更' key='5'>
                                <DesignChange data={design > 0 ? desiginData[0].designData : []} />
                            </TabPane>
                            <TabPane tab='材料批价' key='6'>
                                <MaterialPricing data={design > 0 ? desiginData[0].materialData : []} />
                            </TabPane>
                            <TabPane tab='结算信息' key='7'>
                                <ContractSettlement data={design > 0 ? desiginData[0].settlementData : []} />
                            </TabPane>
                        </Tabs>
                    </Card>
                </div>
            </div>
        );
    }

    render() {

        const {
            formVisiable,
            cancel,
            contractSiging: {
                formDataSiging,
            },
        } = this.props;

        return (
            <Modal
                title='合同详情'
                visible={formVisiable}
                maskClosable={false}
                destroyOnClose
                onCancel={cancel}
                confirmLoading={false}
                footer={[
                    <Button key="back" onClick={cancel}>
                        关闭
                    </Button>,
                ]}
                style={{ top: 20 }}
                bodyStyle={{ height: 700, overflowY: 'scroll' }}
                width={1000}
            >
                {this.renderShowView()}

            </Modal>
        )
    }
}

export default ContractDetail;