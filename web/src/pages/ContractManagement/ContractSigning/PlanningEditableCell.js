import React, { PureComponent } from 'react';
import { Input, Form, Select, InputNumber } from 'antd';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

export const EditableFormRow = Form.create()(EditableRow);

export class EditableCell extends PureComponent {
  // 失去焦点保存
  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      handleSave({ ...record, ...values });
    });
  };

  renderFormItem = (dataIndex, title, record) => {
    // 如果是余额处理方式
    if (dataIndex === 'method') {
      return (
        <FormItem style={{ margin: 0 }}>
          {this.form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: true,
                message: `请选择${title}`,
              },
            ],
            initialValue: record[dataIndex],
          })(
            <Select
              style={{ width: '100%' }}
              onBlur={() => {
                this.save();
              }}
            >
              <Select.Option value="1">节约费用</Select.Option>
              <Select.Option value="2">暂不处理</Select.Option>
            </Select>
          )}
        </FormItem>
      );
    }
    // 合同签订金额
    if (dataIndex === 'amount_signed') {
      return (
        <FormItem style={{ margin: 0 }}>
          {this.form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: true,
                message: `请输入${title}`,
              },
            ],
            initialValue: record[dataIndex],
          })(
            <InputNumber
              onBlur={() => {
                this.save();
              }}
              style={{ width: '100%' }}
            />
          )}
        </FormItem>
      );
    }
  };

  render() {
    const { editable, dataIndex, title, record, handleSave, ...restProps } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;
              return this.renderFormItem(dataIndex, title, record);
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}
