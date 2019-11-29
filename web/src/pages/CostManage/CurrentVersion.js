import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Form,
    Input,
    Modal,
    Dropdown,
    Popconfirm,
    Select,
    Radio,
    Table,
    message,
    Divider,
    Button,
    InputNumber,
} from 'antd';
import styles from './CostAccount.less';
import { } from '@/services/costAccount';
const FormItem = Form.Item;
const EditableContext = React.createContext();
class EditableCell extends React.Component {

    state = {
        toposNode: [
            "税种1",
            "税种2",
            "税种3"
        ]
    }
    renderToposNode = (data) => {
        let ret = [];
        ret = data.map(obj => {
            return (<Select.Option key={obj} value={obj}>{obj}</Select.Option>)
        })
        return ret;
    }
    getInput = () => {
        let handleChange = (value) => {
            console.log(value);
        }
        if (this.props.inputType === 'number') {
            if (this.props.dataIndex === 'tax_rate') {

                return <InputNumber max={1} min={0} step={0.01} />;
            }
            else {
                return <InputNumber />;
            }

        }
        else if (this.props.inputType === 'select') {
            const { toposNode } = this.state;
            return (
                <div>
                    <Select
                        //mode="multiple"
                        style={{ width: 120 }}

                        onBlur={handleChange}
                    // onChange={handleChange}
                    >
                        {this.renderToposNode(toposNode)}
                    </Select>
                </div>
            )
        }
        return <Input />;
    };

    renderCell = ({ getFieldDecorator }) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            // form: { getFieldDecorator, getFieldValue },
            children,
            ...restProps
        } = this.props;

        return (
            <td {...restProps} style={{ paddingLeft: 5, paddingRight: 5 }}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `请输入 ${title}!`,
                                },
                            ],
                            initialValue: record[dataIndex],
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                        children
                    )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}
@connect(state => ({
    // projectManage: state.projectManage,
    costAccount: state.costAccount,
    currentVersion: state.currentVersion,
    // costList: state.costList,
    loading: state.loading.models.currentVersion,
}))
@Form.create()
class CurrentVersion extends PureComponent {
    state = {
        tableData: [],
        editingKey: '',
    };

    componentDidMount = async () => {

    }


    dispatch = action => {
        const { dispatch } = this.props;
        dispatch(action);
    };

    render() {

        const components = {
            body: {
                // row: EditableFormRow,
                cell: EditableCell,
            },
        };

        return (
            <EditableContext.Provider value={this.props.form}>
           <div>哈哈哈哈</div>
             </EditableContext.Provider>    
        );
    }

}
export default CurrentVersion;